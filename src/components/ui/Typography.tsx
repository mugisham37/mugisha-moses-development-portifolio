import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypographyProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "code"
    | "caption"
    | "overline";
  as?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "div"
    | "span"
    | "code"
    | "pre";
  font?: "sans" | "mono" | "display";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right" | "justify";
  color?:
    | "default"
    | "muted"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  gradient?: boolean;
  animate?: boolean;
  truncate?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Typography({
  variant = "p",
  as,
  font = "sans",
  weight,
  align = "left",
  color = "default",
  gradient = false,
  animate = false,
  truncate = false,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || getDefaultElement(variant);

  const baseStyles = cn(
    // Font family
    {
      "font-sans": font === "sans",
      "font-mono": font === "mono",
      "font-display": font === "display",
    },
    // Text alignment
    {
      "text-left": align === "left",
      "text-center": align === "center",
      "text-right": align === "right",
      "text-justify": align === "justify",
    },
    // Truncation
    truncate && "truncate",
    // Gradient text
    gradient &&
      "bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
  );

  const variants = {
    display: cn(
      "scroll-m-20 text-5xl font-extrabold tracking-tight",
      "sm:text-6xl md:text-7xl lg:text-8xl",
      "leading-none"
    ),
    h1: cn(
      "scroll-m-20 text-3xl font-extrabold tracking-tight",
      "sm:text-4xl md:text-5xl lg:text-6xl",
      "leading-tight"
    ),
    h2: cn(
      "scroll-m-20 text-2xl font-bold tracking-tight",
      "sm:text-3xl md:text-4xl lg:text-5xl",
      "leading-tight first:mt-0"
    ),
    h3: cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      "sm:text-2xl md:text-3xl",
      "leading-snug"
    ),
    h4: cn(
      "scroll-m-20 text-lg font-semibold tracking-tight",
      "sm:text-xl md:text-2xl",
      "leading-snug"
    ),
    h5: cn(
      "scroll-m-20 text-base font-semibold tracking-tight",
      "sm:text-lg md:text-xl",
      "leading-normal"
    ),
    h6: cn(
      "scroll-m-20 text-sm font-semibold tracking-tight",
      "sm:text-base md:text-lg",
      "leading-normal"
    ),
    p: cn(
      "text-base leading-relaxed",
      "sm:text-lg",
      "[&:not(:first-child)]:mt-6"
    ),
    lead: cn(
      "text-lg text-muted-foreground leading-relaxed",
      "sm:text-xl md:text-2xl"
    ),
    large: cn("text-lg font-semibold leading-normal", "sm:text-xl"),
    small: cn("text-sm font-medium leading-tight", "sm:text-base"),
    muted: cn("text-sm text-muted-foreground leading-normal", "sm:text-base"),
    code: cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem]",
      "font-mono text-sm font-semibold",
      "text-foreground"
    ),
    caption: cn("text-xs text-muted-foreground leading-tight", "sm:text-sm"),
    overline: cn(
      "text-xs font-semibold uppercase tracking-widest",
      "text-muted-foreground leading-tight"
    ),
  };

  const weights = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const colors = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary-600 dark:text-primary-400",
    secondary: "text-secondary-600 dark:text-secondary-400",
    success: "text-success-600 dark:text-success-400",
    warning: "text-warning-600 dark:text-warning-400",
    error: "text-error-600 dark:text-error-400",
  };

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    weight && weights[weight],
    !gradient && colors[color],
    className
  );

  if (animate) {
    return (
      <motion.div className={combinedClassName} {...animationProps} {...props}>
        {React.createElement(Component, {}, children)}
      </motion.div>
    );
  }

  return React.createElement(
    Component,
    {
      className: combinedClassName,
      ...props,
    },
    children
  );
}

// Specialized typography components
export function DisplayText({
  children,
  ...props
}: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="display" font="display" {...props}>
      {children}
    </Typography>
  );
}

export function Heading({
  level = 1,
  children,
  ...props
}: Omit<TypographyProps, "variant" | "as"> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const variant = `h${level}` as TypographyProps["variant"];
  const as = `h${level}` as TypographyProps["as"];

  return (
    <Typography variant={variant} as={as} {...props}>
      {children}
    </Typography>
  );
}

export function Paragraph({
  children,
  ...props
}: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="p" {...props}>
      {children}
    </Typography>
  );
}

export function Lead({ children, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="lead" {...props}>
      {children}
    </Typography>
  );
}

export function Code({
  children,
  inline = true,
  ...props
}: Omit<TypographyProps, "variant"> & { inline?: boolean }) {
  if (inline) {
    return (
      <Typography variant="code" as="code" {...props}>
        {children}
      </Typography>
    );
  }

  return (
    <Typography
      variant="code"
      as="pre"
      className="block p-4 rounded-lg bg-muted overflow-x-auto"
      {...props}
    >
      <code>{children}</code>
    </Typography>
  );
}

export function Caption({
  children,
  ...props
}: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="caption" {...props}>
      {children}
    </Typography>
  );
}

export function Overline({
  children,
  ...props
}: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="overline" {...props}>
      {children}
    </Typography>
  );
}

// Animated text components
export function AnimatedText({
  children,
  delay = 0,
  ...props
}: TypographyProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <Typography {...props}>{children}</Typography>
    </motion.div>
  );
}

export function TypewriterText({
  text,
  speed = 50,
  ...props
}: Omit<TypographyProps, "children"> & { text: string; speed?: number }) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <Typography {...props}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-[1em] bg-current ml-1"
      />
    </Typography>
  );
}

function getDefaultElement(
  variant: TypographyProps["variant"]
): TypographyProps["as"] {
  switch (variant) {
    case "display":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return variant === "display" ? "h1" : variant;
    case "code":
      return "code";
    case "lead":
    case "large":
    case "small":
    case "muted":
    case "p":
    case "caption":
    case "overline":
    default:
      return "p";
  }
}
