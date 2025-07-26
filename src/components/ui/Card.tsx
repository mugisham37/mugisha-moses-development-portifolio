import React from "react";
import { cn } from "@/lib/utils";
import { MotionDiv } from "./motion-components";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "glass"
    | "neumorphism"
    | "gradient"
    | "neon"
    | "minimal"
    | "elevated";
  hover?: boolean | "lift" | "glow" | "scale" | "tilt";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  // Motion props
  initial?: string | boolean | object;
  animate?: string | object;
  exit?: string | object;
  variants?: object;
  transition?: object;
  whileHover?: string | object;
  whileTap?: string | object;
  whileFocus?: string | object;
  whileDrag?: string | object;
  whileInView?: string | object;
  drag?: boolean | "x" | "y";
  layout?: boolean | "position" | "size";
  layoutId?: string;
}

export function Card({
  variant = "default",
  hover = false,
  padding = "md",
  rounded = "lg",
  border = true,
  shadow = "sm",
  className,
  children,
  ...props
}: CardProps) {
  const baseStyles = cn(
    "relative overflow-hidden transition-all duration-300 ease-out",
    // Padding variants
    {
      "p-0": padding === "none",
      "p-3": padding === "sm",
      "p-6": padding === "md",
      "p-8": padding === "lg",
      "p-12": padding === "xl",
    },
    // Rounded variants
    {
      "rounded-none": rounded === "none",
      "rounded-sm": rounded === "sm",
      "rounded-md": rounded === "md",
      "rounded-lg": rounded === "lg",
      "rounded-xl": rounded === "xl",
      "rounded-full": rounded === "full",
    },
    // Shadow variants
    {
      "shadow-none": shadow === "none",
      "shadow-sm": shadow === "sm",
      "shadow-md": shadow === "md",
      "shadow-lg": shadow === "lg",
      "shadow-xl": shadow === "xl",
    },
    // Border
    border && "border border-border"
  );

  const variants = {
    default: cn("bg-card text-card-foreground", "border-border/50"),
    glass: cn(
      "bg-white/10 backdrop-blur-md border-white/20",
      "dark:bg-black/10 dark:border-white/10",
      "shadow-glass"
    ),
    neumorphism: cn(
      "bg-neutral-100 shadow-neumorphism-light border-none",
      "dark:bg-neutral-800 dark:shadow-neumorphism-dark"
    ),
    gradient: cn(
      "bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50",
      "dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950",
      "border-gradient-to-br border-from-primary-200 border-to-secondary-200",
      "dark:border-from-primary-800 dark:border-to-secondary-800"
    ),
    neon: cn(
      "bg-black/90 border-2 border-primary-500",
      "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      "text-primary-100"
    ),
    minimal: cn(
      "bg-white border-neutral-200",
      "dark:bg-neutral-900 dark:border-neutral-800",
      "shadow-sm"
    ),
    elevated: cn(
      "bg-card text-card-foreground",
      "shadow-xl border-border/30",
      "bg-gradient-to-b from-card to-card/95"
    ),
  };

  const hoverAnimations = {
    false: {},
    true: {
      whileHover: { y: -4, shadow: "0 10px 25px rgba(0,0,0,0.1)" },
    },
    lift: {
      whileHover: {
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    },
    glow: {
      whileHover: {
        boxShadow:
          variant === "neon"
            ? "0 0 30px rgba(59,130,246,0.6)"
            : "0 0 25px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 },
      },
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.98 },
    },
    tilt: {
      whileHover: {
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    },
  };

  return (
    <MotionDiv
      className={cn(baseStyles, variants[variant], className)}
      {...(hover && hoverAnimations[hover as keyof typeof hoverAnimations])}
      {...props}
    >
      {/* Gradient overlay for gradient variant */}
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
      )}

      {/* Shimmer effect for glass variant */}
      {variant === "glass" && (
        <MotionDiv
          whileHover={{
            opacity: 1,
            x: ["0%", "100%"],
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </MotionDiv>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

export function CardHeader({
  gradient = false,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        gradient &&
          "bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950",
        className
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  gradient?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CardTitle({
  gradient = false,
  size = "md",
  className,
  ...props
}: CardTitleProps) {
  const sizes = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-semibold",
    xl: "text-3xl font-bold",
  };

  return (
    <h3
      className={cn(
        sizes[size],
        "leading-none tracking-tight",
        gradient &&
          "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
}

export function CardDescription({
  size = "sm",
  className,
  ...props
}: CardDescriptionProps) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <p
      className={cn(
        sizes[size],
        "text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export function CardContent({
  padding = "md",
  className,
  ...props
}: CardContentProps) {
  const paddings = {
    none: "p-0",
    sm: "p-3 pt-0",
    md: "p-6 pt-0",
    lg: "p-8 pt-0",
  };

  return <div className={cn(paddings[padding], className)} {...props} />;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  justify?: "start" | "center" | "end" | "between";
}

export function CardFooter({
  padding = "md",
  justify = "start",
  className,
  ...props
}: CardFooterProps) {
  const paddings = {
    none: "p-0",
    sm: "p-3 pt-0",
    md: "p-6 pt-0",
    lg: "p-8 pt-0",
  };

  const justifications = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        paddings[padding],
        justifications[justify],
        className
      )}
      {...props}
    />
  );
}
