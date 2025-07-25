import { Octokit } from "@octokit/rest";
import type {
  GitHubData,
  GitHubProfile,
  Repository,
  ContributionData,
  LanguageStats,
  ActivityData,
  Commit,
  PullRequest,
  Issue,
} from "@/types";

// GitHub API Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "mugisha-moses";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Cache configuration
const CACHE_DURATION = {
  profile: 24 * 60 * 60 * 1000, // 24 hours
  repositories: 6 * 60 * 60 * 1000, // 6 hours
  contributions: 60 * 60 * 1000, // 1 hour
  languages: 12 * 60 * 60 * 1000, // 12 hours
  activity: 30 * 60 * 1000, // 30 minutes
};

// Initialize Octokit client
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: "elite-developer-portfolio/1.0.0",
  request: {
    timeout: 10000, // 10 seconds timeout
  },
});

// Error types
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public rateLimitReset?: Date
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

// Rate limiting utility
class RateLimiter {
  private lastRequest = 0;
  private requestCount = 0;
  private resetTime = 0;

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    // Check if we need to wait for rate limit reset
    if (this.resetTime > now) {
      const waitTime = this.resetTime - now;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // Ensure minimum delay between requests
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }

    this.lastRequest = Date.now();
  }

  updateLimits(remaining: number, resetTime: number): void {
    this.requestCount = remaining;
    this.resetTime = resetTime * 1000; // Convert to milliseconds
  }
}

const rateLimiter = new RateLimiter();

// Retry utility with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    await rateLimiter.waitIfNeeded();
    return await operation();
  } catch (error: unknown) {
    const apiError = error as { status?: number };
    if (
      retries > 0 &&
      (apiError.status === 403 || (apiError.status && apiError.status >= 500))
    ) {
      const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

// Cache implementation
class APICache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new APICache();

// GitHub API Service Class
export class GitHubAPIService {
  private username: string;

  constructor(username: string = GITHUB_USERNAME) {
    this.username = username;
  }

  /**
   * Fetch GitHub profile information
   */
  async getProfile(): Promise<GitHubProfile> {
    const cacheKey = `profile:${this.username}`;
    const cached = cache.get<GitHubProfile>(cacheKey);
    if (cached) return cached;

    try {
      const response = await withRetry(() =>
        octokit.rest.users.getByUsername({
          username: this.username,
        })
      );

      // Update rate limit info
      const rateLimitRemaining = parseInt(
        response.headers["x-ratelimit-remaining"] || "0"
      );
      const rateLimitReset = parseInt(
        response.headers["x-ratelimit-reset"] || "0"
      );
      rateLimiter.updateLimits(rateLimitRemaining, rateLimitReset);

      const profile: GitHubProfile = {
        username: response.data.login,
        name: response.data.name || response.data.login,
        bio: response.data.bio || "",
        location: response.data.location || "",
        company: response.data.company || "",
        followers: response.data.followers,
        following: response.data.following,
        publicRepos: response.data.public_repos,
        avatarUrl: response.data.avatar_url,
        profileUrl: response.data.html_url,
        createdAt: new Date(response.data.created_at),
      };

      cache.set(cacheKey, profile, CACHE_DURATION.profile);
      return profile;
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch profile: ${error.message}`,
        error.status
      );
    }
  }

  /**
   * Fetch user repositories with statistics
   */
  async getRepositories(): Promise<Repository[]> {
    const cacheKey = `repositories:${this.username}`;
    const cached = cache.get<Repository[]>(cacheKey);
    if (cached) return cached;

    try {
      const repositories: Repository[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const response = await withRetry(() =>
          octokit.rest.repos.listForUser({
            username: this.username,
            type: "owner",
            sort: "updated",
            direction: "desc",
            per_page: perPage,
            page,
          })
        );

        if (response.data.length === 0) break;

        const repoData = response.data.map(
          (repo): Repository => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "",
            url: repo.html_url,
            homepage: repo.homepage || undefined,
            language: repo.language || "Unknown",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            size: repo.size,
            createdAt: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at),
            pushedAt: new Date(repo.pushed_at),
            topics: repo.topics || [],
            isPrivate: repo.private,
            isFork: repo.fork,
            isArchived: repo.archived,
          })
        );

        repositories.push(...repoData);

        if (response.data.length < perPage) break;
        page++;
      }

      cache.set(cacheKey, repositories, CACHE_DURATION.repositories);
      return repositories;
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch repositories: ${error.message}`,
        error.status
      );
    }
  }

  /**
   * Calculate contribution statistics and streaks
   */
  async getContributions(): Promise<ContributionData> {
    const cacheKey = `contributions:${this.username}`;
    const cached = cache.get<ContributionData>(cacheKey);
    if (cached) return cached;

    try {
      // Note: GitHub's REST API doesn't provide contribution graph data
      // This would typically require GraphQL API or web scraping
      // For now, we'll calculate from commit activity

      const repositories = await this.getRepositories();
      const commits = await this.getRecentCommits(repositories.slice(0, 10)); // Limit to top 10 repos

      // Calculate basic contribution stats from available data
      const contributionData = this.calculateContributionStats(commits);

      cache.set(cacheKey, contributionData, CACHE_DURATION.contributions);
      return contributionData;
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch contributions: ${error.message}`,
        error.status
      );
    }
  }

  /**
   * Get language statistics across repositories
   */
  async getLanguageStats(): Promise<LanguageStats> {
    const cacheKey = `languages:${this.username}`;
    const cached = cache.get<LanguageStats>(cacheKey);
    if (cached) return cached;

    try {
      const repositories = await this.getRepositories();
      const languageStats: LanguageStats = {};
      let totalBytes = 0;

      // Get language data for each repository
      for (const repo of repositories.slice(0, 20)) {
        // Limit to avoid rate limits
        try {
          const response = await withRetry(() =>
            octokit.rest.repos.listLanguages({
              owner: this.username,
              repo: repo.name,
            })
          );

          Object.entries(response.data).forEach(([language, bytes]) => {
            if (!languageStats[language]) {
              languageStats[language] = {
                bytes: 0,
                percentage: 0,
                color: this.getLanguageColor(language),
              };
            }
            languageStats[language].bytes += bytes as number;
            totalBytes += bytes as number;
          });
        } catch (error) {
          // Skip repositories that can't be accessed
          console.warn(`Could not fetch languages for ${repo.name}`);
        }
      }

      // Calculate percentages
      Object.keys(languageStats).forEach((language) => {
        languageStats[language].percentage =
          (languageStats[language].bytes / totalBytes) * 100;
      });

      cache.set(cacheKey, languageStats, CACHE_DURATION.languages);
      return languageStats;
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch language stats: ${error.message}`,
        error.status
      );
    }
  }

  /**
   * Get recent activity data
   */
  async getActivity(): Promise<ActivityData> {
    const cacheKey = `activity:${this.username}`;
    const cached = cache.get<ActivityData>(cacheKey);
    if (cached) return cached;

    try {
      const repositories = await this.getRepositories();
      const topRepos = repositories.slice(0, 5); // Limit to top 5 repos

      const [recentCommits, recentPullRequests, recentIssues] =
        await Promise.all([
          this.getRecentCommits(topRepos),
          this.getRecentPullRequests(),
          this.getRecentIssues(),
        ]);

      const activity: ActivityData = {
        recentCommits,
        recentPullRequests,
        recentIssues,
      };

      cache.set(cacheKey, activity, CACHE_DURATION.activity);
      return activity;
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch activity: ${error.message}`,
        error.status
      );
    }
  }

  /**
   * Get comprehensive GitHub data
   */
  async getGitHubData(): Promise<GitHubData> {
    try {
      const [profile, repositories, contributions, languages, activity] =
        await Promise.all([
          this.getProfile(),
          this.getRepositories(),
          this.getContributions(),
          this.getLanguageStats(),
          this.getActivity(),
        ]);

      return {
        profile,
        repositories,
        contributions,
        languages,
        activity,
      };
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to fetch GitHub data: ${error.message}`,
        error.status
      );
    }
  }

  // Private helper methods

  private async getRecentCommits(
    repositories: Repository[]
  ): Promise<Commit[]> {
    const commits: Commit[] = [];

    for (const repo of repositories.slice(0, 3)) {
      // Limit to avoid rate limits
      try {
        const response = await withRetry(() =>
          octokit.rest.repos.listCommits({
            owner: this.username,
            repo: repo.name,
            author: this.username,
            per_page: 10,
          })
        );

        const repoCommits = response.data.map(
          (commit): Commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: {
              name: commit.commit.author?.name || this.username,
              email: commit.commit.author?.email || "",
              date: new Date(commit.commit.author?.date || Date.now()),
            },
            url: commit.html_url,
            repository: repo.name,
          })
        );

        commits.push(...repoCommits);
      } catch (error) {
        console.warn(`Could not fetch commits for ${repo.name}`);
      }
    }

    return commits
      .sort((a, b) => b.author.date.getTime() - a.author.date.getTime())
      .slice(0, 20);
  }

  private async getRecentPullRequests(): Promise<PullRequest[]> {
    try {
      const response = await withRetry(() =>
        octokit.rest.search.issuesAndPullRequests({
          q: `author:${this.username} type:pr`,
          sort: "updated",
          order: "desc",
          per_page: 10,
        })
      );

      return response.data.items.map(
        (pr): PullRequest => ({
          id: pr.id,
          title: pr.title,
          state: pr.state as "open" | "closed" | "merged",
          createdAt: new Date(pr.created_at),
          updatedAt: new Date(pr.updated_at),
          url: pr.html_url,
          repository: pr.repository_url.split("/").pop() || "",
        })
      );
    } catch (error) {
      console.warn("Could not fetch recent pull requests");
      return [];
    }
  }

  private async getRecentIssues(): Promise<Issue[]> {
    try {
      const response = await withRetry(() =>
        octokit.rest.search.issuesAndPullRequests({
          q: `author:${this.username} type:issue`,
          sort: "updated",
          order: "desc",
          per_page: 10,
        })
      );

      return response.data.items.map(
        (issue): Issue => ({
          id: issue.id,
          title: issue.title,
          state: issue.state as "open" | "closed",
          createdAt: new Date(issue.created_at),
          updatedAt: new Date(issue.updated_at),
          url: issue.html_url,
          repository: issue.repository_url.split("/").pop() || "",
        })
      );
    } catch (error) {
      console.warn("Could not fetch recent issues");
      return [];
    }
  }

  private calculateContributionStats(commits: Commit[]): ContributionData {
    // Group commits by date
    const commitsByDate = new Map<string, number>();

    commits.forEach((commit) => {
      const dateKey = commit.author.date.toISOString().split("T")[0];
      commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
    });

    // Calculate streaks
    const sortedDates = Array.from(commitsByDate.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];
    let isCurrentStreakActive = false;

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

      if (currentDate === today) {
        isCurrentStreakActive = true;
        currentStreak = tempStreak;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    if (!isCurrentStreakActive) {
      currentStreak = 0;
    }

    // Create contribution weeks (simplified)
    const weeks = this.createContributionWeeks(commitsByDate);

    return {
      totalContributions: commits.length,
      weeks,
      longestStreak,
      currentStreak,
      contributionYears: [
        ...new Set(commits.map((c) => c.author.date.getFullYear())),
      ],
    };
  }

  private createContributionWeeks(commitsByDate: Map<string, number>) {
    // This is a simplified implementation
    // In a real scenario, you'd want to create proper week structures
    const weeks = [];
    const today = new Date();

    for (let i = 0; i < 52; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - i * 7);

      const days = [];
      let weekTotal = 0;

      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        const dateKey = day.toISOString().split("T")[0];
        const count = commitsByDate.get(dateKey) || 0;

        days.push({
          date: day,
          count,
          level: Math.min(4, Math.floor(count / 2)) as 0 | 1 | 2 | 3 | 4,
        });

        weekTotal += count;
      }

      weeks.push({
        week: weekStart,
        days,
        total: weekTotal,
      });
    }

    return weeks.reverse();
  }

  private getLanguageColor(language: string): string {
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

  /**
   * Clear all cached data
   */
  clearCache(): void {
    cache.clear();
  }

  /**
   * Get rate limit status
   */
  async getRateLimitStatus() {
    try {
      const response = await octokit.rest.rateLimit.get();
      return {
        core: response.data.resources.core,
        search: response.data.resources.search,
        graphql: response.data.resources.graphql,
      };
    } catch (error: any) {
      throw new GitHubAPIError(
        `Failed to get rate limit status: ${error.message}`,
        error.status
      );
    }
  }
}

// Export singleton instance
export const githubAPI = new GitHubAPIService();
