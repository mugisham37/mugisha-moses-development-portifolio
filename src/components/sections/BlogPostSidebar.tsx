"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Hash, BookOpen, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShareButtons } from "@/components/interactive/ShareButtons";
import type { BlogPost } from "@/types";

interface BlogPostSidebarProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export function BlogPostSidebar({ post, allPosts }: BlogPostSidebarProps) {
  // Get recent posts (excluding current post)
  const recentPosts = allPosts
    .filter((p) => p.slug !== post.slug && !p.draft)
    .slice(0, 5);

  // Get related tags
  const relatedTags = [
    ...new Set(
      allPosts
        .filter((p) => p.slug !== post.slug)
        .flatMap((p) => p.tags)
        .filter((tag) => post.tags.includes(tag))
    ),
  ].slice(0, 10);

  // Get posts in same category
  const categoryPosts = allPosts
    .filter(
      (p) => p.category === post.category && p.slug !== post.slug && !p.draft
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Article Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Article Info
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Published</span>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Reading Time
              </span>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-3 h-3" />
                <span>{post.readingTime} min</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <Link
                href={`/blog?category=${encodeURIComponent(
                  post.category.toLowerCase()
                )}`}
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {post.category}
                </Badge>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Word Count</span>
              <span className="text-sm font-medium">
                {post.content.split(/\s+/).length} words
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Share Article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Share Article</h3>
          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={post.title}
            description={post.description}
          />
        </Card>
      </motion.div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                  >
                    <Badge
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Posts in Same Category */}
      {categoryPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              More in {post.category}
            </h3>
            <div className="space-y-4">
              {categoryPosts.map((categoryPost, index) => (
                <motion.div
                  key={categoryPost.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={`/blog/${categoryPost.slug}`}
                    className="group block"
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                        {categoryPost.coverImage ? (
                          <Image
                            src={categoryPost.coverImage.src}
                            alt={categoryPost.coverImage.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="text-lg font-bold text-primary/50">
                              {categoryPost.title.charAt(0)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {categoryPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <time
                            dateTime={categoryPost.publishedAt.toISOString()}
                          >
                            {categoryPost.publishedAt.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{categoryPost.readingTime}min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <Link href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}>
                    <Badge 
                      variant="outline" 
                      className="text-xs hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recent Articles
            </h3>
            <div className="space-y-4">
              {recentPosts.map((recentPost, index) => (
                <motion.div
                  key={recentPost.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={`/blog/${recentPost.slug}`}
                    className="group block"
                  >
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {recentPost.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {recentPost.category}
                      </Badge>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{recentPost.readingTime}min</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <h3 className="font-semibold mb-2">Enjoyed this article?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to get notified when new articles are published.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
