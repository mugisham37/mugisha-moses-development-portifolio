"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  formatNumber,
  formatDate,
  getLanguageColor,
  calculateRepositoryInsights,
} from "@/lib/github-utils";
import type { Repository } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

function ChartCard({
  title,
  description,
  children,
  loading,
  className = "",
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="h-64">{children}</div>
      )}
    </motion.div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? formatNumber(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface GitHubRepositoryInsightsProps {
  className?: string;
}

export default function GitHubRepositoryInsights({
  className = "",
}: GitHubRepositoryInsightsProps) {
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y">("6m");

  // Fetch repositories data
  const { data: repoData, error: repoError } = useSWR(
    "/api/github?type=repositories",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 } // 10 minutes
  );

  const repositories: Repository[] = repoData?.data || [];
  const isLoading = !repoData && !repoError;

  // Process data for charts
  const chartData = useMemo(() => {
    if (!repositories.length) return null;

    // Language distribution
    const languageStats = repositories.reduce((acc, repo) => {
      if (repo.language && repo.language !== "Unknown") {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const languageData = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([language, count]) => ({
        name: language,
        value: count,
        color: getLanguageColor(language),
      }));

    // Stars distribution
    const starsData = repositories
      .filter((repo) => repo.stars > 0)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10)
      .map((repo) => ({
        name:
          repo.name.length > 15
            ? repo.name.substring(0, 15) + "..."
            : repo.name,
        stars: repo.stars,
        forks: repo.forks,
      }));

    // Repository size distribution
    const sizeRanges = [
      { name: "< 1MB", min: 0, max: 1024, count: 0 },
      { name: "1-10MB", min: 1024, max: 10240, count: 0 },
      { name: "10-50MB", min: 10240, max: 51200, count: 0 },
      { name: "50-100MB", min: 51200, max: 102400, count: 0 },
      { name: "> 100MB", min: 102400, max: Infinity, count: 0 },
    ];

    repositories.forEach((repo) => {
      const range = sizeRanges.find(
        (r) => repo.size >= r.min && repo.size < r.max
      );
      if (range) range.count++;
    });

    const sizeData = sizeRanges.filter((range) => range.count > 0);

    // Activity over time (simplified - based on update dates)
    const now = new Date();
    const months = [];
    const monthCount =
      timeRange === "1m"
        ? 1
        : timeRange === "3m"
        ? 3
        : timeRange === "6m"
        ? 6
        : 12;

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        updates: 0,
        commits: 0,
      });
    }

    repositories.forEach((repo) => {
      const updateDate = new Date(repo.updatedAt);
      const monthIndex = months.findIndex((m) => {
        const [monthName, year] = m.month.split(" ");
        const monthDate = new Date(
          `20${year}`,
          new Date(`${monthName} 1, 2000`).getMonth(),
          1
        );
        return (
          updateDate.getMonth() === monthDate.getMonth() &&
          updateDate.getFullYear() === monthDate.getFullYear()
        );
      });

      if (monthIndex !== -1) {
        months[monthIndex].updates++;
      }
    });

    const activityData = months;

    // Repository creation timeline
    const creationData = repositories
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .reduce((acc, repo) => {
        const year = new Date(repo.createdAt).getFullYear();
        const existing = acc.find((item) => item.year === year);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ year, count: 1 });
        }
        return acc;
      }, [] as { year: number; count: number }[]);

    return {
      languageData,
      starsData,
      sizeData,
      activityData,
      creationData,
    };
  }, [repositories, timeRange]);

  // Summary statistics
  const stats = useMemo(() => {
    if (!repositories.length) return null;

    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
    const totalSize = repositories.reduce((sum, repo) => sum + repo.size, 0);
    const languages = new Set(repositories.map((repo) => repo.language)).size;

    const mostStarred = repositories.reduce((max, repo) =>
      repo.stars > max.stars ? repo : max
    );

    const mostRecent = repositories.reduce((newest, repo) =>
      new Date(repo.updatedAt) > new Date(newest.updatedAt) ? repo : newest
    );

    const avgStars = totalStars / repositories.length;
    const avgSize = totalSize / repositories.length;

    return {
      totalRepos: repositories.length,
      totalStars,
      totalForks,
      totalSize: totalSize / 1024, // Convert to MB
      languages,
      mostStarred,
      mostRecent,
      avgStars,
      avgSize: avgSize / 1024, // Convert to MB
    };
  }, [repositories]);

  if (repoError) {
    return (
      <div
        className={`bg-red-500/10 border border-red-500/20 rounded-xl p-6 ${className}`}
      >
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to Load Repository Data
          </h3>
          <p className="text-red-300 text-sm">
            Unable to fetch GitHub repository insights. Please check your
            configuration.
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
          <h2 className="text-2xl font-bold text-white">Repository Insights</h2>
          <p className="text-gray-400">
            Detailed analysis of your GitHub repositories
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {stats.totalRepos}
            </div>
            <div className="text-sm text-gray-400">Total Repositories</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.totalStars)}
            </div>
            <div className="text-sm text-gray-400">Total Stars</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.totalForks)}
            </div>
            <div className="text-sm text-gray-400">Total Forks</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {stats.languages}
            </div>
            <div className="text-sm text-gray-400">Languages Used</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <ChartCard
          title="Language Distribution"
          description="Programming languages used across repositories"
          loading={isLoading}
        >
          {chartData?.languageData && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.languageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Stars Distribution */}
        <ChartCard
          title="Most Starred Repositories"
          description="Repositories with the highest star counts"
          loading={isLoading}
        >
          {chartData?.starsData && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.starsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stars" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Repository Size Distribution */}
        <ChartCard
          title="Repository Size Distribution"
          description="Distribution of repository sizes"
          loading={isLoading}
        >
          {chartData?.sizeData && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.sizeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Activity Timeline */}
        <ChartCard
          title="Repository Activity"
          description="Repository updates over time"
          loading={isLoading}
        >
          {chartData?.activityData && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.activityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="updates"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Repository Creation Timeline */}
      {chartData?.creationData && chartData.creationData.length > 1 && (
        <ChartCard
          title="Repository Creation Timeline"
          description="Number of repositories created each year"
          loading={isLoading}
          className="col-span-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.creationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
