"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { MotionButton, MotionDiv } from "./motion-components";

interface PerformanceMetrics {
  themeSwitch: {
    duration: number;
    timestamp: number;
    fromTheme: string;
    toTheme: string;
  }[];
  renderTime: number[];
  memoryUsage: number[];
  fps: number[];
}

interface ThemePerformanceMonitorProps {
  className?: string;
  maxEntries?: number;
  showDetails?: boolean;
}

export function ThemePerformanceMonitor({
  className = "",
  maxEntries = 10,
  showDetails = false,
}: ThemePerformanceMonitorProps) {
  const { theme, isTransitioning, previousTheme } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    themeSwitch: [],
    renderTime: [],
    memoryUsage: [],
    fps: [],
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Monitor theme switching performance
  useEffect(() => {
    if (isTransitioning && previousTheme) {
      const startTime = performance.now();

      const checkTransitionEnd = () => {
        if (!isTransitioning) {
          const endTime = performance.now();
          const duration = endTime - startTime;

          setMetrics((prev) => ({
            ...prev,
            themeSwitch: [
              ...prev.themeSwitch.slice(-(maxEntries - 1)),
              {
                duration,
                timestamp: Date.now(),
                fromTheme: previousTheme,
                toTheme: theme,
              },
            ],
          }));
        } else {
          requestAnimationFrame(checkTransitionEnd);
        }
      };

      requestAnimationFrame(checkTransitionEnd);
    }
  }, [isTransitioning, previousTheme, theme, maxEntries]);

  // Monitor FPS
  useEffect(() => {
    if (!isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        setMetrics((prev) => ({
          ...prev,
          fps: [...prev.fps.slice(-(maxEntries - 1)), fps],
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMonitoring, maxEntries]);

  // Monitor memory usage (if available)
  useEffect(() => {
    if (!isMonitoring) return;

    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);

        setMetrics((prev) => ({
          ...prev,
          memoryUsage: [...prev.memoryUsage.slice(-(maxEntries - 1)), usedMB],
        }));
      }
    };

    const interval = setInterval(measureMemory, 1000);
    return () => clearInterval(interval);
  }, [isMonitoring, maxEntries]);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev);
  }, []);

  const clearMetrics = useCallback(() => {
    setMetrics({
      themeSwitch: [],
      renderTime: [],
      memoryUsage: [],
      fps: [],
    });
  }, []);

  const getAverageThemeSwitchTime = () => {
    if (metrics.themeSwitch.length === 0) return 0;
    const total = metrics.themeSwitch.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    return Math.round(total / metrics.themeSwitch.length);
  };

  const getAverageFPS = () => {
    if (metrics.fps.length === 0) return 0;
    const total = metrics.fps.reduce((sum, fps) => sum + fps, 0);
    return Math.round(total / metrics.fps.length);
  };

  const getCurrentMemoryUsage = () => {
    return metrics.memoryUsage[metrics.memoryUsage.length - 1] || 0;
  };

  return (
    <Card className={`w-full ${className}`} variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Theme Performance Monitor</CardTitle>
          <div className="flex gap-2">
            <MotionButton
              onClick={toggleMonitoring}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isMonitoring
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMonitoring ? "Stop" : "Start"}
            </MotionButton>
            <MotionButton
              onClick={clearMetrics}
              className="px-3 py-1 rounded text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </MotionButton>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor theme switching performance and system metrics
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Avg Switch Time"
            value={`${getAverageThemeSwitchTime()}ms`}
            status={getAverageThemeSwitchTime() < 300 ? "good" : "warning"}
          />
          <MetricCard
            title="Avg FPS"
            value={getAverageFPS()}
            status={
              getAverageFPS() >= 55
                ? "good"
                : getAverageFPS() >= 30
                ? "warning"
                : "error"
            }
          />
          <MetricCard
            title="Memory Usage"
            value={`${getCurrentMemoryUsage()}MB`}
            status={
              getCurrentMemoryUsage() < 50
                ? "good"
                : getCurrentMemoryUsage() < 100
                ? "warning"
                : "error"
            }
          />
          <MetricCard
            title="Total Switches"
            value={metrics.themeSwitch.length}
            status="neutral"
          />
        </div>

        {/* Current Status */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <MotionDiv
              className={`w-3 h-3 rounded-full ${
                isTransitioning ? "bg-yellow-500" : "bg-green-500"
              }`}
              animate={isTransitioning ? { scale: [1, 1.2, 1] } : {}}
              transition={{
                repeat: isTransitioning ? Infinity : 0,
                duration: 0.8,
              }}
            />
            <span className="text-sm font-medium">
              {isTransitioning ? "Transitioning..." : "Ready"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Current Theme:
            </span>
            <span className="text-sm font-medium capitalize">{theme}</span>
          </div>

          {isMonitoring && (
            <div className="flex items-center gap-2">
              <MotionDiv
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-sm text-red-600 dark:text-red-400">
                Monitoring
              </span>
            </div>
          )}
        </div>

        {/* Detailed Metrics */}
        {showDetails && (
          <div className="space-y-4">
            {/* Recent Theme Switches */}
            {metrics.themeSwitch.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Theme Switches</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {metrics.themeSwitch
                    .slice(-5)
                    .reverse()
                    .map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded"
                      >
                        <span>
                          {entry.fromTheme} → {entry.toTheme}
                        </span>
                        <span className="font-mono">
                          {Math.round(entry.duration)}ms
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* FPS Chart */}
            {metrics.fps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">FPS History</h4>
                <div className="h-16 flex items-end gap-1">
                  {metrics.fps.slice(-20).map((fps, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t ${
                        fps >= 55
                          ? "bg-green-500"
                          : fps >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ height: `${(fps / 60) * 100}%` }}
                      title={`${fps} FPS`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Performance Tips
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Theme switches under 300ms provide smooth user experience</li>
            <li>• Maintain 60 FPS during animations for optimal performance</li>
            <li>• Monitor memory usage to prevent performance degradation</li>
            <li>• Use reduced motion preferences for accessibility</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  status: "good" | "warning" | "error" | "neutral";
}

function MetricCard({ title, value, status }: MetricCardProps) {
  const statusColors = {
    good: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
    neutral: "text-foreground",
  };

  const statusBg = {
    good: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    neutral: "bg-muted/30 border-border",
  };

  return (
    <div className={`p-3 rounded-lg border ${statusBg[status]}`}>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className={`text-lg font-semibold ${statusColors[status]}`}>
        {value}
      </div>
    </div>
  );
}

export default ThemePerformanceMonitor;
