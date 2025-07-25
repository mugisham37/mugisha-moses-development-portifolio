import { createContext, useContext } from "react";

// Theme Types
export type Theme = "light" | "dark" | "neon" | "minimal";

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
  };
  gradients: {
    hero: string;
    primary: string;
    secondary: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

// Theme Configurations
export const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: "light",
    displayName: "Light",
    colors: {
      primary: "hsl(221.2 83.2% 53.3%)",
      secondary: "hsl(210 40% 96%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      accent: "hsl(210 40% 96%)",
      muted: "hsl(210 40% 96%)",
    },
    gradients: {
      hero: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },
  dark: {
    name: "dark",
    displayName: "Dark",
    colors: {
      primary: "hsl(217.2 91.2% 59.8%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      accent: "hsl(217.2 32.6% 17.5%)",
      muted: "hsl(217.2 32.6% 17.5%)",
    },
    gradients: {
      hero: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },
  neon: {
    name: "neon",
    displayName: "Neon",
    colors: {
      primary: "hsl(322 100% 50%)",
      secondary: "hsl(180 100% 50%)",
      background: "hsl(0 0% 5%)",
      foreground: "hsl(0 0% 95%)",
      accent: "hsl(60 100% 50%)",
      muted: "hsl(0 0% 15%)",
    },
    gradients: {
      hero: "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
      primary: "linear-gradient(135deg, #ff006e 0%, #8338ec 100%)",
      secondary: "linear-gradient(135deg, #3a86ff 0%, #06ffa5 100%)",
    },
    animations: {
      duration: "0.2s",
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
  minimal: {
    name: "minimal",
    displayName: "Minimal",
    colors: {
      primary: "hsl(0 0% 20%)",
      secondary: "hsl(0 0% 90%)",
      background: "hsl(0 0% 98%)",
      foreground: "hsl(0 0% 10%)",
      accent: "hsl(0 0% 80%)",
      muted: "hsl(0 0% 95%)",
    },
    gradients: {
      hero: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      primary: "linear-gradient(135deg, #495057 0%, #343a40 100%)",
      secondary: "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)",
    },
    animations: {
      duration: "0.4s",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },
};

// Theme Context
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  config: ThemeConfig;
  toggleTheme: () => void;
  cycleTheme: () => void;
  isTransitioning?: boolean;
  previousTheme?: Theme | null;
  resetToSystem?: () => void;
  hasManualPreference?: boolean;
  systemTheme?: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Theme Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme Utilities
export function getThemeConfig(theme: Theme): ThemeConfig {
  return themeConfigs[theme];
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const config = getThemeConfig(theme);

  // Remove existing theme classes
  root.classList.remove("light", "dark", "theme-neon", "theme-minimal");

  // Add new theme class
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "neon") {
    root.classList.add("theme-neon");
  } else if (theme === "minimal") {
    root.classList.add("theme-minimal");
  }
  // Light theme is default, no class needed

  // Update CSS custom properties
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  Object.entries(config.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });

  // Store theme preference
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Failed to store theme preference:", error);
  }
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem("portfolio-theme") as Theme;
    if (stored && Object.keys(themeConfigs).includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme from localStorage:", error);
  }

  // Check system preference
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch (error) {
    console.warn("Failed to read system theme preference:", error);
  }

  return "light";
}

export function getNextTheme(currentTheme: Theme): Theme {
  const themes: Theme[] = ["light", "dark", "neon", "minimal"];
  const currentIndex = themes.indexOf(currentTheme);
  return themes[(currentIndex + 1) % themes.length] || "light";
}

// Theme-aware color utilities
export function getThemeColor(
  colorName: keyof ThemeConfig["colors"],
  theme: Theme
): string {
  return themeConfigs[theme].colors[colorName];
}

export function getThemeGradient(
  gradientName: keyof ThemeConfig["gradients"],
  theme: Theme
): string {
  return themeConfigs[theme].gradients[gradientName];
}

// CSS-in-JS theme utilities
export function createThemeStyles(theme: Theme) {
  const config = getThemeConfig(theme);

  return {
    colors: config.colors,
    gradients: config.gradients,
    animations: config.animations,
  };
}

// Theme detection utilities
export function detectSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function watchSystemTheme(callback: (theme: "light" | "dark") => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handler);

  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}

// Theme validation
export function isValidTheme(theme: string): theme is Theme {
  return Object.keys(themeConfigs).includes(theme);
}

// Export all themes for easy access
export const themes = Object.keys(themeConfigs) as Theme[];
