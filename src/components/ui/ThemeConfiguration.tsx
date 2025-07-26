"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Theme, ThemeConfig, themes, themeConfigs } from "@/lib/theme";
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import ThemeSwitcher from "./ThemeSwitcher";

interface ThemeConfigurationProps {
  className?: string;
  showAdvanced?: boolean;
}

export function ThemeConfiguration({
  className = "",
  showAdvanced = false,
}: ThemeConfigurationProps) {
  const {
    theme,
    setTheme,
    config,
    isTransitioning,
    hasManualPreference,
    systemTheme,
    resetToSystem,
  } = useTheme();
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showAnimationSettings, setShowAnimationSettings] = useState(false);

  return (
    <Card className={`w-full max-w-2xl ${className}`} variant="elevated">
      <CardHeader>
        <CardTitle gradient>Theme Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize your portfolio&apos;s appearance and animations
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Theme Selection</h3>
            <ThemeSwitcher variant="dropdown" size="sm" />
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themes.map((themeName) => (
              <ThemeCard
                key={themeName}
                theme={themeName}
                isActive={theme === themeName}
                isTransitioning={isTransitioning}
                onClick={() => setTheme(themeName)}
              />
            ))}
          </div>
        </div>

        {/* Theme Status */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Theme</span>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  isTransitioning ? "bg-yellow-500" : "bg-green-500"
                }`}
                animate={isTransitioning ? { scale: [1, 1.2, 1] } : {}}
                transition={{
                  repeat: isTransitioning ? Infinity : 0,
                  duration: 1,
                }}
              />
              <span className="text-sm capitalize font-medium">{theme}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm">
              {hasManualPreference ? "Manual Selection" : "System Preference"}
            </span>
          </div>

          {systemTheme && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                System Theme
              </span>
              <span className="text-sm capitalize">{systemTheme}</span>
            </div>
          )}

          {hasManualPreference && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToSystem}
              className="w-full mt-2"
            >
              Reset to System Theme
            </Button>
          )}
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-4">
            {/* Color Palette */}
            <div className="space-y-3">
              <button
                onClick={() => setShowColorPalette(!showColorPalette)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-medium">Color Palette</h3>
                <motion.div
                  animate={{ rotate: showColorPalette ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ↓
                </motion.div>
              </button>

              <AnimatePresence>
                {showColorPalette && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ColorPalette config={config} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animation Settings */}
            <div className="space-y-3">
              <button
                onClick={() => setShowAnimationSettings(!showAnimationSettings)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-medium">Animation Settings</h3>
                <motion.div
                  animate={{ rotate: showAnimationSettings ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ↓
                </motion.div>
              </button>

              <AnimatePresence>
                {showAnimationSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <AnimationSettings config={config} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Theme Effects Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Theme Effects Preview</h3>
          <ThemeEffectsPreview />
        </div>
      </CardContent>
    </Card>
  );
}

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  isTransitioning: boolean;
  onClick: () => void;
}

function ThemeCard({
  theme,
  isActive,
  isTransitioning,
  onClick,
}: ThemeCardProps) {
  const config = themeConfigs[theme];

  const themeIcons = {
    light: "☀️",
    dark: "🌙",
    neon: "⚡",
    minimal: "⚪",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isTransitioning}
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${
          isActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="space-y-2">
        <div className="text-2xl">{themeIcons[theme]}</div>
        <div className="text-sm font-medium capitalize">{theme}</div>

        {/* Color Preview */}
        <div className="flex gap-1 justify-center">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: config.colors.primary }}
          />
          <div
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: config.colors.secondary }}
          />
          <div
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: config.colors.accent }}
          />
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeThemeCard"
          className="absolute inset-0 border-2 border-primary rounded-lg"
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
}

function ColorPalette({ config }: { config: ThemeConfig }) {
  const colorEntries = Object.entries(config.colors);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-muted/20 rounded-lg">
      {colorEntries.map(([name, value]) => (
        <div key={name} className="space-y-2">
          <div
            className="w-full h-12 rounded border shadow-sm"
            style={{ backgroundColor: value as string }}
          />
          <div className="text-xs">
            <div className="font-medium capitalize">{name}</div>
            <div className="text-muted-foreground font-mono text-[10px]">
              {value as string}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnimationSettings({ config }: { config: ThemeConfig }) {
  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Duration</label>
          <div className="text-sm text-muted-foreground font-mono">
            {config.animations.duration}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Easing</label>
          <div className="text-sm text-muted-foreground font-mono">
            {config.animations.easing.split("(")[0]}
          </div>
        </div>
      </div>

      {/* Animation Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Animation Preview</label>
        <motion.div
          className="w-full h-8 bg-primary/20 rounded"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: parseFloat(config.animations.duration.replace("s", "")),
            ease: config.animations.easing as "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}

function ThemeEffectsPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Glass Effect */}
      <motion.div
        className="glass p-4 rounded-lg text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm font-medium">Glass</div>
        <div className="text-xs text-muted-foreground mt-1">
          Backdrop blur effect
        </div>
      </motion.div>

      {/* Gradient Effect */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-lg text-center border border-primary/20"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm font-medium">Gradient</div>
        <div className="text-xs text-muted-foreground mt-1">Dynamic colors</div>
      </motion.div>

      {/* Shadow Effect */}
      <motion.div
        className="bg-card p-4 rounded-lg text-center shadow-lg border border-border"
        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm font-medium">Shadow</div>
        <div className="text-xs text-muted-foreground mt-1">
          Depth and elevation
        </div>
      </motion.div>
    </div>
  );
}

export default ThemeConfiguration;
