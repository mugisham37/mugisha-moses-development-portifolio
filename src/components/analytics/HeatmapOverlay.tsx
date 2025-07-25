"use client";

import { useState, useEffect, useRef } from "react";
import { useAnalytics, type HeatmapData } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/Button";

interface HeatmapOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function HeatmapOverlay({ isVisible, onToggle }: HeatmapOverlayProps) {
  const { getAnalyticsDashboard } = useAnalytics();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [intensity, setIntensity] = useState(0.5);

  useEffect(() => {
    const updateHeatmap = () => {
      const dashboard = getAnalyticsDashboard();
      if (dashboard?.heatmap) {
        setHeatmapData(dashboard.heatmap);
      }
    };

    updateHeatmap();
    const interval = setInterval(updateHeatmap, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [getAnalyticsDashboard]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || heatmapData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create heatmap visualization
    heatmapData.forEach((point) => {
      const x = (point.x / 100) * canvas.width;
      const y = (point.y / 100) * canvas.height;
      const radius = 30;

      // Create radial gradient for heat point
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(
        0,
        `rgba(255, 0, 0, ${intensity * point.intensity})`
      );
      gradient.addColorStop(
        0.5,
        `rgba(255, 255, 0, ${intensity * point.intensity * 0.5})`
      );
      gradient.addColorStop(1, "rgba(255, 255, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Apply blend mode for better visualization
    ctx.globalCompositeOperation = "multiply";
  }, [isVisible, heatmapData, intensity]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          🔥 Heatmap
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Heatmap Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 bg-background/90 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="font-semibold">Interaction Heatmap</h3>
          <Button onClick={onToggle} variant="outline" size="sm">
            ✕ Close
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Intensity: {Math.round(intensity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Data points: {heatmapData.length}</p>
            <p>Red areas indicate high interaction</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setHeatmapData([])}
              variant="outline"
              size="sm"
            >
              Clear Data
            </Button>
            <Button
              onClick={() => {
                const dashboard = getAnalyticsDashboard();
                if (dashboard?.heatmap) {
                  setHeatmapData(dashboard.heatmap);
                }
              }}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="fixed bottom-4 left-4 z-50 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        <h4 className="font-medium mb-2">Heat Legend</h4>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
          <span>High → Low Interaction</span>
        </div>
      </div>
    </>
  );
}
