"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPost: BlogPost;
}

export function RelatedPosts({ posts, currentPost }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">Related Articles</h2>
        <p className="text-muted-foreground">
          Continue exploring these related topics and insights
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => {
          // Calculate similarity score for display
          const sharedTags = post.tags.filter((tag) =>
            currentPost.tags.includes(tag)
          );
          const sameCategory = post.category === currentPost.category;

          return (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-500 flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block flex-1 flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage.src}
                        alt={post.coverImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary/30">
                          {post.title.charAt(0)}
                        </div>
                      </div>
                    )}

                    {/* Similarity Indicators */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {sameCategory && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/90 text-primary-foreground text-xs"
                        >
                          Same Category
                        </Badge>
                      )}
                      {sharedTags.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-secondary/90 text-secondary-foreground text-xs"
                        >
                          {sharedTags.length} Shared Tag
                          {sharedTags.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-shrink-0">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                      {post.description}
                    </p>

                    {/* Shared Tags */}
                    {sharedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {sharedTags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {sharedTags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{sharedTags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.publishedAt.toISOString()}>
                          {post.publishedAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>

                      <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Read</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* View More Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
        >
          <span>View all articles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
