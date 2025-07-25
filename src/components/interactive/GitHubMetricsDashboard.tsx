"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGitHub } from "@/hooks/useGitHub";
import {
  formatNumber,
  formatRelativeTime,
  getLanguageColor,
  calculateCodingActivity,
  calculateRepositoryInsights,
} from "@/lib/github-utils";
import type { GitHubData, Repository, LanguageStats, Commit } from "@/types";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  loading,
  className = "",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-white mb-1">
            {typeof value === "number" ? formatNumber(value) : value}
          </div>
          {change !== undefined && (
            <div
              className={`text-sm flex items-center ${
                trend === "up"
                  ? "text-green-400"
                  : trend === "down"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {trend === "stable" && "→"}
              <span className="ml-1">
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

interface LanguageChartProps {
  languages: LanguageStats;
  loading?: boolean;
}

function LanguageChart({ languages, loading }: LanguageChartProps) {
  const sortedLanguages = Object.entries(languages || {})
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between mb-1">
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-12"></div>
            </div>
            <div className="h-2 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedLanguages.map(([language, data], index) => (
        <motion.div
          key={language}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{language}</span>
            <span className="text-gray-400">{data.percentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: data.color }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface ActivityFeedProps {
  activity: any;
  loading?: boolean;
}

function ActivityFeed({ activity, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allActivity = [
    ...(activity?.recentCommits || []).map((commit: any) => ({
      type: "commit",
      title: commit.message.split("\n")[0],
      subtitle: `${commit.repository}`,
      time: commit.author.date,
      url: commit.url,
    })),
    ...(activity?.recentPullRequests || []).map((pr: any) => ({
      type: "pr",
      title: pr.title,
      subtitle: pr.repository,
      time: pr.updatedAt,
      url: pr.url,
    })),
    ...(activity?.recentIssues || []).map((issue: any) => ({
      type: "issue",
      title: issue.title,
      subtitle: issue.repository,
      time: issue.updatedAt,
      url: issue.url,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return "🔄";
      case "pr":
        return "🔀";
      case "issue":
        return "🐛";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <AnimatePresence>
        {allActivity.map((item, index) => (
          <motion.div
            key={`${item.type}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="flex space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => window.open(item.url, "_blank")}
          >
            <div className="text-lg">{getActivityIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">
                {item.subtitle} • {formatRelativeTime(new Date(item.time))}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ContributionHeatmapProps {
  contributions: any;
  loading?: boolean;
}

function ContributionHeatmap({
  contributions,
  loading,
}: ContributionHeatmapProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-53 gap-1">
        {[...Array(371)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gray-700 rounded-sm animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  const weeks = contributions?.weeks || [];

  const getContributionColor = (level: number) => {
    const colors = [
      "bg-gray-800", // 0 contributions
      "bg-green-900", // 1-2 contributions
      "bg-green-700", // 3-5 contributions
      "bg-green-500", // 6-10 contributions
      "bg-green-300", // 10+ contributions
    ];
    return colors[Math.min(level, 4)];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-300">
          Contribution Activity
        </h4>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-53 gap-1 overflow-x-auto">
        {weeks.map((week: any, weekIndex: number) =>
          week.days.map((day: any, dayIndex: number) => (
            <motion.div
              key={`${weekIndex}-${dayIndex}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
              className={`w-3 h-3 rounded-sm ${getContributionColor(
                day.level
              )} hover:ring-2 hover:ring-white/20 transition-all cursor-pointer`}
              title={`${day.count} contributions on ${day.date.toDateString()}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CodingStatisticsProps {
  activity: any;
  loading?: boolean;
}

function CodingStatistics({ activity, loading }: CodingStatisticsProps) {
  const chartData = useMemo(() => {
    if (!activity?.recentCommits) return null;

    const codingActivity = calculateCodingActivity(activity.recentCommits);

    // Hourly distribution data
    const hourlyData = codingActivity.hourlyDistribution.map((count, hour) => ({
      hour: `${hour}:00`,
      commits: count,
      label:
        hour < 12 ? `${hour || 12}AM` : `${hour === 12 ? 12 : hour - 12}PM`,
    }));

    // Daily distribution data
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData = codingActivity.dailyDistribution.map((count, day) => ({
      day: dayNames[day],
      commits: count,
    }));

    // Monthly distribution data
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = codingActivity.monthlyDistribution.map(
      (count, month) => ({
        month: monthNames[month],
        commits: count,
      })
    );

    return {
      hourlyData,
      dailyData,
      monthlyData,
      stats: {
        mostActiveHour: codingActivity.mostActiveHour,
        mostActiveDay: dayNames[codingActivity.mostActiveDay],
        mostActiveMonth: monthNames[codingActivity.mostActiveMonth],
        averageCommitsPerDay: codingActivity.averageCommitsPerDay.toFixed(1),
        totalCommits: codingActivity.totalCommits,
      },
    };
  }, [activity]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {chartData.stats.mostActiveHour}:00
          </div>
          <div className="text-xs text-gray-400">Most Active Hour</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {chartData.stats.mostActiveDay}
          </div>
          <div className="text-xs text-gray-400">Most Active Day</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {chartData.stats.mostActiveMonth}
          </div>
          <div className="text-xs text-gray-400">Most Active Month</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {chartData.stats.averageCommitsPerDay}
          </div>
          <div className="text-xs text-gray-400">Avg Commits/Day</div>
        </div>
      </div>

      {/* Hourly Activity Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Coding Activity by Hour
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              stroke="#9CA3AF"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Activity Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Coding Activity by Day of Week
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Bar dataKey="commits" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface RepositoryInsightsProps {
  repositories: Repository[];
  loading?: boolean;
}

function RepositoryInsights({
  repositories,
  loading,
}: RepositoryInsightsProps) {
  const insights = useMemo(() => {
    if (!repositories?.length) return null;
    return calculateRepositoryInsights(repositories);
  }, [repositories]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex justify-between">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const languageData = Object.entries(insights.languageDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({
      name: language,
      value: count,
      color: getLanguageColor(language),
    }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {formatNumber(insights.totalStars)}
          </div>
          <div className="text-xs text-gray-400">Total Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(insights.totalForks)}
          </div>
          <div className="text-xs text-gray-400">Total Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {insights.languages}
          </div>
          <div className="text-xs text-gray-400">Languages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {insights.averageStars.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Avg Stars</div>
        </div>
      </div>

      {/* Top Repositories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Top Repositories</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-sm text-gray-300">Most Starred</span>
            <span className="text-sm text-white font-medium">
              {insights.mostStarredRepo?.name} (
              {insights.mostStarredRepo?.stars}⭐)
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-sm text-gray-300">Most Forked</span>
            <span className="text-sm text-white font-medium">
              {insights.mostForkedRepo?.name} ({insights.mostForkedRepo?.forks}
              🍴)
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-sm text-gray-300">Newest</span>
            <span className="text-sm text-white font-medium">
              {insights.newestRepo?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Language Distribution */}
      {languageData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Language Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Activity Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Repository Activity Status
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Active (30 days)</span>
            <span className="text-green-400 font-medium">
              {insights.activityDistribution.active}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Moderate (90 days)</span>
            <span className="text-yellow-400 font-medium">
              {insights.activityDistribution.moderate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Inactive (90+ days)</span>
            <span className="text-red-400 font-medium">
              {insights.activityDistribution.inactive}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GitHubMetricsDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(5 * 60 * 1000); // 5 minutes
  const [isLive, setIsLive] = useState(true);

  // Use SWR for caching and real-time updates
  const { data: overviewData, error: overviewError } = useSWR(
    isLive ? "/api/github/stats?metric=overview" : null,
    fetcher,
    { refreshInterval }
  );

  const { data: languageData, error: languageError } = useSWR(
    isLive ? "/api/github/stats?metric=languages" : null,
    fetcher,
    { refreshInterval }
  );

  const { data: activityData, error: activityError } = useSWR(
    isLive ? "/api/github?type=activity" : null,
    fetcher,
    { refreshInterval }
  );

  const { data: contributionData, error: contributionError } = useSWR(
    isLive ? "/api/github?type=contributions" : null,
    fetcher,
    { refreshInterval }
  );

  const { data: repositoryData, error: repositoryError } = useSWR(
    isLive ? "/api/github/stats?metric=repositories" : null,
    fetcher,
    { refreshInterval }
  );

  const isLoading = !overviewData && !overviewError;
  const hasError =
    overviewError ||
    languageError ||
    activityError ||
    contributionError ||
    repositoryError;

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const changeRefreshInterval = (interval: number) => {
    setRefreshInterval(interval);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">GitHub Metrics</h2>
          <p className="text-gray-400">
            Real-time development activity and statistics
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLiveUpdates}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isLive
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {isLive ? "🟢 Live" : "⏸️ Paused"}
            </button>

            <select
              value={refreshInterval}
              onChange={(e) => changeRefreshInterval(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
            >
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
              <option value={900000}>15m</option>
              <option value={1800000}>30m</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <p className="text-red-400 text-sm">
            ⚠️ Unable to fetch GitHub data. Please check your configuration.
          </p>
        </motion.div>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Repositories"
          value={overviewData?.data?.totalRepos || 0}
          icon="📁"
          loading={isLoading}
        />
        <MetricCard
          title="Total Stars"
          value={overviewData?.data?.totalStars || 0}
          icon="⭐"
          loading={isLoading}
        />
        <MetricCard
          title="Current Streak"
          value={`${overviewData?.data?.currentStreak || 0} days`}
          icon="🔥"
          loading={isLoading}
        />
        <MetricCard
          title="Total Contributions"
          value={overviewData?.data?.totalContributions || 0}
          icon="📊"
          loading={isLoading}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Languages
          </h3>
          <LanguageChart
            languages={
              languageData?.data?.reduce((acc: any, lang: any) => {
                acc[lang.name] = lang;
                return acc;
              }, {}) || {}
            }
            loading={!languageData && !languageError}
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <ActivityFeed
            activity={activityData?.data}
            loading={!activityData && !activityError}
          />
        </motion.div>

        {/* Repository Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Repository Insights
          </h3>
          <RepositoryInsights
            repositories={repositoryData?.data?.repositories || []}
            loading={!repositoryData && !repositoryError}
          />
        </motion.div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Coding Statistics
          </h3>
          <CodingStatistics
            activity={activityData?.data}
            loading={!activityData && !activityError}
          />
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Live Metrics
          </h3>
          <div className="space-y-4">
            {/* Live Status Indicators */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Status</span>
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
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white text-sm">
                {formatRelativeTime(new Date())}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Refresh Rate</span>
              <span className="text-white text-sm">
                {refreshInterval / 1000}s
              </span>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-3 py-2 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  🔄 Force Refresh
                </button>
                <button
                  onClick={() => {
                    // Clear cache via API
                    fetch("/api/github", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "clear-cache" }),
                    });
                  }}
                  className="w-full px-3 py-2 text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  🗑️ Clear Cache
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contribution Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <ContributionHeatmap
          contributions={contributionData?.data}
          loading={!contributionData && !contributionError}
        />
      </motion.div>
    </div>
  );
}
