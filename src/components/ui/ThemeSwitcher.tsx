"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Theme, themes } from "@/lib/theme";
import { useMenuKeyboardNavigation } from "@/hooks";
import {
  generateId,
  liveAnnouncer,
} from "@/lib/accessibility";
import { MotionButton, MotionDiv, MotionSpan } from "./motion-components";

interface ThemeSwitcherProps {
  variant?: "dropdown" | "toggle" | "cycle" | "grid";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

export function ThemeSwitcher({
  variant = "dropdown",
  size = "md",
  showLabels = true,
  className = "",
}: ThemeSwitcherProps) {
  const { theme, setTheme, toggleTheme, cycleTheme, isTransitioning } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const switcherId = generateId("theme-switcher");
  const menuId = generateId("theme-menu");
  const { menuRef, triggerRef, selectedIndex } =
    useMenuKeyboardNavigation(isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (variant !== "dropdown") return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, variant, triggerRef, menuRef]);

  // Handle menu close events
  useEffect(() => {
    if (variant !== "dropdown") return () => {};

    const handleMenuClose = () => {
      setIsOpen(false);
    };

    const currentMenuRef = menuRef.current;
    if (currentMenuRef) {
      currentMenuRef.addEventListener("menuClose", handleMenuClose);
      return () => {
        currentMenuRef.removeEventListener("menuClose", handleMenuClose);
      };
    }
    
    return () => {};
  }, [variant, menuRef]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const themeIcons = {
    light: "☀️",
    dark: "🌙",
    neon: "⚡",
    minimal: "⚪",
  };

  const themeColors = {
    light: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dark: "bg-slate-800 text-slate-100 border-slate-700",
    neon: "bg-pink-500 text-white border-pink-400 shadow-pink-500/25",
    minimal: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Handle keyboard navigation for toggle
  const handleToggleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
      const nextTheme = theme === "light" ? "dark" : "light";
      liveAnnouncer?.announce(`Switched to ${nextTheme} theme`, "polite");
    }
  };

  // Handle keyboard navigation for cycle
  const handleCycleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      cycleTheme();
      liveAnnouncer?.announce(`Switched to ${nextTheme} theme`, "polite");
    }
  };

  // Handle keyboard navigation for grid
  const handleGridKeyDown = (event: React.KeyboardEvent, themeName: Theme) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTheme(themeName);
      liveAnnouncer?.announce(`Switched to ${themeName} theme`, "polite");
    }
  };

  // Handle dropdown keyboard navigation
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleDropdownToggle();
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
    }
  };

  const handleThemeSelect = (themeName: Theme) => {
    setTheme(themeName);
    setIsOpen(false);
    liveAnnouncer?.announce(`Switched to ${themeName} theme`, "polite");
  };

  if (variant === "toggle") {
    return (
      <MotionButton
        onClick={() => {
          toggleTheme();
          const nextTheme = theme === "light" ? "dark" : "light";
          liveAnnouncer?.announce(`Switched to ${nextTheme} theme`, "polite");
        }}
        onKeyDown={handleToggleKeyDown}
        disabled={isTransitioning}
        className={`
          ${sizeClasses[size]} 
          ${themeColors[theme]}
          rounded-full border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${className}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${
          theme === "light" ? "dark" : "light"
        } theme. Current theme: ${theme}`}
        aria-pressed={theme === "dark"}
      >
        <AnimatePresence mode="wait">
          <MotionSpan
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </MotionSpan>
        </AnimatePresence>
      </MotionButton>
    );
  }

  if (variant === "cycle") {
    return (
      <MotionButton
        onClick={() => {
          const currentIndex = themes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          const nextTheme = themes[nextIndex];
          cycleTheme();
          liveAnnouncer?.announce(`Switched to ${nextTheme} theme`, "polite");
        }}
        onKeyDown={handleCycleKeyDown}
        disabled={isTransitioning}
        className={`
          ${sizeClasses[size]}
          ${themeColors[theme]}
          rounded-lg border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Cycle to next theme. Current theme: ${theme}`}
      >
        <AnimatePresence mode="wait">
          <MotionSpan
            key={theme}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </MotionSpan>
        </AnimatePresence>
      </MotionButton>
    );
  }

  if (variant === "grid") {
    return (
      <div
        className={`grid grid-cols-2 gap-2 ${className}`}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {themes.map((themeName) => (
          <MotionButton
            key={themeName}
            onClick={() => {
              setTheme(themeName);
              liveAnnouncer?.announce(
                `Switched to ${themeName} theme`,
                "polite"
              );
            }}
            onKeyDown={(e: React.KeyboardEvent) => handleGridKeyDown(e, themeName)}
            disabled={isTransitioning}
            className={`
              ${sizeClasses[size]}
              ${theme === themeName ? themeColors[themeName] : "bg-muted border border-muted-foreground/20"}
              flex flex-col items-center justify-center gap-1 p-2
              rounded-lg transition-all duration-200 hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="radio"
            aria-checked={theme === themeName}
            aria-label={`Switch to ${themeName} theme`}
          >
            <span className="text-lg" aria-hidden="true">
              {themeIcons[themeName]}
            </span>
            {showLabels && (
              <span className="text-xs capitalize mt-1">{themeName}</span>
            )}
          </MotionButton>
        ))}
      </div>
    );
  }

  // Default to dropdown variant
  return (
    <div className={`relative ${className}`}>
      <MotionButton
        ref={triggerRef}
        onClick={handleDropdownToggle}
        onKeyDown={handleTriggerKeyDown}
        disabled={isTransitioning}
        className={`
          ${sizeClasses[size]}
          ${themeColors[theme]}
          rounded-lg border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Theme switcher. Current theme: ${theme}. Click to open menu.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        id={switcherId}
        role="button"
        aria-describedby={`${switcherId}-description`}
      >
        <AnimatePresence mode="wait">
          <MotionSpan
            key={theme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </MotionSpan>
        </AnimatePresence>
      </MotionButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <MotionDiv
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-labelledby={switcherId}
              aria-activedescendant={
                selectedIndex >= 0 ? `theme-option-${themes[selectedIndex]}` : undefined
              }
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 min-w-[8rem] bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
            >
              {themes.map((themeName, index) => (
                <MotionButton
                  key={themeName}
                  id={`theme-option-${themeName}`}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleThemeSelect(themeName)}
                  disabled={isTransitioning}
                  className={`
                    w-full px-3 py-2 text-left flex items-center gap-3
                    transition-colors duration-200
                    ${theme === themeName
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:bg-muted
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-current={theme === themeName ? "true" : "false"}
                >
                  <span className="text-base" aria-hidden="true">
                    {themeIcons[themeName]}
                  </span>
                  <div className="flex flex-col">
                    <span className="capitalize font-medium">{themeName}</span>
                    {theme === themeName && (
                      <MotionDiv
                        layoutId="selected-indicator"
                        className="absolute inset-y-0 left-0 w-1 bg-primary"
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {showLabels && theme === themeName && (
                    <span className="ml-auto text-xs opacity-75">Current</span>
                  )}
                </MotionButton>
              ))}
            </MotionDiv>
          </>
        )}
      </AnimatePresence>

      {/* Screen reader description */}
      <div
        id={`${switcherId}-description`}
        className="sr-only"
        aria-live="polite"
      >
        Theme switcher with {themes.length} options: {themes.join(", ")}. 
        Current theme: {theme}.
      </div>
    </div>
  );
}

// Compact variant
export function CompactThemeSwitcher({
  className = "",
  ...props
}: Omit<ThemeSwitcherProps, "size" | "showLabels" | "variant">) {
  return (
    <ThemeSwitcher
      variant="toggle"
      size="sm"
      showLabels={false}
      className={className}
      {...props}
    />
  );
}

// Grid variant with labels
export function GridThemeSwitcher({
  className = "",
  ...props
}: Omit<ThemeSwitcherProps, "variant">) {
  return (
    <ThemeSwitcher
      variant="grid"
      showLabels={true}
      className={className}
      {...props}
    />
  );
}

export default ThemeSwitcher;
