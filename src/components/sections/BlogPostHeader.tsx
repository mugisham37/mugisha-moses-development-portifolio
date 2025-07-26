"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShareButtons } from "@/components/interactive/ShareButtons";
import type { BlogPost } from "@/types";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Background Image */}
      {post.coverImage && (
        <div className="absolute inset-0">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
      )}

      {/* Background Pattern for posts without cover image */}
      {!post.coverImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        <div className="max-w-4xl">
          {/* Category and Reading Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-6"
          >
            <Badge 
              variant="secondary" 
              className="bg-white/10 backdrop-blur-sm text-white border-white/20"
            >
              {post.category}
            </Badge>
            <div className="flex items-center gap-1 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{post.readingTime} min read</span>
            </div>
            {post.featured && (
              <Badge 
                variant="secondary" 
                className="bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30"
              >
                Featured
              </Badge>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl"
          >
            {post.description}
          </motion.p>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            {/* Author and Date */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white/20"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                  <p className="text-sm text-white/70">{post.author.bio}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <ShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={post.title}
                description={post.description}
                className="text-white"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {post.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <Link href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}>
                  <Badge 
                    variant="outline" 
                    className="bg-white/5 backdrop-blur-sm text-white/90 border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </header>
  );
}