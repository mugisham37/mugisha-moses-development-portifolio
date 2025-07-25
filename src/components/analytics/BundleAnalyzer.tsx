"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  TreemapChart,
  Treemap,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface BundleData {
  name: string;
  size: number;
  gzipSize: number;
  children?: BundleData[];
  type: "js" | "css" | "asset" | "chunk";
  path: string;
}

interface BundleAnalyzerProps {
  isVisible: boolean;
  onToggle: () => void;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function BundleAnalyzer({ isVisible, onToggle }: BundleAnalyzerProps) {
  const [bundleData, setBundleData] = useState<BundleData[]>([]);
  const [selectedView, setSelectedView] = useState<
    "treemap" | "chunks" | "dependencies" | "optimization"
  >("treemap");
  const [totalSize, setTotalSize] = useState(0);
  const [gzipSize, setGzipSize] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate bundle analysis data
    // In a real implementation, this would come from webpack-bundle-analyzer or similar
    const simulatedBundleData: BundleData[] = [
      {
        name: "main",
        size: 245000,
        gzipSize: 85000,
        type: "chunk",
        path: "/chunks/main.js",
        children: [
          {
            name: "react",
            size: 45000,
            gzipSize: 15000,
            type: "js",
            path: "node_modules/react",
          },
          {
            name: "react-dom",
            size: 120000,
            gzipSize: 40000,
            type: "js",
            path: "node_modules/react-dom",
          },
          {
            name: "next",
            size: 80000,
            gzipSize: 30000,
            type: "js",
            path: "node_modules/next",
          },
        ],
      },
      {
        name: "three",
        size: 580000,
        gzipSize: 180000,
        type: "chunk",
        path: "/chunks/three.js",
        children: [
          {
            name: "three",
            size: 450000,
            gzipSize: 140000,
            type: "js",
            path: "node_modules/three",
          },
          {
            name: "@react-three/fiber",
            size: 85000,
            gzipSize: 25000,
            type: "js",
            path: "node_modules/@react-three/fiber",
          },
          {
            name: "@react-three/drei",
            size: 45000,
            gzipSize: 15000,
            type: "js",
            path: "node_modules/@react-three/drei",
          },
        ],
      },
      {
        name: "framer-motion",
        size: 180000,
        gzipSize: 55000,
        type: "chunk",
        path: "/chunks/framer-motion.js",
        children: [
          {
            name: "framer-motion",
            size: 180000,
            gzipSize: 55000,
            type: "js",
            path: "node_modules/framer-motion",
          },
        ],
      },
      {
        name: "recharts",
        size: 320000,
        gzipSize: 95000,
        type: "chunk",
        path: "/chunks/recharts.js",
        children: [
          {
            name: "recharts",
            size: 250000,
            gzipSize: 75000,
            type: "js",
            path: "node_modules/recharts",
          },
          {
            name: "d3",
            size: 70000,
            gzipSize: 20000,
            type: "js",
            path: "node_modules/d3",
          },
        ],
      },
      {
        name: "styles",
        size: 45000,
        gzipSize: 12000,
        type: "css",
        path: "/styles/globals.css",
      },
      {
        name: "fonts",
        size: 120000,
        gzipSize: 120000, // Fonts don't compress much
        type: "asset",
        path: "/fonts/",
      },
      {
        name: "images",
        size: 850000,
        gzipSize: 850000, // Images already compressed
        type: "asset",
        path: "/images/",
      },
    ];

    setBundleData(simulatedBundleData);

    const total = simulatedBundleData.reduce((sum, item) => sum + item.size, 0);
    const gzip = simulatedBundleData.reduce(
      (sum, item) => sum + item.gzipSize,
      0
    );

    setTotalSize(total);
    setGzipSize(gzip);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-52 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          📦 Bundle Analyzer
        </Button>
      </div>
    );
  }

  const renderTreemap = () => {
    const treemapData = bundleData.map((item) => ({
      name: item.name,
      size: item.size,
      fill: COLORS[bundleData.indexOf(item) % COLORS.length],
    }));

    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Bundle Size Visualization
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <TreemapChart data={treemapData}>
            <Treemap
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            />
            <Tooltip
              formatter={(value: number) => [
                `${(value / 1024).toFixed(1)} KB`,
                "Size",
              ]}
            />
          </TreemapChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderChunks = () => {
    const chunkData = bundleData
      .filter((item) => item.type === "chunk")
      .map((chunk) => ({
        name: chunk.name,
        size: chunk.size / 1024, // Convert to KB
        gzipSize: chunk.gzipSize / 1024,
      }));

    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">JavaScript Chunks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chunkData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)} KB`, ""]}
            />
            <Bar dataKey="size" fill="#8884d8" name="Original Size" />
            <Bar dataKey="gzipSize" fill="#82ca9d" name="Gzipped Size" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderDependencies = () => {
    const dependencyData = bundleData
      .flatMap((chunk) => chunk.children || [])
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map((dep) => ({
        name: dep.name,
        size: dep.size / 1024,
        gzipSize: dep.gzipSize / 1024,
      }));

    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Largest Dependencies</h3>
        <div className="space-y-3">
          {dependencyData.map((dep, index) => (
            <div
              key={dep.name}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{dep.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {dep.size.toFixed(1)} KB → {dep.gzipSize.toFixed(1)} KB
                    (gzipped)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {((dep.gzipSize / dep.size) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">compression</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderOptimization = () => {
    const recommendations = getBundleOptimizationRecommendations(
      bundleData,
      totalSize
    );
    const potentialSavings = calculatePotentialSavings(bundleData);

    return (
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Optimization Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {potentialSavings.codesplitting} KB
              </div>
              <div className="text-sm text-muted-foreground">
                Code Splitting Savings
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {potentialSavings.treeshaking} KB
              </div>
              <div className="text-sm text-muted-foreground">
                Tree Shaking Savings
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {potentialSavings.compression} KB
              </div>
              <div className="text-sm text-muted-foreground">
                Better Compression
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg"
              >
                <div className="text-lg">{rec.icon}</div>
                <div>
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {rec.description}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Potential savings: {rec.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Bundle Size Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bundleData.map((item, index) => ({
                  name: item.name,
                  value: item.size,
                  fill: COLORS[index % COLORS.length],
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bundleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${(value / 1024).toFixed(1)} KB`,
                  "Size",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Bundle Analyzer</h2>
            <p className="text-muted-foreground">
              Total: {(totalSize / 1024).toFixed(1)} KB →{" "}
              {(gzipSize / 1024).toFixed(1)} KB (gzipped)
            </p>
          </div>
          <Button onClick={onToggle} variant="outline" size="sm">
            ✕ Close
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Total Size
            </h4>
            <p className="text-2xl font-bold">
              {(totalSize / 1024).toFixed(1)} KB
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Gzipped
            </h4>
            <p className="text-2xl font-bold">
              {(gzipSize / 1024).toFixed(1)} KB
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Compression
            </h4>
            <p className="text-2xl font-bold">
              {((gzipSize / totalSize) * 100).toFixed(0)}%
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Chunks
            </h4>
            <p className="text-2xl font-bold">
              {bundleData.filter((item) => item.type === "chunk").length}
            </p>
          </Card>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "treemap", label: "Treemap", icon: "🗺️" },
            { key: "chunks", label: "Chunks", icon: "📦" },
            { key: "dependencies", label: "Dependencies", icon: "🔗" },
            { key: "optimization", label: "Optimization", icon: "⚡" },
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
          {selectedView === "treemap" && renderTreemap()}
          {selectedView === "chunks" && renderChunks()}
          {selectedView === "dependencies" && renderDependencies()}
          {selectedView === "optimization" && renderOptimization()}
        </motion.div>
      </div>
    </div>
  );
}

function getBundleOptimizationRecommendations(
  bundleData: BundleData[],
  totalSize: number
) {
  const recommendations = [];

  // Check for large dependencies
  const largeDeps = bundleData
    .flatMap((chunk) => chunk.children || [])
    .filter((dep) => dep.size > 100000);

  if (largeDeps.length > 0) {
    recommendations.push({
      icon: "📦",
      title: "Large Dependencies Detected",
      description: `Consider alternatives or lazy loading for ${largeDeps
        .map((d) => d.name)
        .join(", ")}`,
      savings: `${(
        (largeDeps.reduce((sum, dep) => sum + dep.size, 0) / 1024) *
        0.3
      ).toFixed(0)} KB`,
    });
  }

  // Check for code splitting opportunities
  const mainChunk = bundleData.find((chunk) => chunk.name === "main");
  if (mainChunk && mainChunk.size > 200000) {
    recommendations.push({
      icon: "✂️",
      title: "Code Splitting Opportunity",
      description:
        "Main chunk is large. Consider splitting into smaller chunks for better loading performance.",
      savings: `${((mainChunk.size / 1024) * 0.4).toFixed(0)} KB`,
    });
  }

  // Check for unused dependencies
  recommendations.push({
    icon: "🌳",
    title: "Tree Shaking Optimization",
    description: "Enable tree shaking to remove unused code from your bundles.",
    savings: `${((totalSize / 1024) * 0.15).toFixed(0)} KB`,
  });

  // Check compression
  const compressionRatio =
    bundleData.reduce((sum, item) => sum + item.gzipSize, 0) / totalSize;
  if (compressionRatio > 0.4) {
    recommendations.push({
      icon: "🗜️",
      title: "Improve Compression",
      description:
        "Consider using Brotli compression or optimizing assets for better compression ratios.",
      savings: `${((totalSize / 1024) * 0.1).toFixed(0)} KB`,
    });
  }

  return recommendations;
}

function calculatePotentialSavings(bundleData: BundleData[]) {
  const totalSize = bundleData.reduce((sum, item) => sum + item.size, 0);

  return {
    codesplitting: Math.round((totalSize / 1024) * 0.25),
    treeshaking: Math.round((totalSize / 1024) * 0.15),
    compression: Math.round((totalSize / 1024) * 0.1),
  };
}
