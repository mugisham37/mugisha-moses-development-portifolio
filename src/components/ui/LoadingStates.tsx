"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        "border-2 border-primary border-t-transparent rounded-full",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className={cn("bg-primary rounded-full", sizeClasses[size])}
        />
      ))}
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("bg-muted rounded", className)}
    />
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingPulse
          key={i}
          className={cn("h-4 w-full", i === lines - 1 && "w-3/4", className)}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <LoadingPulse className="h-6 w-1/3" />
      <Skeleton lines={3} />
      <div className="flex space-x-2">
        <LoadingPulse className="h-6 w-16 rounded-full" />
        <LoadingPulse className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

interface ProjectCardSkeletonProps {
  className?: string;
}

export function ProjectCardSkeleton({ className }: ProjectCardSkeletonProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className
      )}
    >
      <LoadingPulse className="h-48 w-full" />
      <CardSkeleton />
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  loadingComponent,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
        >
          {loadingComponent || <LoadingSpinner size="lg" />}
        </motion.div>
      )}
    </div>
  );
}

interface InlineLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InlineLoading({
  text = "Loading...",
  size = "md",
  className,
}: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LoadingSpinner size={size} />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}

interface PageLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export function PageLoading({
  title = "Loading",
  description = "Please wait while we load the content...",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn("min-h-screen flex items-center justify-center", className)}
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </motion.div>
        <LoadingDots size="md" className="justify-center" />
      </div>
    </div>
  );
}

interface SectionLoadingProps {
  title?: string;
  className?: string;
}

export function SectionLoading({
  title = "Loading section...",
  className,
}: SectionLoadingProps) {
  return (
    <div className={cn("py-12 text-center", className)}>
      <LoadingSpinner size="md" className="mx-auto mb-4" />
      <p className="text-muted-foreground">{title}</p>
    </div>
  );
}

// Loading states for specific components
export const LoadingStates = {
  Spinner: LoadingSpinner,
  Dots: LoadingDots,
  Pulse: LoadingPulse,
  Skeleton,
  CardSkeleton,
  ProjectCardSkeleton,
  Overlay: LoadingOverlay,
  Inline: InlineLoading,
  Page: PageLoading,
  Section: SectionLoading,
};
