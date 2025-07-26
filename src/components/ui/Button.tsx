import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "gradient"
    | "glass"
    | "neon"
    | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animation?: "none" | "hover" | "press" | "glow" | "magnetic";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

export function Button({
  variant = "primary",
  size = "md",
  animation = "hover",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "overflow-hidden",
    fullWidth && "w-full"
  );

  const variants = {
    primary: cn(
      "bg-primary-600 text-white shadow-lg",
      "hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-md"
    ),
    secondary: cn(
      "bg-secondary-100 text-secondary-900 border border-secondary-200",
      "hover:bg-secondary-200 hover:shadow-md hover:-translate-y-0.5",
      "dark:bg-secondary-800 dark:text-secondary-100 dark:border-secondary-700",
      "dark:hover:bg-secondary-700"
    ),
    ghost: cn(
      "bg-transparent text-foreground",
      "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
      "active:bg-accent/80"
    ),
    outline: cn(
      "border-2 border-primary-300 bg-transparent text-primary-700",
      "hover:bg-primary-50 hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5",
      "dark:border-primary-600 dark:text-primary-300",
      "dark:hover:bg-primary-950 dark:hover:border-primary-500"
    ),
    gradient: cn(
      "bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600",
      "text-white shadow-lg",
      "hover:shadow-xl hover:-translate-y-0.5 hover:scale-105",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-400 before:via-secondary-400 before:to-primary-500",
      "before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100"
    ),
    glass: cn(
      "bg-white/10 backdrop-blur-md border border-white/20",
      "text-white shadow-glass",
      "hover:bg-white/20 hover:shadow-glass-dark hover:-translate-y-0.5",
      "dark:bg-black/10 dark:border-white/10",
      "dark:hover:bg-black/20"
    ),
    neon: cn(
      "bg-transparent border-2 border-primary-500 text-primary-400",
      "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
      "hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:text-primary-300",
      "hover:border-primary-400 hover:-translate-y-0.5",
      "transition-all duration-300"
    ),
    destructive: cn(
      "bg-error-600 text-white shadow-lg",
      "hover:bg-error-700 hover:shadow-xl hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-md"
    ),
  };

  const sizes = {
    xs: "h-7 px-2 text-xs gap-1",
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-base gap-2",
    lg: "h-12 px-6 text-lg gap-2.5",
    xl: "h-14 px-8 text-xl gap-3",
  };

  const animations = {
    none: {},
    hover: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
    press: {
      whileTap: { scale: 0.95 },
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
        transition: { duration: 0.3 },
      },
    },
    magnetic: {
      whileHover: {
        scale: 1.05,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
      whileTap: { scale: 0.95 },
    },
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span className={cn(loading && "opacity-0")}>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...animations[animation]}
      {...props}
    >
      {/* Shimmer effect for gradient variant */}
      {variant === "gradient" && (
        <motion.div
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
      )}

      {/* Ripple effect container */}
      <span className="relative z-10 flex items-center gap-inherit">
        {buttonContent}
      </span>
    </motion.button>
  );
}
