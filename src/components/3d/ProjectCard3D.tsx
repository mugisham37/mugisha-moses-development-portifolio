"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";
import {
  ExternalLinkIcon,
  GithubIcon,
  StarIcon,
  GitForkIcon,
  EyeIcon,
  CalendarIcon,
  CodeIcon,
  TrendingUpIcon,
} from "lucide-react";

interface ProjectCard3DProps {
  project: Project;
  index: number;
  isVisible?: boolean;
  onHover?: (project: Project) => void;
  onClick?: (project: Project) => void;
  className?: string;
}

export function ProjectCard3D({
  project,
  index,
  isVisible = true,
  onHover,
  onClick,
  className,
}: ProjectCard3DProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) / (rect.width / 2);
    const y = (event.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);

    onHover?.(project);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleCardClick = () => {
    onClick?.(project);
  };

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageCarouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const techBubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
        ease: "backOut",
      },
    }),
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn("perspective-1000", className)}
      variants={cardVariants}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        {/* Front of Card */}
        <Card
          variant="glass"
          hover="lift"
          className={cn(
            "absolute inset-0 w-full h-[400px] backface-hidden",
            "bg-gradient-to-br from-card/90 via-card/95 to-card",
            "border border-border/50 backdrop-blur-xl",
            "shadow-2xl hover:shadow-3xl",
            "transition-all duration-500 ease-out",
            "group overflow-hidden"
          )}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Image Carousel Section */}
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <motion.div
              className="relative w-full h-full"
              key={currentImageIndex}
              custom={1}
              variants={imageCarouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <Image
                src={
                  project.images[currentImageIndex]?.src ||
                  "/placeholder-project.jpg"
                }
                alt={project.images[currentImageIndex]?.alt || project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Project Status Badge */}
              <div className="absolute top-3 left-3">
                <motion.div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                    {
                      "bg-green-500/20 text-green-300 border border-green-500/30":
                        project.status === "completed",
                      "bg-blue-500/20 text-blue-300 border border-blue-500/30":
                        project.status === "in-progress",
                      "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30":
                        project.status === "maintained",
                      "bg-gray-500/20 text-gray-300 border border-gray-500/30":
                        project.status === "archived",
                    }
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {project.status}
                </motion.div>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3">
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full text-xs font-medium backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <StarIcon className="w-3 h-3" />
                    Featured
                  </motion.div>
                </div>
              )}

              {/* Image Navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    →
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(i);
                        }}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-200",
                          i === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/70"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Content Section */}
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary-400 transition-colors duration-300">
                {project.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technology Stack Bubbles */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <motion.div
                  key={tech.name}
                  custom={i}
                  variants={techBubbleVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    "bg-gradient-to-r from-primary-500/10 to-secondary-500/10",
                    "border border-primary-500/20 text-primary-300",
                    "hover:border-primary-500/40 hover:text-primary-200",
                    "transition-all duration-200 cursor-pointer",
                    "backdrop-blur-sm"
                  )}
                  style={{
                    backgroundColor: `${tech.color}15`,
                    borderColor: `${tech.color}30`,
                    color: tech.color,
                  }}
                >
                  {tech.name}
                </motion.div>
              ))}
              {project.technologies.length > 4 && (
                <motion.div
                  custom={4}
                  variants={techBubbleVariants}
                  initial="initial"
                  animate="animate"
                  className="px-2 py-1 rounded-full text-xs font-medium bg-muted/20 border border-muted/30 text-muted-foreground"
                >
                  +{project.technologies.length - 4}
                </motion.div>
              )}
            </div>

            {/* Project Metrics */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3" />
                  {project.metrics.githubStars}
                </div>
                <div className="flex items-center gap-1">
                  <GitForkIcon className="w-3 h-3" />
                  {project.metrics.forks}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="w-3 h-3" />
                  {project.metrics.performanceScore}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }}
                  className="h-6 px-2 text-xs"
                >
                  <EyeIcon className="w-3 h-3" />
                </Button>
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                      className="h-6 px-2 text-xs"
                    >
                      <ExternalLinkIcon className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 px-2 text-xs"
                  >
                    <GithubIcon className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card
          variant="glass"
          className={cn(
            "absolute inset-0 w-full h-[400px] backface-hidden",
            "bg-gradient-to-br from-secondary-900/90 via-secondary-800/95 to-secondary-900",
            "border border-secondary-700/50 backdrop-blur-xl",
            "shadow-2xl overflow-hidden"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Project Details</h3>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-white hover:bg-white/10"
              >
                ←
              </Button>
            </div>

            <div className="space-y-4 flex-1">
              {/* Project Timeline */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-secondary-200">
                  Timeline
                </h4>
                <div className="flex items-center gap-2 text-xs text-secondary-300">
                  <CalendarIcon className="w-3 h-3" />
                  {project.startDate.toLocaleDateString()} -{" "}
                  {project.endDate?.toLocaleDateString() || "Present"}
                </div>
              </div>

              {/* Complexity & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-secondary-200 mb-1">
                    Complexity
                  </h4>
                  <div
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium text-center",
                      {
                        "bg-green-500/20 text-green-300":
                          project.complexity === "beginner",
                        "bg-yellow-500/20 text-yellow-300":
                          project.complexity === "intermediate",
                        "bg-orange-500/20 text-orange-300":
                          project.complexity === "advanced",
                        "bg-red-500/20 text-red-300":
                          project.complexity === "expert",
                      }
                    )}
                  >
                    {project.complexity}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-secondary-200 mb-1">
                    Category
                  </h4>
                  <div className="px-2 py-1 rounded text-xs font-medium text-center bg-primary-500/20 text-primary-300">
                    {project.category}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-secondary-200">
                  Key Metrics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Lines of Code:</span>
                    <span className="text-white">
                      {project.metrics.linesOfCode.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Test Coverage:</span>
                    <span className="text-white">
                      {project.metrics.testCoverage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Performance:</span>
                    <span className="text-white">
                      {project.metrics.performanceScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Accessibility:</span>
                    <span className="text-white">
                      {project.metrics.accessibilityScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* All Technologies */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-secondary-200">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="px-2 py-1 rounded text-xs bg-white/10 text-white border border-white/20"
                      style={{
                        backgroundColor: `${tech.color}15`,
                        borderColor: `${tech.color}30`,
                        color: tech.color,
                      }}
                    >
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-xs border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    Live Demo
                  </Button>
                </Link>
              )}
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-xs border-white/20 text-white hover:bg-white/10"
                >
                  <GithubIcon className="w-3 h-3 mr-1" />
                  Source
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
