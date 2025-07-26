"use client";

import { useState, useEffect } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import Image from "next/image";
import { motion } from "framer-motion";
import { ReadingProgress } from "@/components/interactive/ReadingProgress";
import { TableOfContents } from "@/components/interactive/TableOfContents";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { Card } from "@/components/ui/Card";
import type { BlogPost } from "@/types";

interface BlogPostContentProps {
  post: BlogPost;
  mdxSource: MDXRemoteSerializeResult;
}

export function BlogPostContent({ post, mdxSource }: BlogPostContentProps) {
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  // Extract headings from the content for table of contents
  useEffect(() => {
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll(
        "article h1, article h2, article h3, article h4, article h5, article h6"
      );
      const headingsArray = Array.from(headingElements).map(
        (heading, index) => {
          const id = heading.id || `heading-${index}`;
          if (!heading.id) {
            heading.id = id;
          }
          return {
            id,
            text: heading.textContent || "",
            level: parseInt(heading.tagName.charAt(1)),
          };
        }
      );
      setHeadings(headingsArray);
    };

    // Extract headings after content is rendered
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [mdxSource]);

  return (
    <div className="relative">
      {/* Reading Progress */}
      <ReadingProgress />

      {/* Table of Contents - Desktop */}
      {headings.length > 0 && (
        <div className="hidden xl:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
          <TableOfContents headings={headings} />
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8 md:p-12 bg-background/95 backdrop-blur-sm border-border/50">
          {/* Table of Contents - Mobile */}
          {headings.length > 0 && (
            <div className="xl:hidden mb-8">
              <details className="group">
                <summary className="cursor-pointer font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>Table of Contents</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </summary>
                <div className="pl-4 border-l-2 border-primary/20">
                  <TableOfContents headings={headings} mobile />
                </div>
              </details>
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none prose-headings:scroll-mt-20">
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </article>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Last Updated */}
              {post.updatedAt.getTime() !== post.publishedAt.getTime() && (
                <div className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {post.updatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}

              {/* Reading Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{post.content.split(/\s+/).length} words</span>
                <span>•</span>
                <span>{post.readingTime} min read</span>
                <span>•</span>
                <span>{post.category}</span>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-4">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.author.bio}
                  </p>

                  {/* Social Links */}
                  {post.author.social && (
                    <div className="flex items-center gap-4">
                      {post.author.social.github && (
                        <a
                          href={post.author.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {post.author.social.linkedin && (
                        <a
                          href={post.author.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {post.author.social.twitter && (
                        <a
                          href={post.author.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {post.author.social.website && (
                        <a
                          href={post.author.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}
