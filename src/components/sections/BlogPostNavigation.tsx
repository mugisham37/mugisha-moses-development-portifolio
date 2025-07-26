"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types";

interface BlogPostNavigationProps {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export function BlogPostNavigation({ previousPost, nextPost }: BlogPostNavigationProps) {
  if (!previousPost && !nextPost) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-border pt-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Post */}
        <div className="flex justify-start">
          {previousPost ? (
            <Link href={`/blog/${previousPost.slug}`} className="group block w-full">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Article</span>
                </div>
                
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    {previousPost.coverImage ? (
                      <Image
                        src={previousPost.coverImage.src}
                        alt={previousPost.coverImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-lg font-bold text-primary/50">
                          {previousPost.title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {previousPost.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {previousPost.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={previousPost.publishedAt.toISOString()}>
                          {previousPost.publishedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{previousPost.readingTime}min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <div className="w-full">
              <Card className="p-6 opacity-50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <ChevronLeft className="w-4 h-4" />
                  <span>No previous article</span>
                </div>
                <p className="text-muted-foreground">This is the first article in the series.</p>
              </Card>
            </div>
          )}
        </div>

        {/* Next Post */}
        <div className="flex justify-end">
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="group block w-full">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-3">
                  <span>Next Article</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                
                <div className="flex gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {nextPost.title}
                    </h3>
                    
                    <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{nextPost.readingTime}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={nextPost.publishedAt.toISOString()}>
                          {nextPost.publishedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {nextPost.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    {nextPost.coverImage ? (
                      <Image
                        src={nextPost.coverImage.src}
                        alt={nextPost.coverImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-lg font-bold text-primary/50">
                          {nextPost.title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <div className="w-full">
              <Card className="p-6 opacity-50">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-3">
                  <span>No next article</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-muted-foreground text-right">This is the latest article.</p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Back to Blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Articles</span>
        </Link>
      </motion.div>
    </motion.nav>
  );
}