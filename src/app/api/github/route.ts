import { NextRequest, NextResponse } from "next/server";
import { githubAPI, GitHubAPIError } from "@/lib/github-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "profile":
        const profile = await githubAPI.getProfile();
        return NextResponse.json({ success: true, data: profile });

      case "repositories":
        const repositories = await githubAPI.getRepositories();
        return NextResponse.json({ success: true, data: repositories });

      case "contributions":
        const contributions = await githubAPI.getContributions();
        return NextResponse.json({ success: true, data: contributions });

      case "languages":
        const languages = await githubAPI.getLanguageStats();
        return NextResponse.json({ success: true, data: languages });

      case "activity":
        const activity = await githubAPI.getActivity();
        return NextResponse.json({ success: true, data: activity });

      case "all":
      default:
        const data = await githubAPI.getGitHubData();
        return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error("GitHub API Error:", error);

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "clear-cache":
        githubAPI.clearCache();
        return NextResponse.json({ success: true, message: "Cache cleared" });

      case "rate-limit":
        const rateLimitStatus = await githubAPI.getRateLimitStatus();
        return NextResponse.json({ success: true, data: rateLimitStatus });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GitHub API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
