"use client";

import { Theme, isValidTheme } from "./theme";

// Storage keys
export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_PREFERENCE_KEY = "portfolio-theme-preference";

// Theme persistence utilities
export class ThemePersistence {
  private static instance: ThemePersistence;
  private storageKey: string;
  private preferenceKey: string;

  constructor(
    storageKey: string = THEME_STORAGE_KEY,
    preferenceKey: string = THEME_PREFERENCE_KEY
  ) {
    this.storageKey = storageKey;
    this.preferenceKey = preferenceKey;
  }

  static getInstance(): ThemePersistence {
    if (!ThemePersistence.instance) {
      ThemePersistence.instance = new ThemePersistence();
    }
    return ThemePersistence.instance;
  }

  // Get stored theme with fallback
  getStoredTheme(): Theme | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored && isValidTheme(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error);
    }

    return null;
  }

  // Store theme preference
  setStoredTheme(theme: Theme): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, theme);
      localStorage.setItem(this.preferenceKey, "manual");
    } catch (error) {
      console.warn("Failed to store theme in localStorage:", error);
    }
  }

  // Check if user has manual preference
  hasManualPreference(): boolean {
    if (typeof window === "undefined") return false;

    try {
      return localStorage.getItem(this.preferenceKey) === "manual";
    } catch (error) {
      return false;
    }
  }

  // Clear theme preference (revert to system)
  clearThemePreference(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.preferenceKey);
    } catch (error) {
      console.warn("Failed to clear theme preference:", error);
    }
  }

  // Get system theme preference
  getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";

    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (error) {
      return "light";
    }
  }

  // Watch for system theme changes
  watchSystemTheme(callback: (theme: "light" | "dark") => void): () => void {
    if (typeof window === "undefined") return () => {};

    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        callback(e.matches ? "dark" : "light");
      };

      // Use modern addEventListener if available, fallback to addListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    } catch (error) {
      console.warn("Failed to watch system theme:", error);
      return () => {};
    }
  }

  // Get initial theme with proper fallback chain
  getInitialTheme(): Theme {
    // 1. Check for stored user preference
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    // 2. Check system preference
    const systemTheme = this.getSystemTheme();
    return systemTheme;
  }

  // Migrate from old storage keys (if needed)
  migrateOldThemeData(): void {
    if (typeof window === "undefined") return;

    const oldKeys = ["theme", "color-theme", "app-theme"];

    for (const oldKey of oldKeys) {
      try {
        const oldValue = localStorage.getItem(oldKey);
        if (oldValue && isValidTheme(oldValue) && !this.getStoredTheme()) {
          this.setStoredTheme(oldValue);
          localStorage.removeItem(oldKey);
          break;
        }
      } catch (error) {
        // Ignore migration errors
      }
    }
  }
}

// SSR-safe theme detection
export function getSSRSafeTheme(): Theme {
  return "light"; // Always return light for SSR to prevent hydration mismatch
}

// Theme hydration utilities
export class ThemeHydration {
  private static hydrated = false;
  private static callbacks: Array<(theme: Theme) => void> = [];

  // Register callback for when theme is hydrated
  static onHydrated(callback: (theme: Theme) => void): () => void {
    if (this.hydrated) {
      // If already hydrated, call immediately
      const persistence = ThemePersistence.getInstance();
      callback(persistence.getInitialTheme());
      return () => {};
    }

    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  // Mark theme as hydrated and call callbacks
  static markHydrated(theme: Theme): void {
    if (this.hydrated) return;

    this.hydrated = true;
    this.callbacks.forEach((callback) => {
      try {
        callback(theme);
      } catch (error) {
        console.warn("Theme hydration callback error:", error);
      }
    });
    this.callbacks = [];
  }

  // Check if theme is hydrated
  static isHydrated(): boolean {
    return this.hydrated;
  }

  // Reset hydration state (for testing)
  static reset(): void {
    this.hydrated = false;
    this.callbacks = [];
  }
}

// Theme script for preventing flash of incorrect theme
export function getThemeScript(): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
        var validThemes = ['light', 'dark', 'neon', 'minimal'];
        
        if (!theme || !validThemes.includes(theme)) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        var root = document.documentElement;
        root.classList.remove('light', 'dark', 'theme-neon', 'theme-minimal');
        
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'neon') {
          root.classList.add('theme-neon');
        } else if (theme === 'minimal') {
          root.classList.add('theme-minimal');
        }
        
        // Set data attribute for CSS
        root.setAttribute('data-theme', theme);
      } catch (e) {
        // Fallback to light theme
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
}

// Export singleton instance
export const themePersistence = ThemePersistence.getInstance();

// Utility functions
export function saveTheme(theme: Theme): void {
  themePersistence.setStoredTheme(theme);
}

export function loadTheme(): Theme {
  return themePersistence.getInitialTheme();
}

export function clearTheme(): void {
  themePersistence.clearThemePreference();
}

export function watchTheme(
  callback: (theme: "light" | "dark") => void
): () => void {
  return themePersistence.watchSystemTheme(callback);
}
