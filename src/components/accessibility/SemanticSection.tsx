"use client";

import React, { forwardRef } from "react";
import { HeadingHierarchy, AriaAttributes } from "@/lib/accessibility";

interface SemanticSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
  as?: "section" | "article" | "aside" | "nav" | "main" | "header" | "footer";
  landmark?: boolean;
}

/**
 * Semantic section component with proper ARIA landmarks and HTML5 semantics
 * Automatically handles heading hierarchy validation in development
 */
export const SemanticSection = forwardRef<HTMLElement, SemanticSectionProps>(
  (
    {
      children,
      className = "",
      id,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      role,
      as = "section",
      landmark = false,
      ...props
    },
    ref
  ) => {
    const Component = as;

    // Build ARIA attributes
    const ariaAttributes: AriaAttributes = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(ariaLabelledBy && { "aria-labelledby": ariaLabelledBy }),
      ...(ariaDescribedBy && { "aria-describedby": ariaDescribedBy }),
      ...(role && { role }),
    };

    // Add landmark role if specified
    if (landmark && !role) {
      switch (as) {
        case "nav":
          ariaAttributes.role = "navigation";
          break;
        case "main":
          ariaAttributes.role = "main";
          break;
        case "header":
          ariaAttributes.role = "banner";
          break;
        case "footer":
          ariaAttributes.role = "contentinfo";
          break;
        case "aside":
          ariaAttributes.role = "complementary";
          break;
        default:
          ariaAttributes.role = "region";
      }
    }

    return (
      <Component
        ref={ref}
        id={id}
        className={className}
        {...ariaAttributes}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SemanticSection.displayName = "SemanticSection";

interface SemanticHeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
  visualLevel?: 1 | 2 | 3 | 4 | 5 | 6; // For styling purposes when semantic level differs from visual level
}

/**
 * Semantic heading component with automatic hierarchy validation
 * Ensures proper heading structure for screen readers
 */
export function SemanticHeading({
  children,
  level,
  className = "",
  id,
  visualLevel,
  ...props
}: SemanticHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const text = typeof children === "string" ? children : "";

  // Validate heading hierarchy in development
  if (process.env.NODE_ENV === "development") {
    HeadingHierarchy.validateLevel(level, text, id);
  }

  // Apply visual styling based on visualLevel if provided
  const visualClass = visualLevel
    ? `text-${
        visualLevel === 1
          ? "4xl"
          : visualLevel === 2
          ? "3xl"
          : visualLevel === 3
          ? "2xl"
          : visualLevel === 4
          ? "xl"
          : visualLevel === 5
          ? "lg"
          : "base"
      }`
    : "";

  return (
    <HeadingTag id={id} className={`${visualClass} ${className}`} {...props}>
      {children}
    </HeadingTag>
  );
}

interface SemanticListProps {
  children: React.ReactNode;
  className?: string;
  ordered?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  role?: "list" | "menu" | "menubar" | "tablist" | "tree" | "grid";
}

/**
 * Semantic list component with proper ARIA roles
 */
export function SemanticList({
  children,
  className = "",
  ordered = false,
  ariaLabel,
  ariaLabelledBy,
  role = "list",
  ...props
}: SemanticListProps) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {children}
    </ListTag>
  );
}

interface SemanticListItemProps {
  children: React.ReactNode;
  className?: string;
  role?: "listitem" | "menuitem" | "tab" | "treeitem" | "gridcell";
  ariaLabel?: string;
  ariaCurrent?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";
  ariaSelected?: boolean;
  ariaExpanded?: boolean;
  ariaLevel?: number;
  ariaPosInSet?: number;
  ariaSetSize?: number;
}

/**
 * Semantic list item component with ARIA support
 */
export function SemanticListItem({
  children,
  className = "",
  role = "listitem",
  ariaLabel,
  ariaCurrent,
  ariaSelected,
  ariaExpanded,
  ariaLevel,
  ariaPosInSet,
  ariaSetSize,
  ...props
}: SemanticListItemProps) {
  return (
    <li
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-selected={ariaSelected}
      aria-expanded={ariaExpanded}
      aria-level={ariaLevel}
      aria-posinset={ariaPosInSet}
      aria-setsize={ariaSetSize}
      {...props}
    >
      {children}
    </li>
  );
}

interface SemanticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaControls?: string;
  ariaHaspopup?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
  loading?: boolean;
  loadingText?: string;
}

/**
 * Semantic button component with comprehensive ARIA support
 */
export const SemanticButton = forwardRef<
  HTMLButtonElement,
  SemanticButtonProps
>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      ariaLabel,
      ariaDescribedBy,
      ariaExpanded,
      ariaPressed,
      ariaControls,
      ariaHaspopup,
      loading = false,
      loadingText = "Loading...",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">{loadingText}</span>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span aria-hidden="true">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

SemanticButton.displayName = "SemanticButton";

interface SemanticLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaCurrent?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";
}

/**
 * Semantic link component with proper external link handling
 */
export const SemanticLink = forwardRef<HTMLAnchorElement, SemanticLinkProps>(
  (
    {
      children,
      className = "",
      external = false,
      ariaLabel,
      ariaDescribedBy,
      ariaCurrent,
      href,
      ...props
    },
    ref
  ) => {
    const isExternal =
      external ||
      (href &&
        (href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")));

    return (
      <a
        ref={ref}
        href={href}
        className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${className}`}
        aria-label={
          ariaLabel ||
          (isExternal ? `${children} (opens in new tab)` : undefined)
        }
        aria-describedby={ariaDescribedBy}
        aria-current={ariaCurrent}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    );
  }
);

SemanticLink.displayName = "SemanticLink";
