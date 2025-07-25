"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectMetricsChartProps {
  project: Project;
  className?: string;
}

export function ProjectMetricsChart({
  project,
  className,
}: ProjectMetricsChartProps) {
  const { metrics } = project;

  // Prepare data for different chart types
  const performanceData = [
    { name: "Performance", value: metrics.performanceScore, color: "#10B981" },
    {
      name: "Accessibility",
      value: metrics.accessibilityScore,
      color: "#3B82F6",
    },
    { name: "SEO", value: metrics.seoScore, color: "#8B5CF6" },
    { name: "Test Coverage", value: metrics.testCoverage, color: "#F59E0B" },
  ];

  const githubData = [
    { name: "Stars", value: metrics.githubStars, icon: "⭐" },
    { name: "Forks", value: metrics.forks, icon: "🍴" },
    { name: "Commits", value: metrics.commits, icon: "📝" },
    { name: "Contributors", value: metrics.contributors, icon: "👥" },
  ];

  const codeQualityData = [
    { name: "Lines of Code", value: metrics.linesOfCode },
    { name: "Test Coverage", value: metrics.testCoverage },
    { name: "Performance", value: metrics.performanceScore },
    { name: "Accessibility", value: metrics.accessibilityScore },
  ];

  // Mock time series data for project progress
  const progressData = [
    { month: "Jan", commits: 45, stars: 12, performance: 85 },
    { month: "Feb", commits: 67, stars: 28, performance: 87 },
    { month: "Mar", commits: 89, stars: 45, performance: 89 },
    { month: "Apr", commits: 123, stars: 67, performance: 91 },
    { month: "May", commits: 156, stars: 89, performance: 93 },
    {
      month: "Jun",
      commits: 189,
      stars: metrics.githubStars,
      performance: metrics.performanceScore,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-8", className)}
    >
      {/* Key Metrics Overview */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-6">Project Metrics Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {githubData.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300">
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold mb-1">
                  {metric.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.name}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Scores */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-6">Quality Scores</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radial Chart */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h4 className="text-lg font-medium mb-4">Performance Metrics</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  data={performanceData}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={(entry) => entry.color}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {performanceData.map((item) => (
                <Badge
                  key={item.name}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: item.color + "40", color: item.color }}
                >
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h4 className="text-lg font-medium mb-4">Code Quality Metrics</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={codeQualityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value?.toLocaleString()}
                              {label.includes("Coverage") ||
                              label.includes("Performance") ||
                              label.includes("Accessibility")
                                ? "%"
                                : ""}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Project Progress Over Time */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-6">Project Progress</h3>
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p
                              key={index}
                              className="text-sm"
                              style={{ color: entry.color }}
                            >
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="commits"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  name="Commits"
                />
                <Line
                  type="monotone"
                  dataKey="stars"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  name="Stars"
                />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  name="Performance Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Commits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Performance Score
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Additional Metrics */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-6">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.bundleSize && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Bundle Size</h4>
              <p className="text-2xl font-bold text-primary-500">
                {metrics.bundleSize}
              </p>
              <p className="text-sm text-muted-foreground">
                Optimized for performance
              </p>
            </Card>
          )}

          {metrics.loadTime && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Load Time</h4>
              <p className="text-2xl font-bold text-green-500">
                {metrics.loadTime}ms
              </p>
              <p className="text-sm text-muted-foreground">
                First contentful paint
              </p>
            </Card>
          )}

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h4 className="font-medium mb-2">Code Quality</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Test Coverage</span>
                <Badge variant="outline" className="text-xs">
                  {metrics.testCoverage}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.testCoverage}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
