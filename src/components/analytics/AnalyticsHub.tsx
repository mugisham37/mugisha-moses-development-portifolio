"use client";

import { useState } from "react";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { HeatmapOverlay } from "./HeatmapOverlay";
import { ConversionFunnel } from "./ConversionFunnel";
import { EngagementMetrics } from "./EngagementMetrics";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { BundleAnalyzer } from "./BundleAnalyzer";
import { SEOOptimizer } from "./SEOOptimizer";
import { Button } from "@/components/ui/Button";

export function AnalyticsHub() {
  const [activeView, setActiveView] = useState<
    | "none"
    | "dashboard"
    | "heatmap"
    | "funnel"
    | "engagement"
    | "performance"
    | "bundle"
    | "seo"
  >("none");

  // Only show in development or for admin users
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const toggleView = (view: typeof activeView) => {
    setActiveView(activeView === view ? "none" : view);
  };

  return (
    <>
      {/* Analytics Controls */}
      {activeView === "none" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <Button
            onClick={() => toggleView("dashboard")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            📊 Analytics Dashboard
          </Button>
          <Button
            onClick={() => toggleView("heatmap")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            🔥 Heatmap
          </Button>
          <Button
            onClick={() => toggleView("funnel")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            📈 Conversion Funnel
          </Button>
          <Button
            onClick={() => toggleView("engagement")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            📋 Engagement Metrics
          </Button>
          <Button
            onClick={() => toggleView("performance")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            ⚡ Performance Monitor
          </Button>
          <Button
            onClick={() => toggleView("bundle")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            📦 Bundle Analyzer
          </Button>
          <Button
            onClick={() => toggleView("seo")}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            🔍 SEO Optimizer
          </Button>
        </div>
      )}

      {/* Analytics Components */}
      {activeView === "dashboard" && <AnalyticsDashboard />}

      <HeatmapOverlay
        isVisible={activeView === "heatmap"}
        onToggle={() => toggleView("heatmap")}
      />

      <ConversionFunnel
        isVisible={activeView === "funnel"}
        onToggle={() => toggleView("funnel")}
      />

      <EngagementMetrics
        isVisible={activeView === "engagement"}
        onToggle={() => toggleView("engagement")}
      />

      <PerformanceMonitor
        isVisible={activeView === "performance"}
        onToggle={() => toggleView("performance")}
      />

      <BundleAnalyzer
        isVisible={activeView === "bundle"}
        onToggle={() => toggleView("bundle")}
      />

      <SEOOptimizer
        isVisible={activeView === "seo"}
        onToggle={() => toggleView("seo")}
      />
    </>
  );
}
