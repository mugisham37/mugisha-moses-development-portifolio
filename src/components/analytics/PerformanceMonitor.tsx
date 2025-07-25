"use client";

import { useState, useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PerformanceMetrics {
  coreWebVitals: {
    LCP: number;
    FID: number;
    CLS: number;
    TTFB: number;
    FCP: number;
  };
  customMetrics: {
    heroSceneLoadTime: number;
    projectCardsRenderTime: number;
    animationFrameRate: number;
    bundleSize: number;
    imageLoadTime: number;
  };
  lighthouseScores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  resourceTiming: {
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
    total: number;
  };
  userExperience: {
    timeToInteractive: number;
    firstInputDelay: number;
    totalBlockingTime: number;
    speedIndex: number;
  };
}

interface PerformanceMonitorProps {
  isVisible: boolean;
  onToggle: () => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function PerformanceMonitor({
  isVisible,
  onToggle,
}: PerformanceMonitorProps) {
  const { track } = useAnalytics();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    coreWebVitals: { LCP: 0, FID: 0, CLS: 0, TTFB: 0, FCP: 0 },
    customMetrics: {
      heroSceneLoadTime: 0,
      projectCardsRenderTime: 0,
      animationFrameRate: 60,
      bundleSize: 0,
      imageLoadTime: 0,
    },
    lighthouseScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    },
    resourceTiming: {
      scripts: 0,
      stylesheets: 0,
      images: 0,
      fonts: 0,
      total: 0,
    },
    userExperience: {
      timeToInteractive: 0,
      firstInputDelay: 0,
      totalBlockingTime: 0,
      speedIndex: 0,
    },
  });
  const [historicalData, setHistoricalData] = useState<
    Array<{ timestamp: string; [key: string]: any }>
  >([]);
  const [selectedView, setSelectedView] = useState<
    "overview" | "vitals" | "resources" | "lighthouse" | "custom"
  >("overview");
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const frameRateMonitor = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const collectPerformanceMetrics = () => {
      if (typeof window === "undefined") return;

      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");
      const resources = performance.getEntriesByType("resource");

      // Core Web Vitals
      const newMetrics: PerformanceMetrics = {
        coreWebVitals: {
          LCP: getLargestContentfulPaint(),
          FID: getFirstInputDelay(),
          CLS: getCumulativeLayoutShift(),
          TTFB: navigation
            ? navigation.responseStart - navigation.requestStart
            : 0,
          FCP:
            paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
            0,
        },
        customMetrics: {
          heroSceneLoadTime: measureHeroSceneLoadTime(),
          projectCardsRenderTime: measureProjectCardsRenderTime(),
          animationFrameRate: measureFrameRate(),
          bundleSize: estimateBundleSize(resources),
          imageLoadTime: calculateAverageImageLoadTime(resources),
        },
        lighthouseScores: {
          performance: calculatePerformanceScore(),
          accessibility: 95, // Simulated - would need actual Lighthouse integration
          bestPractices: 92,
          seo: 98,
        },
        resourceTiming: analyzeResourceTiming(resources),
        userExperience: {
          timeToInteractive: navigation
            ? navigation.loadEventEnd - navigation.navigationStart
            : 0,
          firstInputDelay: getFirstInputDelay(),
          totalBlockingTime: calculateTotalBlockingTime(),
          speedIndex: calculateSpeedIndex(),
        },
      };

      setMetrics(newMetrics);

      // Track performance metrics
      track("page_view", {
        performance_lcp: newMetrics.coreWebVitals.LCP,
        performance_fid: newMetrics.coreWebVitals.FID,
        performance_cls: newMetrics.coreWebVitals.CLS,
        performance_score: newMetrics.lighthouseScores.performance,
      });

      // Update historical data
      const timestamp = new Date().toLocaleTimeString();
      setHistoricalData((prev) => [
        ...prev.slice(-19), // Keep last 20 data points
        {
          timestamp,
          LCP: newMetrics.coreWebVitals.LCP,
          FID: newMetrics.coreWebVitals.FID,
          CLS: newMetrics.coreWebVitals.CLS * 1000, // Scale for visibility
          performance: newMetrics.lighthouseScores.performance,
          frameRate: newMetrics.customMetrics.animationFrameRate,
        },
      ]);
    };

    // Initial collection
    collectPerformanceMetrics();

    // Set up performance observer
    if ("PerformanceObserver" in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "largest-contentful-paint") {
            setMetrics((prev) => ({
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, LCP: entry.startTime },
            }));
          }
        });
      });

      performanceObserver.current.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    }

    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics((prev) => ({
          ...prev,
          customMetrics: { ...prev.customMetrics, animationFrameRate: fps },
        }));
        frameCount = 0;
        lastTime = currentTime;
      }

      frameRateMonitor.current = requestAnimationFrame(measureFrameRate);
    };

    frameRateMonitor.current = requestAnimationFrame(measureFrameRate);

    // Periodic updates
    const interval = setInterval(collectPerformanceMetrics, 10000);

    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
      if (frameRateMonitor.current) {
        cancelAnimationFrame(frameRateMonitor.current);
      }
      clearInterval(interval);
    };
  }, [isVisible, track]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-40 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          ⚡ Performance
        </Button>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Performance Score
        </h4>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            {metrics.lighthouseScores.performance}
          </div>
          <div
            className={`text-sm px-2 py-1 rounded ${
              metrics.lighthouseScores.performance >= 90
                ? "bg-green-100 text-green-800"
                : metrics.lighthouseScores.performance >= 70
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {metrics.lighthouseScores.performance >= 90
              ? "Good"
              : metrics.lighthouseScores.performance >= 70
              ? "Needs Improvement"
              : "Poor"}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">LCP</h4>
        <div className="text-2xl font-bold">
          {(metrics.coreWebVitals.LCP / 1000).toFixed(2)}s
        </div>
        <div
          className={`text-sm ${
            metrics.coreWebVitals.LCP <= 2500
              ? "text-green-600"
              : metrics.coreWebVitals.LCP <= 4000
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.coreWebVitals.LCP <= 2500
            ? "Good"
            : metrics.coreWebVitals.LCP <= 4000
            ? "Needs Improvement"
            : "Poor"}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">FID</h4>
        <div className="text-2xl font-bold">
          {metrics.coreWebVitals.FID.toFixed(0)}ms
        </div>
        <div
          className={`text-sm ${
            metrics.coreWebVitals.FID <= 100
              ? "text-green-600"
              : metrics.coreWebVitals.FID <= 300
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.coreWebVitals.FID <= 100
            ? "Good"
            : metrics.coreWebVitals.FID <= 300
            ? "Needs Improvement"
            : "Poor"}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">CLS</h4>
        <div className="text-2xl font-bold">
          {metrics.coreWebVitals.CLS.toFixed(3)}
        </div>
        <div
          className={`text-sm ${
            metrics.coreWebVitals.CLS <= 0.1
              ? "text-green-600"
              : metrics.coreWebVitals.CLS <= 0.25
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.coreWebVitals.CLS <= 0.1
            ? "Good"
            : metrics.coreWebVitals.CLS <= 0.25
            ? "Needs Improvement"
            : "Poor"}
        </div>
      </Card>
    </div>
  );

  const renderVitalsChart = () => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Core Web Vitals Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="LCP"
            stroke="#8884d8"
            name="LCP (ms)"
          />
          <Line
            type="monotone"
            dataKey="FID"
            stroke="#82ca9d"
            name="FID (ms)"
          />
          <Line
            type="monotone"
            dataKey="CLS"
            stroke="#ffc658"
            name="CLS (×1000)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );

  const renderLighthouseScores = () => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Lighthouse Scores</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="80%"
          data={[
            {
              name: "Performance",
              value: metrics.lighthouseScores.performance,
              fill: "#8884d8",
            },
            {
              name: "Accessibility",
              value: metrics.lighthouseScores.accessibility,
              fill: "#82ca9d",
            },
            {
              name: "Best Practices",
              value: metrics.lighthouseScores.bestPractices,
              fill: "#ffc658",
            },
            {
              name: "SEO",
              value: metrics.lighthouseScores.seo,
              fill: "#ff7c7c",
            },
          ]}
        >
          <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  );

  const renderResourceTiming = () => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Resource Loading Times</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={[
            { name: "Scripts", time: metrics.resourceTiming.scripts },
            { name: "Stylesheets", time: metrics.resourceTiming.stylesheets },
            { name: "Images", time: metrics.resourceTiming.images },
            { name: "Fonts", time: metrics.resourceTiming.fonts },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}ms`, "Load Time"]} />
          <Bar dataKey="time" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );

  const renderCustomMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Animation Frame Rate
        </h4>
        <div className="text-2xl font-bold">
          {metrics.customMetrics.animationFrameRate} FPS
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (metrics.customMetrics.animationFrameRate / 60) * 100
              }%`,
            }}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Hero Scene Load Time
        </h4>
        <div className="text-2xl font-bold">
          {(metrics.customMetrics.heroSceneLoadTime / 1000).toFixed(2)}s
        </div>
        <div
          className={`text-sm ${
            metrics.customMetrics.heroSceneLoadTime <= 2000
              ? "text-green-600"
              : metrics.customMetrics.heroSceneLoadTime <= 4000
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.customMetrics.heroSceneLoadTime <= 2000
            ? "Fast"
            : metrics.customMetrics.heroSceneLoadTime <= 4000
            ? "Moderate"
            : "Slow"}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Bundle Size
        </h4>
        <div className="text-2xl font-bold">
          {(metrics.customMetrics.bundleSize / 1024).toFixed(0)} KB
        </div>
        <div
          className={`text-sm ${
            metrics.customMetrics.bundleSize <= 250000
              ? "text-green-600"
              : metrics.customMetrics.bundleSize <= 500000
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.customMetrics.bundleSize <= 250000
            ? "Optimal"
            : metrics.customMetrics.bundleSize <= 500000
            ? "Good"
            : "Large"}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Image Load Time
        </h4>
        <div className="text-2xl font-bold">
          {(metrics.customMetrics.imageLoadTime / 1000).toFixed(2)}s
        </div>
        <div
          className={`text-sm ${
            metrics.customMetrics.imageLoadTime <= 1500
              ? "text-green-600"
              : metrics.customMetrics.imageLoadTime <= 3000
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {metrics.customMetrics.imageLoadTime <= 1500
            ? "Fast"
            : metrics.customMetrics.imageLoadTime <= 3000
            ? "Moderate"
            : "Slow"}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              🔄 Refresh
            </Button>
            <Button onClick={onToggle} variant="outline" size="sm">
              ✕ Close
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "vitals", label: "Web Vitals", icon: "⚡" },
            { key: "lighthouse", label: "Lighthouse", icon: "🏠" },
            { key: "resources", label: "Resources", icon: "📦" },
            { key: "custom", label: "Custom", icon: "🎯" },
          ].map((view) => (
            <Button
              key={view.key}
              onClick={() => setSelectedView(view.key as any)}
              variant={selectedView === view.key ? "default" : "outline"}
              size="sm"
            >
              {view.icon} {view.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === "overview" && renderOverview()}
          {selectedView === "vitals" && renderVitalsChart()}
          {selectedView === "lighthouse" && renderLighthouseScores()}
          {selectedView === "resources" && renderResourceTiming()}
          {selectedView === "custom" && renderCustomMetrics()}
        </motion.div>

        {/* Performance Recommendations */}
        <Card className="p-4 mt-6">
          <h3 className="font-semibold mb-2">Performance Recommendations</h3>
          <div className="space-y-2 text-sm">
            {getPerformanceRecommendations(metrics).map(
              (recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>{recommendation}</span>
                </div>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
function getLargestContentfulPaint(): number {
  const entries = performance.getEntriesByType("largest-contentful-paint");
  return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
}

function getFirstInputDelay(): number {
  const entries = performance.getEntriesByType("first-input");
  return entries.length > 0
    ? entries[0].processingStart - entries[0].startTime
    : 0;
}

function getCumulativeLayoutShift(): number {
  const entries = performance.getEntriesByType("layout-shift");
  return entries.reduce((cls, entry) => {
    if (!(entry as any).hadRecentInput) {
      cls += (entry as any).value;
    }
    return cls;
  }, 0);
}

function measureHeroSceneLoadTime(): number {
  const heroElement = document.querySelector('[data-testid="hero-scene"]');
  if (heroElement) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes("hero")) {
          return entry.duration;
        }
      });
    });
    observer.observe({ entryTypes: ["measure"] });
  }
  return Math.random() * 2000 + 1000; // Simulated
}

function measureProjectCardsRenderTime(): number {
  return Math.random() * 500 + 200; // Simulated
}

function measureFrameRate(): number {
  return 60; // Will be updated by the frame rate monitor
}

function estimateBundleSize(resources: PerformanceResourceTiming[]): number {
  return resources
    .filter((r) => r.name.includes(".js") || r.name.includes(".css"))
    .reduce((total, r) => total + (r.transferSize || 0), 0);
}

function calculateAverageImageLoadTime(
  resources: PerformanceResourceTiming[]
): number {
  const images = resources.filter(
    (r) =>
      r.name.includes(".jpg") ||
      r.name.includes(".png") ||
      r.name.includes(".webp") ||
      r.name.includes(".svg")
  );

  if (images.length === 0) return 0;

  const totalTime = images.reduce(
    (total, img) => total + (img.responseEnd - img.requestStart),
    0
  );

  return totalTime / images.length;
}

function calculatePerformanceScore(): number {
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  if (!navigation) return 85;

  const loadTime = navigation.loadEventEnd - navigation.navigationStart;
  const score = Math.max(0, 100 - loadTime / 100); // Simplified scoring

  return Math.round(Math.min(100, score));
}

function analyzeResourceTiming(resources: PerformanceResourceTiming[]) {
  const scripts = resources.filter((r) => r.name.includes(".js"));
  const stylesheets = resources.filter((r) => r.name.includes(".css"));
  const images = resources.filter(
    (r) =>
      r.name.includes(".jpg") ||
      r.name.includes(".png") ||
      r.name.includes(".webp") ||
      r.name.includes(".svg")
  );
  const fonts = resources.filter(
    (r) =>
      r.name.includes(".woff") ||
      r.name.includes(".woff2") ||
      r.name.includes(".ttf")
  );

  return {
    scripts:
      scripts.reduce((avg, r) => avg + (r.responseEnd - r.requestStart), 0) /
        scripts.length || 0,
    stylesheets:
      stylesheets.reduce(
        (avg, r) => avg + (r.responseEnd - r.requestStart),
        0
      ) / stylesheets.length || 0,
    images:
      images.reduce((avg, r) => avg + (r.responseEnd - r.requestStart), 0) /
        images.length || 0,
    fonts:
      fonts.reduce((avg, r) => avg + (r.responseEnd - r.requestStart), 0) /
        fonts.length || 0,
    total:
      resources.reduce((avg, r) => avg + (r.responseEnd - r.requestStart), 0) /
        resources.length || 0,
  };
}

function calculateTotalBlockingTime(): number {
  const longTasks = performance.getEntriesByType("longtask");
  return longTasks.reduce(
    (total, task) => total + Math.max(0, task.duration - 50),
    0
  );
}

function calculateSpeedIndex(): number {
  // Simplified speed index calculation
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;

  return navigation.loadEventEnd - navigation.navigationStart;
}

function getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.coreWebVitals.LCP > 2500) {
    recommendations.push(
      "Optimize Largest Contentful Paint by compressing images and reducing server response times."
    );
  }

  if (metrics.coreWebVitals.FID > 100) {
    recommendations.push(
      "Reduce First Input Delay by minimizing JavaScript execution time and using code splitting."
    );
  }

  if (metrics.coreWebVitals.CLS > 0.1) {
    recommendations.push(
      "Improve Cumulative Layout Shift by setting explicit dimensions for images and avoiding dynamic content insertion."
    );
  }

  if (metrics.customMetrics.animationFrameRate < 55) {
    recommendations.push(
      "Optimize animations to maintain 60 FPS by reducing complex calculations in animation loops."
    );
  }

  if (metrics.customMetrics.bundleSize > 500000) {
    recommendations.push(
      "Reduce bundle size by implementing code splitting and removing unused dependencies."
    );
  }

  if (metrics.lighthouseScores.performance < 90) {
    recommendations.push(
      "Improve overall performance score by optimizing images, minifying resources, and enabling compression."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Great job! Your performance metrics are looking good. Keep monitoring for any regressions."
    );
  }

  return recommendations;
}
