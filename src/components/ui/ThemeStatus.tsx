"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

interface ThemeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function ThemeStatus({
  className = "",
  showDetails = false,
}: ThemeStatusProps) {
  const { theme, config, isTransitioning, hasManualPreference, systemTheme } =
    useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-lg p-4 ${className}`}
    >
      <div className="space-y-3">
        {/* Current Theme */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Current Theme
          </span>
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                isTransitioning ? "bg-yellow-500" : "bg-green-500"
              }`}
              animate={isTransitioning ? { scale: [1, 1.2, 1] } : {}}
              transition={{
                repeat: isTransitioning ? Infinity : 0,
                duration: 1,
              }}
            />
            <span className="font-semibold capitalize">{theme}</span>
          </div>
        </div>

        {/* Theme Source */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Source
          </span>
          <span className="text-sm">
            {hasManualPreference ? "Manual" : "System"}
          </span>
        </div>

        {/* System Theme */}
        {systemTheme && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              System Theme
            </span>
            <span className="text-sm capitalize">{systemTheme}</span>
          </div>
        )}

        {/* Transition Status */}
        {isTransitioning && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Transitioning...
            </span>
          </div>
        )}

        {/* Theme Details */}
        {showDetails && (
          <div className="pt-3 border-t border-border space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Theme Configuration
            </div>

            {/* Colors */}
            <div className="space-y-1">
              <div className="text-xs font-medium">Colors</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded border"
                    style={{ backgroundColor: config.colors.primary }}
                  />
                  <span>Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded border"
                    style={{ backgroundColor: config.colors.secondary }}
                  />
                  <span>Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded border"
                    style={{ backgroundColor: config.colors.background }}
                  />
                  <span>Background</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded border"
                    style={{ backgroundColor: config.colors.accent }}
                  />
                  <span>Accent</span>
                </div>
              </div>
            </div>

            {/* Animation Settings */}
            <div className="space-y-1">
              <div className="text-xs font-medium">Animation</div>
              <div className="text-xs text-muted-foreground">
                Duration: {config.animations.duration} | Easing:{" "}
                {config.animations.easing.split("(")[0]}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ThemeStatus;
