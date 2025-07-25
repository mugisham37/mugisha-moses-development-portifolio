import { NextResponse } from "next/server";
import { rssGenerator } from "@/lib/rss-generator";

export async function GET() {
  try {
    const atomContent = await rssGenerator.generateAtom();

    return new NextResponse(atomContent, {
      status: 200,
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return new NextResponse("Error generating Atom feed", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour
