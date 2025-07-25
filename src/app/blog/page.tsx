import { Metadata } from "next";
import { Suspense } from "react";
import { BlogHero } from "@/components/sections/BlogHero";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { BlogSidebar } from "@/components/sections/BlogSidebar";
import { BlogSearch } from "@/components/interactive/BlogSearch";
import { BlogCategories } from "@/components/interactive/BlogCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  getPublishedBlogPosts,
  getFeaturedBlogPosts,
  getContentStatistics,
} from "@/lib/content-loader";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Technical Blog | Alex Morgan - Full Stack Developer",
  description:
    "Explore in-depth articles on web development, React, Next.js, 3D web experiences, and modern frontend technologies. Learn from real-world projects and advanced techniques.",
  keywords: [
    "web development blog",
    "react tutorials",
    "nextjs articles",
    "3d web development",
    "frontend development",
    "typescript guides",
    "performance optimization",
    "technical writing",
  ],
  openGraph: {
    title: "Technical Blog | Alex Morgan",
    description:
      "In-depth articles on modern web development, React, and 3D web experiences",
    type: "website",
    url: "https://alexmorgan.dev/blog",
    images: [
      {
        url: "/og/blog-homepage.png",
        width: 1200,
        height: 630,
        alt: "Alex Morgan's Technical Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Blog | Alex Morgan",
    description:
      "In-depth articles on modern web development, React, and 3D web experiences",
    images: ["/og/blog-homepage.png"],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        {
          title: "Alex Morgan's Blog RSS Feed",
          url: "/blog/rss.xml",
        },
      ],
    },
  },
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    search?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, search, page = "1" } = searchParams;
  const currentPage = parseInt(page, 10);
  const postsPerPage = 9;

  // Fetch all blog data
  const [allPosts, featuredPosts, contentStats] = await Promise.all([
    getPublishedBlogPosts(),
    getFeaturedBlogPosts(),
    getContentStatistics(),
  ]);

  // Filter posts based on search parameters
  let filteredPosts = allPosts;

  if (category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        post.content.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Extract unique categories and tags for filtering
  const categories = [...new Set(allPosts.map((post) => post.category))];
  const tags = [...new Set(allPosts.flatMap((post) => post.tags))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Blog Hero Section */}
      <BlogHero
        totalPosts={contentStats.published}
        totalReadingTime={contentStats.totalReadingTime}
        categories={categories}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts Section - Only show on first page without filters */}
        {currentPage === 1 &&
          !category &&
          !tag &&
          !search &&
          featuredPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Featured Articles
                </h2>
                <div className="h-px flex-1 ml-8 bg-gradient-to-r from-border to-transparent" />
              </div>
              <Suspense fallback={<LoadingSpinner />}>
                <FeaturedPosts posts={featuredPosts.slice(0, 3)} />
              </Suspense>
            </section>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <BlogSearch
                    initialValue={search}
                    placeholder="Search articles, technologies, topics..."
                  />
                </div>
                <BlogCategories
                  categories={categories}
                  selectedCategory={category}
                  className="sm:w-auto"
                />
              </div>

              {/* Active Filters Display */}
              {(category || tag || search) && (
                <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">
                    Active filters:
                  </span>
                  {category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Category: {category}
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("category");
                          window.location.href = url.toString();
                        }}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                        aria-label="Remove category filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {tag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      Tag: {tag}
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("tag");
                          window.location.href = url.toString();
                        }}
                        className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                        aria-label="Remove tag filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      Search: "{search}"
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("search");
                          window.location.href = url.toString();
                        }}
                        className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                        aria-label="Remove search filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {totalPosts === 0
                  ? "No articles found"
                  : totalPosts === 1
                  ? "1 article found"
                  : `${totalPosts} articles found`}
                {(category || tag || search) && (
                  <span className="ml-2 text-sm">
                    • Showing {paginatedPosts.length} of {totalPosts}
                  </span>
                )}
              </p>

              {totalPages > 1 && (
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Blog Posts Grid */}
            <Suspense fallback={<LoadingSpinner />}>
              <BlogGrid
                posts={paginatedPosts}
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/blog"
                searchParams={searchParams}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <BlogSidebar
                recentPosts={allPosts.slice(0, 5)}
                popularTags={tags.slice(0, 20)}
                categories={categories}
                contentStats={contentStats}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
