import { NextRequest, NextResponse } from "next/server";
import { githubAPI, GitHubAPIError } from "@/lib/github-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get("metric");

    switch (metric) {
      case "overview": {
        const [profile, repositories, contributions] = await Promise.all([
          githubAPI.getProfile(),
          githubAPI.getRepositories(),
          githubAPI.getContributions(),
        ]);

        const stats = {
          totalRepos: profile.publicRepos,
          totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
          totalForks: repositories.reduce((sum, repo) => sum + repo.forks, 0),
          totalContributions: contributions.totalContributions,
          currentStreak: contributions.currentStreak,
          longestStreak: contributions.longestStreak,
          followers: profile.followers,
          following: profile.following,
        };

        return NextResponse.json({ success: true, data: stats });
      }

      case "languages": {
        const languages = await githubAPI.getLanguageStats();
        const sortedLanguages = Object.entries(languages)
          .sort(([, a], [, b]) => b.percentage - a.percentage)
          .slice(0, 10)
          .map(([name, data]) => ({
            name,
            ...data,
          }));

        return NextResponse.json({ success: true, data: sortedLanguages });
      }

      case "activity": {
        const activity = await githubAPI.getActivity();
        const activityStats = {
          recentCommitsCount: activity.recentCommits.length,
          recentPRsCount: activity.recentPullRequests.length,
          recentIssuesCount: activity.recentIssues.length,
          lastCommitDate: activity.recentCommits[0]?.author.date || null,
          mostActiveRepo: getMostActiveRepo(activity.recentCommits),
          fullActivity: activity, // Include full activity data
        };

        return NextResponse.json({ success: true, data: activityStats });
      }

      case "repositories": {
        const repositories = await githubAPI.getRepositories();
        const repoStats = {
          total: repositories.length,
          languages: [...new Set(repositories.map((r) => r.language))].length,
          totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
          totalForks: repositories.reduce((sum, repo) => sum + repo.forks, 0),
          mostStarred: repositories.sort((a, b) => b.stars - a.stars)[0],
          mostRecent: repositories.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0],
          topLanguages: getTopLanguages(repositories),
          repositories: repositories, // Include full repository data
        };

        return NextResponse.json({ success: true, data: repoStats });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid metric parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GitHub Stats API Error:", error);

    if (error instanceof GitHubAPIError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getMostActiveRepo(commits: any[]) {
  const repoCommitCounts = commits.reduce((acc, commit) => {
    acc[commit.repository] = (acc[commit.repository] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActive = Object.entries(repoCommitCounts).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  )[0];

  return mostActive ? { name: mostActive[0], commits: mostActive[1] } : null;
}

function getTopLanguages(repositories: any[]) {
  const languageCounts = repositories.reduce((acc, repo) => {
    if (repo.language && repo.language !== "Unknown") {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(languageCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));
}
