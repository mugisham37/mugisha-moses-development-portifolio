"use client";

import { Variants, Transition } from "framer-motion";

// Animation Configuration Types
export interface AnimationConfig {
  reducedMotion: boolean;
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    easeIn: number[];
    easeOut: number[];
    easeInOut: number[];
    spring: {
      stiffness: number;
      damping: number;
      mass: number;
    };
  };
  stagger: {
    fast: number;
    normal: number;
    slow: number;
  };
}

// Default animation configuration
export const defaultAnimationConfig: AnimationConfig = {
  reducedMotion: false,
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
  },
  easing: {
    easeIn: [0.55, 0.06, 0.68, 0.19],
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: {
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
  },
};

// Animation configuration manager
class AnimationConfigManager {
  private config: AnimationConfig = defaultAnimationConfig;
  private listeners: Array<(config: AnimationConfig) => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.detectReducedMotion();
      this.watchReducedMotion();
    }
  }

  // Detect user's reduced motion preference
  private detectReducedMotion() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.config.reducedMotion = mediaQuery.matches;
  }

  // Watch for changes in reduced motion preference
  private watchReducedMotion() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e: MediaQueryListEvent) => {
      this.updateConfig({ reducedMotion: e.matches });
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }
  }

  // Get current configuration
  getConfig(): AnimationConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<AnimationConfig>) {
    this.config = { ...this.config, ...updates };
    this.notifyListeners();
  }

  // Subscribe to configuration changes
  subscribe(listener: (config: AnimationConfig) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners of configuration changes
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.config));
  }

  // Get transition based on configuration
  getTransition(type: "fast" | "normal" | "slow" = "normal"): Transition {
    if (this.config.reducedMotion) {
      return { duration: 0.01 };
    }

    return {
      duration: this.config.duration[type],
      ease: this.config.easing.easeOut,
    };
  }

  // Get spring transition
  getSpringTransition(): Transition {
    if (this.config.reducedMotion) {
      return { duration: 0.01 };
    }

    return {
      type: "spring",
      ...this.config.easing.spring,
    };
  }

  // Get stagger delay
  getStaggerDelay(type: "fast" | "normal" | "slow" = "normal"): number {
    return this.config.reducedMotion ? 0 : this.config.stagger[type];
  }

  // Create variants with configuration
  createVariants(baseVariants: Variants): Variants {
    if (this.config.reducedMotion) {
      // Return simplified variants for reduced motion
      return {
        initial: baseVariants.initial,
        animate: {
          ...baseVariants.animate,
          transition: { duration: 0.01 },
        },
        exit: baseVariants.exit
          ? {
              ...baseVariants.exit,
              transition: { duration: 0.01 },
            }
          : undefined,
      };
    }

    return baseVariants;
  }
}

// Singleton instance
export const animationConfig = new AnimationConfigManager();

// React hook for using animation configuration
export function useAnimationConfig() {
  const [config, setConfig] = React.useState(animationConfig.getConfig());

  React.useEffect(() => {
    const unsubscribe = animationConfig.subscribe(setConfig);
    return unsubscribe;
  }, []);

  return {
    config,
    updateConfig: (updates: Partial<AnimationConfig>) =>
      animationConfig.updateConfig(updates),
    getTransition: animationConfig.getTransition.bind(animationConfig),
    getSpringTransition:
      animationConfig.getSpringTransition.bind(animationConfig),
    getStaggerDelay: animationConfig.getStaggerDelay.bind(animationConfig),
    createVariants: animationConfig.createVariants.bind(animationConfig),
  };
}

// Utility functions for creating responsive animations
export function createResponsiveVariants(
  mobile: Variants,
  desktop: Variants
): Variants {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return isMobile ? mobile : desktop;
}

// Performance-optimized animation variants
export const performanceVariants = {
  // Use transform instead of changing layout properties
  slideUp: {
    initial: { opacity: 0, transform: "translateY(20px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    exit: { opacity: 0, transform: "translateY(-20px)" },
  },

  slideLeft: {
    initial: { opacity: 0, transform: "translateX(20px)" },
    animate: { opacity: 1, transform: "translateX(0px)" },
    exit: { opacity: 0, transform: "translateX(-20px)" },
  },

  scale: {
    initial: { opacity: 0, transform: "scale(0.9)" },
    animate: { opacity: 1, transform: "scale(1)" },
    exit: { opacity: 0, transform: "scale(1.1)" },
  },

  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

// Animation presets for common use cases
export const animationPresets = {
  // Page transitions
  pageSlide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },

  // Modal animations
  modalScale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },

  // Card hover effects
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4 },
  },

  // Button interactions
  buttonPress: {
    rest: { scale: 1 },
    press: { scale: 0.95 },
  },

  // Loading animations
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },

  // Text animations
  textReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },
};

// Accessibility-aware animation utilities
export function getAccessibleVariants(variants: Variants): Variants {
  const config = animationConfig.getConfig();
  return config.reducedMotion
    ? {
        initial: variants.initial,
        animate: { ...variants.animate, transition: { duration: 0.01 } },
        exit: variants.exit
          ? { ...variants.exit, transition: { duration: 0.01 } }
          : undefined,
      }
    : variants;
}

// Performance monitoring for animations
export class AnimationPerformanceMonitor {
  private metrics: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }> = [];

  startMeasure(name: string) {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.push({
        name,
        duration,
        timestamp: Date.now(),
      });

      // Log slow animations in development
      if (process.env.NODE_ENV === "development" && duration > 16) {
        console.warn(
          `Slow animation detected: ${name} took ${duration.toFixed(2)}ms`
        );
      }
    };
  }

  getMetrics() {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }

  getAverageFrameTime() {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.duration,
      0
    );
    return total / this.metrics.length;
  }
}

export const performanceMonitor = new AnimationPerformanceMonitor();

// Export React import for the hook
import React from "react";
