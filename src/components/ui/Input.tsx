"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      variant = "default",
      size = "md",
      startIcon,
      endIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-3 py-2",
      lg: "h-12 px-4 py-3 text-base",
    };

    const variantStyles = {
      default: "border-input bg-background",
      filled: "border-0 bg-muted/50",
      outlined: "border-2 border-border bg-transparent",
    };

    const inputClasses = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      startIcon && "pl-10",
      endIcon && "pr-10",
      error && "border-destructive focus-visible:ring-destructive",
      className
    );

    const InputComponent = (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
    );

    if (label || error || helperText) {
      return (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={props.id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-destructive"
              )}
            >
              {label}
            </label>
          )}
          {InputComponent}
          {error && (
            <p
              id={`${props.id}-error`}
              className="text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}
          {helperText && !error && (
            <p
              id={`${props.id}-helper`}
              className="text-sm text-muted-foreground"
            >
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return InputComponent;
  }
);

Input.displayName = "Input";

export { Input };
