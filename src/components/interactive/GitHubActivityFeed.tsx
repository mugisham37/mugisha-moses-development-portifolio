"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { formatRelativeTime, formatDate } from "@/lib/github-utils";
import type { ActivityData, Commit, PullRequest, Issue } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ActivityItem {
  id: string;
  type: "commit" | "pr" | "issue";
  title: string;
  subtitle: string;
  description?: string;
  time: Date;
  url: string;
  repository: string;
  status?: string;
  icon: string;
  color: string;
}

interface GitHubActivityFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  refreshInterval?: number;
  className?: string;
}

export default function GitHubActivityFeed({
  maxItems = 20,
  showFilters = false,
  refreshInterval = 5 * 60 * 1000, // 5 minutes
  className = "",
}: GitHubActivityFeedProps) {
  const [filter, setFilter] = useState<"all" | "commit" | "pr" | "issue">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"time" | "repository">("time");

  // Fetch activity data with SWR
  const {
    data: activityData,
    error,
    mutate,
  } = useSWR("/api/github?type=activity", fetcher, { refreshInterval });

  const activityItems = useMemo(() => {
    if (!activityData?.data) return [];

    const items: ActivityItem[] = [];

    // Process commits
    activityData.data.recentCommits?.forEach((commit: Commit) => {
      items.push({
        id: `commit-${commit.sha}`,
        type: "commit",
        title: commit.message.split("\n")[0],
        subtitle: `Committed to ${commit.repository}`,
        description: commit.message.split("\n").slice(1).join("\n").trim(),
        time: new Date(commit.author.date),
        url: commit.url,
        repository: commit.repository,
        icon: "🔄",
        color: "text-blue-400",
      });
    });

    // Process pull requests
    activityData.data.recentPullRequests?.forEach((pr: PullRequest) => {
      items.push({
        id: `pr-${pr.id}`,
        type: "pr",
        title: pr.title,
        subtitle: `Pull request in ${pr.repository}`,
        time: new Date(pr.updatedAt),
        url: pr.url,
        repository: pr.repository,
        status: pr.state,
        icon: pr.state === "merged" ? "🔀" : pr.state === "open" ? "🟢" : "🔴",
        color:
          pr.state === "merged"
            ? "text-purple-400"
            : pr.state === "open"
            ? "text-green-400"
            : "text-red-400",
      });
    });

    // Process issues
    activityData.data.recentIssues?.forEach((issue: Issue) => {
      items.push({
        id: `issue-${issue.id}`,
        type: "issue",
        title: issue.title,
        subtitle: `Issue in ${issue.repository}`,
        time: new Date(issue.updatedAt),
        url: issue.url,
        repository: issue.repository,
        status: issue.state,
        icon: issue.state === "open" ? "🐛" : "✅",
        color: issue.state === "open" ? "text-yellow-400" : "text-green-400",
      });
    });

    // Filter items
    const filteredItems =
      filter === "all" ? items : items.filter((item) => item.type === filter);

    // Sort items
    const sortedItems = filteredItems.sort((a, b) => {
      if (sortBy === "time") {
        return b.time.getTime() - a.time.getTime();
      } else {
        return a.repository.localeCompare(b.repository);
      }
    });

    return sortedItems.slice(0, maxItems);
  }, [activityData, filter, sortBy, maxItems]);

  const isLoading = !activityData && !error;

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load activity feed</p>
          <button
            onClick={() => mutate()}
            className="mt-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
          <p className="text-sm text-gray-400">
            Live GitHub activity and contributions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => mutate()}
            className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Filter:</span>
            {["all", "commit", "pr", "issue"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === filterType
                    ? "bg-blue-500/30 text-blue-400 border border-blue-500/50"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30"
                }`}
              >
                {filterType === "all"
                  ? "All"
                  : filterType === "commit"
                  ? "Commits"
                  : filterType === "pr"
                  ? "PRs"
                  : "Issues"}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
            >
              <option value="time">By Time</option>
              <option value="repository">By Repository</option>
            </select>
          </div>
        </div>
      )}

      {/* Activity Items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex space-x-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activityItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No activity found</p>
          </div>
        ) : (
          <AnimatePresence>
            {activityItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => window.open(item.url, "_blank")}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-lg">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.subtitle}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0 ml-2 text-right">
                      <div className="text-xs text-gray-400">
                        {formatRelativeTime(item.time)}
                      </div>
                      {item.status && (
                        <div className={`text-xs mt-1 ${item.color}`}>
                          {item.status}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Repository tag */}
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                      📁 {item.repository}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {activityItems.length > 0 && (
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            Showing {activityItems.length} of {activityItems.length} activities
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Updates every {refreshInterval / 1000 / 60} minutes
          </p>
        </div>
      )}
    </div>
  );
}
