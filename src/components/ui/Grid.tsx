import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridProps extends HTMLMotionProps<"div"> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
  children: React.ReactNode;
}

export function Grid({
  cols = 1,
  gap = "md",
  responsive,
  className,
  children,
  ...props
}: GridProps) {
  const baseStyles = cn(
    "grid",
    // Grid columns
    {
      "grid-cols-1": cols === 1,
      "grid-cols-2": cols === 2,
      "grid-cols-3": cols === 3,
      "grid-cols-4": cols === 4,
      "grid-cols-5": cols === 5,
      "grid-cols-6": cols === 6,
      "grid-cols-12": cols === 12,
    },
    // Gap
    {
      "gap-0": gap === "none",
      "gap-1": gap === "xs",
      "gap-2": gap === "sm",
      "gap-4": gap === "md",
      "gap-6": gap === "lg",
      "gap-8": gap === "xl",
    },
    // Responsive columns
    responsive && {
      [`sm:grid-cols-${responsive.sm}`]: responsive.sm,
      [`md:grid-cols-${responsive.md}`]: responsive.md,
      [`lg:grid-cols-${responsive.lg}`]: responsive.lg,
      [`xl:grid-cols-${responsive.xl}`]: responsive.xl,
    },
    className
  );

  return (
    <motion.div className={baseStyles} {...props}>
      {children}
    </motion.div>
  );
}

export default Grid;
