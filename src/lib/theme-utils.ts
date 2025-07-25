"use client";

import { Theme, ThemeConfig, themeConfigs } from "./theme";

// Theme-aware CSS class utilities
export function getThemeClasses(theme: Theme) {
  const baseClasses = {
    background: "bg-background",
    foreground: "text-foreground",
    card: "bg-card text-card-foreground",
    muted: "bg-muted text-muted-foreground",
    accent: "bg-accent text-accent-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    border: "border-border",
  };

  const themeSpecificClasses = {
    light: {
      glass: "glass backdrop-blur-md",
      shadow: "shadow-lg",
      glow: "",
      gradient: "bg-gradient-to-br from-blue-50 to-purple-50",
    },
    dark: {
      glass: "glass-dark backdrop-blur-md",
      shadow: "shadow-2xl shadow-black/20",
      glow: "dark-glow",
      gradient: "bg-gradient-to-br from-slate-900 to-slate-800",
    },
    neon: {
      glass: "glass-dark backdrop-blur-md",
      shadow: "shadow-2xl shadow-pink-500/20",
      glow: "glow-effect pulse-neon",
      gradient: "bg-gradient-to-br from-black to-purple-900",
    },
    minimal: {
      glass: "bg-white/80 backdrop-blur-sm",
      shadow: "clean-shadow",
      glow: "",
      gradient: "bg-gradient-to-br from-gray-50 to-gray-100",
    },
  };

  return {
    ...baseClasses,
    ...themeSpecificClasses[theme],
  };
}

// Dynamic CSS custom properties
export function updateCSSCustomProperties(theme: Theme) {
  if (typeof document === "undefined") return;

  const config = themeConfigs[theme];
  const root = document.documentElement;

  // Update color properties
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Update gradient properties
  Object.entries(config.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });

  // Update animation properties
  root.style.setProperty("--animation-duration", config.animations.duration);
  root.style.setProperty("--animation-easing", config.animations.easing);
}

// Theme-aware component variants
export function createThemeVariants(theme: Theme) {
  const config = themeConfigs[theme];

  return {
    button: {
      primary: `bg-primary text-primary-foreground hover:bg-primary/90 
                transition-colors duration-${config.animations.duration}`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 
                  transition-colors duration-${config.animations.duration}`,
      ghost: `hover:bg-accent hover:text-accent-foreground 
              transition-colors duration-${config.animations.duration}`,
      outline: `border border-input bg-background hover:bg-accent hover:text-accent-foreground 
                transition-colors duration-${config.animations.duration}`,
    },
    card: {
      default: `bg-card text-card-foreground border border-border rounded-lg 
                shadow-sm transition-shadow duration-${config.animations.duration}`,
      elevated: `bg-card text-card-foreground border border-border rounded-lg 
                 shadow-lg hover:shadow-xl transition-shadow duration-${config.animations.duration}`,
      glass:
        theme === "light"
          ? "glass border border-white/20 rounded-lg backdrop-blur-md"
          : "glass-dark border border-white/10 rounded-lg backdrop-blur-md",
    },
    input: {
      default: `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 
                text-sm ring-offset-background file:border-0 file:bg-transparent 
                file:text-sm file:font-medium placeholder:text-muted-foreground 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                transition-colors duration-${config.animations.duration}`,
    },
  };
}

// Theme-aware animation presets
export function getThemeAnimations(theme: Theme) {
  const config = themeConfigs[theme];
  const duration = parseFloat(config.animations.duration.replace("s", ""));

  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, ease: config.animations.easing },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, ease: config.animations.easing },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, ease: config.animations.easing },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, ease: config.animations.easing },
    },
    glow:
      theme === "neon"
        ? {
            animate: {
              boxShadow: [
                `0 0 5px ${config.colors.primary}`,
                `0 0 20px ${config.colors.primary}`,
                `0 0 5px ${config.colors.primary}`,
              ],
            },
            transition: { duration: 2, repeat: Infinity },
          }
        : {},
  };
}

// Color manipulation utilities
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Theme contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string) => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r = 0, g = 0, b = 0] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function isAccessibleContrast(
  foreground: string,
  background: string
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
}

// Theme validation utilities
export function validateThemeConfig(config: ThemeConfig): boolean {
  const requiredColors = [
    "primary",
    "secondary",
    "background",
    "foreground",
    "accent",
    "muted",
  ];
  const requiredGradients = ["hero", "primary", "secondary"];

  const hasAllColors = requiredColors.every((color) => color in config.colors);
  const hasAllGradients = requiredGradients.every(
    (gradient) => gradient in config.gradients
  );
  const hasAnimations =
    "duration" in config.animations && "easing" in config.animations;

  return hasAllColors && hasAllGradients && hasAnimations;
}

// Theme performance utilities
export function preloadThemeAssets(theme: Theme) {
  if (typeof document === "undefined") return;

  const config = themeConfigs[theme];

  // Preload gradient backgrounds
  Object.values(config.gradients).forEach((gradient) => {
    const div = document.createElement("div");
    div.style.background = gradient;
    div.style.position = "absolute";
    div.style.top = "-9999px";
    div.style.width = "1px";
    div.style.height = "1px";
    document.body.appendChild(div);

    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(div);
    }, 100);
  });
}

// Theme debugging utilities
export function debugTheme(theme: Theme) {
  if (process.env.NODE_ENV !== "development") return;

  const config = themeConfigs[theme];
  console.group(`🎨 Theme Debug: ${theme}`);
  console.log("Colors:", config.colors);
  console.log("Gradients:", config.gradients);
  console.log("Animations:", config.animations);
  console.log("CSS Variables:", {
    "--color-primary": getComputedStyle(
      document.documentElement
    ).getPropertyValue("--color-primary"),
    "--gradient-hero": getComputedStyle(
      document.documentElement
    ).getPropertyValue("--gradient-hero"),
  });
  console.groupEnd();
}

// Export all utilities
export const themeUtils = {
  getThemeClasses,
  updateCSSCustomProperties,
  createThemeVariants,
  getThemeAnimations,
  hexToHsl,
  hslToHex,
  getContrastRatio,
  isAccessibleContrast,
  validateThemeConfig,
  preloadThemeAssets,
  debugTheme,
};
