"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Theme, themes } from "@/lib/theme";
import { useMenuKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  createAriaAttributes,
  generateId,
  liveAnnouncer,
} from "@/lib/accessibility";

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

  if (variant === "toggle") {
    return (
      <motion.button
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
          <motion.span
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

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

  if (variant === "cycle") {
    return (
      <motion.button
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
          rounded-full border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${className}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Cycle through themes. Current theme: ${theme}. Press to switch to next theme.`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

  // Handle keyboard navigation for grid
  const handleGridKeyDown = (event: React.KeyboardEvent, themeName: Theme) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTheme(themeName);
      liveAnnouncer?.announce(`Switched to ${themeName} theme`, "polite");
    }
  };

  if (variant === "grid") {
    return (
      <div
        className={`grid grid-cols-2 gap-2 ${className}`}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {themes.map((themeName) => (
          <motion.button
            key={themeName}
            onClick={() => {
              setTheme(themeName);
              liveAnnouncer?.announce(
                `Switched to ${themeName} theme`,
                "polite"
              );
            }}
            onKeyDown={(e) => handleGridKeyDown(e, themeName)}
            disabled={isTransitioning}
            className={`
              ${sizeClasses[size]}
              ${
                theme === themeName
                  ? themeColors[themeName]
                  : "bg-muted text-muted-foreground border-border"
              }
              rounded-lg border-2 flex flex-col items-center justify-center
              transition-all duration-300 hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="radio"
            aria-checked={theme === themeName}
            aria-label={`${themeName} theme${
              theme === themeName ? " (current)" : ""
            }`}
          >
            <span className="text-lg" aria-hidden="true">
              {themeIcons[themeName]}
            </span>
            {showLabels && (
              <span className="text-xs capitalize mt-1">{themeName}</span>
            )}
          </motion.button>
        ))}
      </div>
    );
  }

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

  // Close dropdown when clicking outside
  useEffect(() => {
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Listen for menu close events
  useEffect(() => {
    const handleMenuClose = () => {
      setIsOpen(false);
    };

    if (menuRef.current) {
      menuRef.current.addEventListener("menuClose", handleMenuClose);
      return () => {
        menuRef.current?.removeEventListener("menuClose", handleMenuClose);
      };
    }
  }, [isOpen, menuRef]);

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <motion.button
        ref={triggerRef}
        id={switcherId}
        onClick={handleDropdownToggle}
        onKeyDown={handleTriggerKeyDown}
        disabled={isTransitioning}
        className={`
          ${sizeClasses[size]} 
          ${themeColors[theme]}
          rounded-full border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        {...createAriaAttributes.expandableButton(isOpen, menuId)}
        aria-label={`Change theme. Current theme: ${theme}`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            {themeIcons[theme]}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-labelledby={switcherId}
              aria-activedescendant={
                selectedIndex >= 0
                  ? `theme-option-${themes[selectedIndex]}`
                  : undefined
              }
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              {themes.map((themeName, index) => (
                <motion.button
                  key={themeName}
                  id={`theme-option-${themeName}`}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleThemeSelect(themeName)}
                  disabled={isTransitioning}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 text-left
                    transition-colors duration-200
                    hover:bg-muted/50 active:bg-muted
                    focus:outline-none focus:bg-muted/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      theme === themeName
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }
                    ${selectedIndex === index ? "bg-muted/50" : ""}
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-current={theme === themeName ? "true" : "false"}
                >
                  <span className="text-lg" aria-hidden="true">
                    {themeIcons[themeName]}
                  </span>
                  {showLabels && (
                    <span className="capitalize font-medium">{themeName}</span>
                  )}
                  {theme === themeName && (
                    <motion.div
                      layoutId="activeTheme"
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme preview component for showcasing themes
interface ThemePreviewProps {
  themeName: Theme;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ThemePreview({
  themeName,
  isActive = false,
  onClick,
  className = "",
}: ThemePreviewProps) {
  const themeConfig = {
    light: {
      bg: "bg-white",
      primary: "bg-blue-500",
      secondary: "bg-purple-500",
      text: "text-gray-900",
    },
    dark: {
      bg: "bg-gray-900",
      primary: "bg-blue-400",
      secondary: "bg-purple-400",
      text: "text-white",
    },
    neon: {
      bg: "bg-black",
      primary: "bg-pink-500",
      secondary: "bg-cyan-400",
      text: "text-white",
    },
    minimal: {
      bg: "bg-gray-50",
      primary: "bg-gray-800",
      secondary: "bg-gray-600",
      text: "text-gray-900",
    },
  };

  const config = themeConfig[themeName];

  return (
    <motion.div
      onClick={onClick}
      className={`
        relative w-24 h-16 rounded-lg overflow-hidden cursor-pointer
        border-2 transition-all duration-300
        ${
          isActive
            ? "border-primary shadow-lg"
            : "border-border hover:border-muted-foreground"
        }
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-full h-full ${config.bg} flex flex-col`}>
        <div className="flex-1 p-2">
          <div className={`w-full h-2 ${config.primary} rounded mb-1`} />
          <div className={`w-3/4 h-1 ${config.secondary} rounded`} />
        </div>
        <div className="h-4 bg-opacity-20 bg-black flex items-center justify-center">
          <span className={`text-xs font-medium ${config.text} capitalize`}>
            {themeName}
          </span>
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activePreview"
          className="absolute inset-0 border-2 border-primary rounded-lg"
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}

export default ThemeSwitcher;
