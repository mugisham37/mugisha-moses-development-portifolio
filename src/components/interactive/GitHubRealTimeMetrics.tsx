"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { formatNumber, formatRelativeTime } from "@/lib/github-utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MetricTile {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon: string;
  color: string;
  description?: string;
}

interface GitHubRealTimeMetricsProps {
  refreshInterval?: number;
  showTrends?: boolean;
  className?: string;
}

export default function GitHubRealTimeMetrics({
  refreshInterval = 30000, // 30 seconds
  showTrends = true,
  className = "",
}: GitHubRealTimeMetricsProps) {
  const [previousData, setPreviousData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch real-time overview data
  const { data: overviewData, error: overviewError } = useSWR(
    "/api/github/stats?metric=overview",
    fetcher,
    { refreshInterval }
  );

  // Fetch repository data for additional metrics
  const { data: repoData, error: repoError } = useSWR(
    "/api/github/stats?metric=repositories",
    fetcher,
    { refreshInterval }
  );

  // Fetch activity data
  const { data: activityData, error: activityError } = useSWR(
    "/api/github?type=activity",
    fetcher,
    { refreshInterval }
  );

  // Update last update time and track changes
  useEffect(() => {
    if (overviewData?.data) {
      if (previousData && showTrends) {
        // Calculate trends here if needed
      }
      setPreviousData(overviewData.data);
      setLastUpdate(new Date());
    }
  }, [overviewData, previousData, showTrends]);

  const isLoading = !overviewData && !overviewError;
  const hasError = overviewError || repoError || activityError;

  // Calculate metrics
  const metrics: MetricTile[] = [
    {
      label: "Total Stars",
      value: formatNumber(overviewData?.data?.totalStars || 0),
      icon: "⭐",
      color: "text-yellow-400",
      description: "Stars across all repositories",
    },
    {
      label: "Total Forks",
      value: formatNumber(overviewData?.data?.totalForks || 0),
      icon: "🍴",
      color: "text-blue-400",
      description: "Forks across all repositories",
    },
    {
      label: "Repositories",
      value: overviewData?.data?.totalRepos || 0,
      icon: "📁",
      color: "text-green-400",
      description: "Public repositories",
    },
    {
      label: "Current Streak",
      value: `${overviewData?.data?.currentStreak || 0} days`,
      icon: "🔥",
      color: "text-red-400",
      description: "Current contribution streak",
    },
    {
      label: "Followers",
      value: formatNumber(overviewData?.data?.followers || 0),
      icon: "👥",
      color: "text-purple-400",
      description: "GitHub followers",
    },
    {
      label: "Contributions",
      value: formatNumber(overviewData?.data?.totalContributions || 0),
      icon: "📊",
      color: "text-indigo-400",
      description: "Total contributions this year",
    },
  ];

  // Live activity metrics
  const activityMetrics = [
    {
      label: "Recent Commits",
      value: activityData?.data?.recentCommits?.length || 0,
      icon: "🔄",
      color: "text-blue-400",
    },
    {
      label: "Open PRs",
      value:
        activityData?.data?.recentPullRequests?.filter(
          (pr: any) => pr.state === "open"
        )?.length || 0,
      icon: "🔀",
      color: "text-green-400",
    },
    {
      label: "Open Issues",
      value:
        activityData?.data?.recentIssues?.filter(
          (issue: any) => issue.state === "open"
        )?.length || 0,
      icon: "🐛",
      color: "text-yellow-400",
    },
  ];

  if (hasError) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load real-time metrics</p>
          <p className="text-sm text-gray-400 mt-1">
            Check your GitHub API configuration
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
          <p className="text-sm text-gray-400">
            Real-time GitHub statistics and activity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live</span>
          </div>

          {/* Last update */}
          <div className="text-xs text-gray-400">
            Updated {formatRelativeTime(lastUpdate)}
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">
                  {metric.label}
                </span>
                <span className={`text-lg ${metric.color}`}>{metric.icon}</span>
              </div>

              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  {metric.description && (
                    <div className="text-xs text-gray-500">
                      {metric.description}
                    </div>
                  )}
                  {metric.change !== undefined && showTrends && (
                    <div
                      className={`text-xs flex items-center mt-1 ${
                        metric.trend === "up"
                          ? "text-green-400"
                          : metric.trend === "down"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {metric.trend === "up" && "↗"}
                      {metric.trend === "down" && "↘"}
                      {metric.trend === "stable" && "→"}
                      <span className="ml-1">
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Activity Metrics */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Recent Activity
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {activityMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center"
            >
              <div className={`text-2xl mb-1 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-lg font-bold text-white">
                {isLoading ? (
                  <div className="animate-pulse h-5 bg-gray-700 rounded w-8 mx-auto"></div>
                ) : (
                  metric.value
                )}
              </div>
              <div className="text-xs text-gray-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          System Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">API Connection</span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasError ? "bg-red-400" : "bg-green-400"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  hasError ? "text-red-400" : "text-green-400"
                }`}
              >
                {hasError ? "Error" : "Connected"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Refresh Rate</span>
            <span className="text-sm text-white">
              {refreshInterval / 1000}s
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Data Freshness</span>
            <span className="text-sm text-white">
              {formatRelativeTime(lastUpdate)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            🔄 Force Refresh
          </button>
          <button
            onClick={() => {
              fetch("/api/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "clear-cache" }),
              });
            }}
            className="px-3 py-2 text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            🗑️ Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
