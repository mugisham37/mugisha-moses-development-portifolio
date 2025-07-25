import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlogPostHeader } from "@/components/sections/BlogPostHeader";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { BlogPostSidebar } from "@/components/sections/BlogPostSidebar";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { BlogPostNavigation } from "@/components/sections/BlogPostNavigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  getBlogPost,
  getBlogPosts,
  serializeBlogPost,
} from "@/lib/content-loader";
import type { BlogPost } from "@/types";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const publishedTime = post.publishedAt.toISOString();
  const modifiedTime = post.updatedAt.toISOString();

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    authors: [{ name: post.author.name }],
    creator: post.author.name,
    publisher: "Alex Morgan",
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage
        ? [
            {
              url: post.coverImage.src,
              width: post.coverImage.width || 1200,
              height: post.coverImage.height || 630,
              alt: post.coverImage.alt,
            },
          ]
        : [],
      siteName: "Alex Morgan's Blog",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@alexmorgan_dev",
      images: post.coverImage ? [post.coverImage.src] : [],
    },
    alternates: {
      canonical: post.seo.canonicalUrl,
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": post.author.name,
      "article:section": post.category,
      "article:tag": post.tags.join(","),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Fetch the blog post
  const post = await getBlogPost(params.slug);

  if (!post || post.draft) {
    notFound();
  }

  // Serialize MDX content
  const mdxSource = await serializeBlogPost(params.slug);

  if (!mdxSource) {
    notFound();
  }

  // Get all posts for navigation and related posts
  const allPosts = await getBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Get related posts based on tags and category
  const relatedPosts = getRelatedPosts(post, allPosts);

  return (
    <article className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            image: post.coverImage?.src,
            author: {
              "@type": "Person",
              name: post.author.name,
              url: post.author.social?.website || "https://alexmorgan.dev",
            },
            publisher: {
              "@type": "Person",
              name: "Alex Morgan",
              url: "https://alexmorgan.dev",
            },
            datePublished: post.publishedAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": post.seo.canonicalUrl,
            },
            keywords: post.tags.join(", "),
            articleSection: post.category,
            wordCount: post.content.split(/\s+/).length,
            timeRequired: `PT${post.readingTime}M`,
          }),
        }}
      />

      {/* Blog Post Header */}
      <BlogPostHeader post={post} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={<LoadingSpinner text="Loading article content..." />}
            >
              <BlogPostContent post={post} mdxSource={mdxSource} />
            </Suspense>

            {/* Post Navigation */}
            <div className="mt-12">
              <BlogPostNavigation
                previousPost={previousPost}
                nextPost={nextPost}
              />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <Suspense
                  fallback={<LoadingSpinner text="Loading related posts..." />}
                >
                  <RelatedPosts posts={relatedPosts} currentPost={post} />
                </Suspense>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Suspense fallback={<LoadingSpinner />}>
                <BlogPostSidebar post={post} allPosts={allPosts} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Helper function to get related posts
function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug && !post.draft)
    .map((post) => {
      let score = 0;

      // Same category gets higher score
      if (post.category === currentPost.category) {
        score += 3;
      }

      // Shared tags get points
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );
      score += sharedTags.length * 2;

      // Featured posts get slight boost
      if (post.featured) {
        score += 1;
      }

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  return relatedPosts;
}
