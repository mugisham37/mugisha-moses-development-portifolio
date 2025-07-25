import { NextResponse } from "next/server";
import { rssGenerator } from "@/lib/rss-generator";

export async function GET() {
  try {
    const jsonFeedContent = await rssGenerator.generateJSONFeed();

    return new NextResponse(jsonFeedContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating JSON feed:", error);
    return new NextResponse("Error generating JSON feed", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour
