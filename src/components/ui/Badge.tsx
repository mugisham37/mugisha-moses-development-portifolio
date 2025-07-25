"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        {
          // Variants
          "bg-primary-500 text-primary-foreground hover:bg-primary-500/80":
            variant === "default",
          "bg-secondary-500 text-secondary-foreground hover:bg-secondary-500/80":
            variant === "secondary",
          "border border-border bg-transparent text-foreground hover:bg-accent":
            variant === "outline",
          "bg-destructive text-destructive-foreground hover:bg-destructive/80":
            variant === "destructive",

          // Sizes
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-1 text-sm": size === "md",
          "px-3 py-1.5 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
