"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null;

  const [mainPost, ...secondaryPosts] = posts;
  
  // Ensure mainPost exists
  if (!mainPost) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Featured Post */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:row-span-2"
      >
        <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-500">
          <Link href={`/blog/${mainPost.slug}`} className="block h-full">
            <div className="relative h-64 lg:h-80 overflow-hidden">
              {mainPost.coverImage ? (
                <Image
                  src={mainPost.coverImage.src}
                  alt={mainPost.coverImage.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center">
                  <div className="text-6xl font-bold text-primary/30">
                    {mainPost.title.charAt(0)}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="p-6">
              {/* Category and Reading Time */}
              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                <Badge variant="outline">{mainPost.category}</Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mainPost.readingTime} min read</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {mainPost.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {mainPost.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mainPost.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {mainPost.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{mainPost.tags.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={mainPost.publishedAt.toISOString()}>
                    {mainPost.publishedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">Read more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </Card>
      </motion.div>

      {/* Secondary Featured Posts */}
      <div className="space-y-6">
        {secondaryPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex gap-4 p-6">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage.src}
                        alt={post.coverImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-2xl font-bold text-primary/50">
                          {post.title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Category and Reading Time */}
                    <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <time
                        dateTime={post.publishedAt.toISOString()}
                        className="text-xs text-muted-foreground"
                      >
                        {post.publishedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>

                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
