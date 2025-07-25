"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Theme,
  ThemeConfig,
  ThemeContextType,
  themeConfigs,
  applyTheme,
  getStoredTheme,
  getNextTheme,
  detectSystemTheme,
  watchSystemTheme,
} from "@/lib/theme";
import { ThemePersistence, ThemeHydration } from "@/lib/theme-persistence";

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: string;
  value?: Partial<Record<Theme, string>>;
  storageKey?: string;
  enableTransitions?: boolean;
  transitionDuration?: number;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  enableSystem = true,
  attribute = "class",
  storageKey = "portfolio-theme",
  enableTransitions = true,
  transitionDuration = 300,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTheme, setPreviousTheme] = useState<Theme | null>(null);

  const persistence = ThemePersistence.getInstance();

  // Initialize theme on mount with proper SSR handling
  useEffect(() => {
    const initialTheme = persistence.getInitialTheme();

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    // Mark theme as hydrated
    ThemeHydration.markHydrated(initialTheme);

    // Migrate old theme data if needed
    persistence.migrateOldThemeData();
  }, [persistence]);

  // Watch for system theme changes
  useEffect(() => {
    if (!enableSystem || !mounted) return;

    const unwatch = persistence.watchSystemTheme((systemTheme) => {
      // Only auto-switch if user hasn't set manual preference
      if (!persistence.hasManualPreference()) {
        setTheme(systemTheme === "dark" ? "dark" : "light");
      }
    });

    return unwatch;
  }, [enableSystem, mounted, persistence]);

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      if (newTheme === theme || isTransitioning) return;

      setPreviousTheme(theme);
      setIsTransitioning(true);

      if (enableTransitions) {
        // Add transition class to body for smooth theme switching
        document.body.classList.add("theme-transition");

        // Apply theme with smooth transition
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            applyTheme(newTheme);
            setThemeState(newTheme);

            // Store theme preference
            persistence.setStoredTheme(newTheme);

            // Complete transition after animation
            setTimeout(() => {
              setIsTransitioning(false);
              document.body.classList.remove("theme-transition");
              resolve();
            }, transitionDuration);
          });
        });
      } else {
        // Instant theme change
        applyTheme(newTheme);
        setThemeState(newTheme);
        persistence.setStoredTheme(newTheme);
        setIsTransitioning(false);
      }
    },
    [theme, isTransitioning, enableTransitions, transitionDuration, persistence]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const cycleTheme = useCallback(() => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const resetToSystem = useCallback(() => {
    persistence.clearThemePreference();
    const systemTheme = persistence.getSystemTheme();
    setTheme(systemTheme);
  }, [persistence, setTheme]);

  const config = themeConfigs[theme];

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    config,
    toggleTheme,
    cycleTheme,
    isTransitioning,
    previousTheme,
    resetToSystem,
    hasManualPreference: persistence.hasManualPreference(),
    systemTheme: persistence.getSystemTheme(),
  };

  // Theme transition variants
  const themeTransitionVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: transitionDuration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(4px)",
      transition: {
        duration: (transitionDuration / 1000) * 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="animate-pulse bg-background">
        <div className="h-screen w-full bg-muted/20" />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {enableTransitions ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            variants={themeTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              willChange: isTransitioning
                ? "transform, opacity, filter"
                : "auto",
            }}
          >
            <div
              className={`theme-transition ${
                isTransitioning ? "transitioning" : ""
              }`}
            >
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className={isTransitioning ? "theme-loading" : ""}>{children}</div>
      )}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme transition wrapper component
interface ThemeTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "blur";
  delay?: number;
}

export function ThemeTransition({
  children,
  className = "",
  variant = "fade",
  delay = 0,
}: ThemeTransitionProps) {
  const { theme, config, isTransitioning } = useTheme();

  const variants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(4px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(4px)" },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: parseFloat(config.animations.duration.replace("s", "")),
          ease: config.animations.easing,
          delay,
        }}
        className={`${className} ${
          isTransitioning ? "pointer-events-none" : ""
        }`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Theme-aware motion component
interface ThemeMotionProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  variant?: "fadeIn" | "slideUp" | "slideDown" | "scaleIn" | "rotateIn";
  delay?: number;
  stagger?: boolean;
}

export function ThemeMotion({
  children,
  className = "",
  animate = true,
  variant = "fadeIn",
  delay = 0,
  stagger = false,
}: ThemeMotionProps) {
  const { config } = useTheme();

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  const variants: Record<string, Variants> = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
    },
  };

  const containerVariants = stagger
    ? {
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }
    : {};

  return (
    <motion.div
      variants={stagger ? containerVariants : variants[variant]}
      initial="initial"
      animate="animate"
      transition={{
        duration: parseFloat(config.animations.duration.replace("s", "")),
        ease: config.animations.easing,
        delay,
      }}
      className={className}
    >
      {stagger
        ? React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={variants[variant]}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export { ThemeContext };
