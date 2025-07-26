"use client";

import { useState, useEffect, useCallback } from "react";
import { githubAPI, GitHubAPIError } from "@/lib/github-api";
import type {
  GitHubData,
  GitHubProfile,
  Repository,
  ContributionData,
  LanguageStats,
  ActivityData,
} from "@/types";

interface UseGitHubOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface UseGitHubReturn {
  data: GitHubData | null;
  profile: GitHubProfile | null;
  repositories: Repository[] | null;
  contributions: ContributionData | null;
  languages: LanguageStats | null;
  activity: ActivityData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
  rateLimitStatus: Record<string, unknown> | null;
}

export function useGitHub(options: UseGitHubOptions = {}): UseGitHubReturn {
  const { autoFetch = true, refreshInterval } = options;

  const [data, setData] = useState<GitHubData | null>(null);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [contributions, setContributions] = useState<ContributionData | null>(
    null
  );
  const [languages, setLanguages] = useState<LanguageStats | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<Record<string, unknown> | null>(null);

  const fetchGitHubData = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const githubData = await githubAPI.getGitHubData();

      setData(githubData);
      setProfile(githubData.profile);
      setRepositories(githubData.repositories);
      setContributions(githubData.contributions);
      setLanguages(githubData.languages);
      setActivity(githubData.activity);

      // Fetch rate limit status
      try {
        const rateLimit = await githubAPI.getRateLimitStatus();
        setRateLimitStatus(rateLimit);
      } catch (rateLimitError) {
        console.warn("Could not fetch rate limit status:", rateLimitError);
      }
    } catch (err) {
      const errorMessage =
        err instanceof GitHubAPIError
          ? err.message
          : "Failed to fetch GitHub data";

      setError(errorMessage);
      console.error("GitHub API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearCache = useCallback(() => {
    githubAPI.clearCache();
    setData(null);
    setProfile(null);
    setRepositories(null);
    setContributions(null);
    setLanguages(null);
    setActivity(null);
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchGitHubData();
    }
  }, [autoFetch, fetchGitHubData]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchGitHubData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
    
    return () => {
      // Cleanup function for all code paths
    };
  }, [refreshInterval, fetchGitHubData]);

  return {
    data,
    profile,
    repositories,
    contributions,
    languages,
    activity,
    loading,
    error,
    refetch: fetchGitHubData,
    clearCache,
    rateLimitStatus,
  };
}

// Hook for fetching specific GitHub data
export function useGitHubProfile() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await githubAPI.getProfile();
      setProfile(profileData);
    } catch (err) {
      const errorMessage =
        err instanceof GitHubAPIError
          ? err.message
          : "Failed to fetch GitHub profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

export function useGitHubRepositories() {
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const repoData = await githubAPI.getRepositories();
      setRepositories(repoData);
    } catch (err) {
      const errorMessage =
        err instanceof GitHubAPIError
          ? err.message
          : "Failed to fetch GitHub repositories";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return { repositories, loading, error, refetch: fetchRepositories };
}

export function useGitHubLanguages() {
  const [languages, setLanguages] = useState<LanguageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const languageData = await githubAPI.getLanguageStats();
      setLanguages(languageData);
    } catch (err) {
      const errorMessage =
        err instanceof GitHubAPIError
          ? err.message
          : "Failed to fetch GitHub language statistics";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return { languages, loading, error, refetch: fetchLanguages };
}
