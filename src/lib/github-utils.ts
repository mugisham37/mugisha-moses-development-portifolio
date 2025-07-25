import type {
  Repository,
  Commit,
  ContributionData,
  ContributionWeek,
  ContributionDay,
} from "@/types";

/**
 * Calculate contribution streaks from commit data
 */
export function calculateContributionStreaks(commits: Commit[]): {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
} {
  if (commits.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalContributions: 0 };
  }

  // Group commits by date
  const commitsByDate = new Map<string, number>();

  commits.forEach((commit) => {
    const dateKey = commit.author.date.toISOString().split("T")[0];
    commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
  });

  const sortedDates = Array.from(commitsByDate.keys()).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Check if current streak is active (commits today or yesterday)
  const hasCommitsToday = commitsByDate.has(todayStr);
  const hasCommitsYesterday = commitsByDate.has(yesterdayStr);
  const isCurrentStreakActive = hasCommitsToday || hasCommitsYesterday;

  // Calculate streaks
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const prevDate = i > 0 ? sortedDates[i - 1] : null;

    if (prevDate) {
      const daysDiff = Math.floor(
        (new Date(currentDate).getTime() - new Date(prevDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }

    // Update current streak if this is part of the active streak
    if (
      isCurrentStreakActive &&
      (currentDate === todayStr || currentDate === yesterdayStr)
    ) {
      currentStreak = tempStreak;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  if (!isCurrentStreakActive) {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak,
    totalContributions: commits.length,
  };
}

/**
 * Generate contribution calendar data
 */
export function generateContributionCalendar(
  commits: Commit[]
): ContributionWeek[] {
  const commitsByDate = new Map<string, number>();

  commits.forEach((commit) => {
    const dateKey = commit.author.date.toISOString().split("T")[0];
    commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
  });

  const weeks: ContributionWeek[] = [];
  const today = new Date();

  // Generate 52 weeks of data (1 year)
  for (let weekIndex = 51; weekIndex >= 0; weekIndex--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - weekIndex * 7);

    // Adjust to start of week (Sunday)
    const dayOfWeek = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - dayOfWeek);

    const days: ContributionDay[] = [];
    let weekTotal = 0;

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + dayIndex);

      const dateKey = day.toISOString().split("T")[0];
      const count = commitsByDate.get(dateKey) || 0;

      days.push({
        date: new Date(day),
        count,
        level: getContributionLevel(count),
      });

      weekTotal += count;
    }

    weeks.push({
      week: new Date(weekStart),
      days,
      total: weekTotal,
    });
  }

  return weeks;
}

/**
 * Get contribution level (0-4) based on commit count
 */
function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

/**
 * Calculate repository insights
 */
export function calculateRepositoryInsights(repositories: Repository[]) {
  const insights = {
    totalRepositories: repositories.length,
    totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
    totalForks: repositories.reduce((sum, repo) => sum + repo.forks, 0),
    totalWatchers: repositories.reduce((sum, repo) => sum + repo.watchers, 0),
    languages: new Set(repositories.map((repo) => repo.language)).size,
    averageStars: 0,
    mostStarredRepo: null as Repository | null,
    mostForkedRepo: null as Repository | null,
    newestRepo: null as Repository | null,
    oldestRepo: null as Repository | null,
    languageDistribution: {} as Record<string, number>,
    topicDistribution: {} as Record<string, number>,
    sizeDistribution: {
      small: 0, // < 1MB
      medium: 0, // 1MB - 10MB
      large: 0, // > 10MB
    },
    activityDistribution: {
      active: 0, // Updated in last 30 days
      moderate: 0, // Updated in last 90 days
      inactive: 0, // Updated more than 90 days ago
    },
  };

  if (repositories.length === 0) return insights;

  // Calculate averages
  insights.averageStars = insights.totalStars / repositories.length;

  // Find extremes
  insights.mostStarredRepo = repositories.reduce((max, repo) =>
    repo.stars > max.stars ? repo : max
  );

  insights.mostForkedRepo = repositories.reduce((max, repo) =>
    repo.forks > max.forks ? repo : max
  );

  insights.newestRepo = repositories.reduce((newest, repo) =>
    new Date(repo.createdAt) > new Date(newest.createdAt) ? repo : newest
  );

  insights.oldestRepo = repositories.reduce((oldest, repo) =>
    new Date(repo.createdAt) < new Date(oldest.createdAt) ? repo : oldest
  );

  // Calculate distributions
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  repositories.forEach((repo) => {
    // Language distribution
    if (repo.language && repo.language !== "Unknown") {
      insights.languageDistribution[repo.language] =
        (insights.languageDistribution[repo.language] || 0) + 1;
    }

    // Topic distribution
    repo.topics.forEach((topic) => {
      insights.topicDistribution[topic] =
        (insights.topicDistribution[topic] || 0) + 1;
    });

    // Size distribution (size is in KB)
    const sizeInMB = repo.size / 1024;
    if (sizeInMB < 1) {
      insights.sizeDistribution.small++;
    } else if (sizeInMB <= 10) {
      insights.sizeDistribution.medium++;
    } else {
      insights.sizeDistribution.large++;
    }

    // Activity distribution
    const lastUpdate = new Date(repo.updatedAt);
    if (lastUpdate > thirtyDaysAgo) {
      insights.activityDistribution.active++;
    } else if (lastUpdate > ninetyDaysAgo) {
      insights.activityDistribution.moderate++;
    } else {
      insights.activityDistribution.inactive++;
    }
  });

  return insights;
}

/**
 * Calculate coding activity patterns
 */
export function calculateCodingActivity(commits: Commit[]) {
  const activity = {
    hourlyDistribution: new Array(24).fill(0),
    dailyDistribution: new Array(7).fill(0),
    monthlyDistribution: new Array(12).fill(0),
    mostActiveHour: 0,
    mostActiveDay: 0,
    mostActiveMonth: 0,
    totalCommits: commits.length,
    averageCommitsPerDay: 0,
    commitFrequency: {
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
  };

  if (commits.length === 0) return activity;

  const commitDates = commits.map((commit) => new Date(commit.author.date));
  const uniqueDays = new Set(
    commitDates.map((date) => date.toISOString().split("T")[0])
  ).size;

  activity.averageCommitsPerDay = commits.length / Math.max(uniqueDays, 1);

  // Calculate distributions
  commits.forEach((commit) => {
    const date = new Date(commit.author.date);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday
    const month = date.getMonth(); // 0 = January

    activity.hourlyDistribution[hour]++;
    activity.dailyDistribution[day]++;
    activity.monthlyDistribution[month]++;
  });

  // Find most active periods
  activity.mostActiveHour = activity.hourlyDistribution.indexOf(
    Math.max(...activity.hourlyDistribution)
  );

  activity.mostActiveDay = activity.dailyDistribution.indexOf(
    Math.max(...activity.dailyDistribution)
  );

  activity.mostActiveMonth = activity.monthlyDistribution.indexOf(
    Math.max(...activity.monthlyDistribution)
  );

  // Calculate frequency metrics
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  activity.commitFrequency.daily = commits.filter(
    (commit) => new Date(commit.author.date) > oneDayAgo
  ).length;

  activity.commitFrequency.weekly = commits.filter(
    (commit) => new Date(commit.author.date) > oneWeekAgo
  ).length;

  activity.commitFrequency.monthly = commits.filter(
    (commit) => new Date(commit.author.date) > oneMonthAgo
  ).length;

  return activity;
}

/**
 * Format numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Format dates for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

/**
 * Get language color for visualization
 */
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    SCSS: "#c6538c",
    Vue: "#2c3e50",
    React: "#61dafb",
    Angular: "#dd0031",
    Shell: "#89e051",
    PowerShell: "#012456",
    Dockerfile: "#384d54",
    YAML: "#cb171e",
    JSON: "#292929",
    Markdown: "#083fa1",
  };

  return colors[language] || "#586069";
}
