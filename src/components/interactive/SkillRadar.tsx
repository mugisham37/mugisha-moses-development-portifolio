"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { skillCategories } from "@/data/skills";
import type { SkillCategory, Skill } from "@/types";

interface SkillRadarProps {
  className?: string;
  selectedCategories?: string[];
  interactive?: boolean;
  theme?: "light" | "dark" | "neon" | "minimal";
  animationDelay?: number;
  size?: "sm" | "md" | "lg";
}

interface RadarDataPoint {
  category: string;
  value: number;
  color: string;
  skills: Skill[];
}

interface TooltipData {
  category: string;
  value: number;
  skills: Skill[];
  x: number;
  y: number;
}

export function SkillRadar({
  className = "",
  selectedCategories,
  interactive = true,
  theme = "dark",
  animationDelay = 0,
  size = "md",
}: SkillRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Size configurations
  const sizeConfig = {
    sm: { width: 300, height: 300, margin: 40 },
    md: { width: 400, height: 400, margin: 60 },
    lg: { width: 500, height: 500, margin: 80 },
  };

  const { width, height, margin } = sizeConfig[size];
  const radius = Math.min(width, height) / 2 - margin;

  // Filter data based on selected categories
  const radarData: RadarDataPoint[] = skillCategories
    .filter(
      (category) =>
        !selectedCategories || selectedCategories.includes(category.name)
    )
    .map((category) => ({
      category: category.name,
      value: category.proficiency,
      color: category.color,
      skills: category.skills,
    }));

  useEffect(() => {
    if (!svgRef.current || radarData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, radarData.length])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear().domain([0, 10]).range([0, radius]);

    // Create grid circles
    const gridLevels = [2, 4, 6, 8, 10];
    const gridGroup = g.append("g").attr("class", "grid");

    gridLevels.forEach((level, i) => {
      gridGroup
        .append("circle")
        .attr("r", radiusScale(level))
        .attr("fill", "none")
        .attr("stroke", theme === "dark" ? "#374151" : "#E5E7EB")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", i === gridLevels.length - 1 ? "none" : "2,2")
        .attr("opacity", 0.6);

      // Add level labels
      gridGroup
        .append("text")
        .attr("x", 5)
        .attr("y", -radiusScale(level))
        .attr("dy", "0.35em")
        .attr("font-size", "10px")
        .attr("fill", theme === "dark" ? "#9CA3AF" : "#6B7280")
        .text(level.toString());
    });

    // Create axis lines
    const axisGroup = g.append("g").attr("class", "axes");

    radarData.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      axisGroup
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", theme === "dark" ? "#374151" : "#E5E7EB")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6);

      // Add category labels
      const labelRadius = radius + 20;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      axisGroup
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", theme === "dark" ? "#F3F4F6" : "#1F2937")
        .style("cursor", interactive ? "pointer" : "default")
        .text(d.category.replace(/[&-]/g, " "))
        .on("mouseover", interactive ? () => handleCategoryHover(d, i) : null)
        .on("mouseout", interactive ? () => handleCategoryLeave() : null);
    });

    // Create radar area
    const radarLine = d3
      .lineRadial<RadarDataPoint>()
      .angle((d, i) => angleScale(i))
      .radius((d) => radiusScale(d.value))
      .curve(d3.curveLinearClosed);

    const radarArea = d3
      .areaRadial<RadarDataPoint>()
      .angle((d, i) => angleScale(i))
      .innerRadius(0)
      .outerRadius((d) => radiusScale(d.value))
      .curve(d3.curveLinearClosed);

    // Add radar area with animation
    const areaPath = g
      .append("path")
      .datum(radarData)
      .attr("class", "radar-area")
      .attr("d", radarArea)
      .attr("fill", `url(#${gradientId})`)
      .attr("fill-opacity", 0.3)
      .attr("stroke", "none");

    // Add radar line
    const linePath = g
      .append("path")
      .datum(radarData)
      .attr("class", "radar-line")
      .attr("d", radarLine)
      .attr("fill", "none")
      .attr("stroke", theme === "neon" ? "#00FFFF" : "#3B82F6")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round");

    // Create gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("radialGradient")
      .attr("id", `radarGradient-${Math.random().toString(36).substr(2, 9)}`)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    const gradientId = gradient.attr("id");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", theme === "neon" ? "#00FFFF" : "#3B82F6")
      .attr("stop-opacity", 0.6);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", theme === "neon" ? "#FF00FF" : "#8B5CF6")
      .attr("stop-opacity", 0.1);

    // Add data points
    const pointsGroup = g.append("g").attr("class", "data-points");

    radarData.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const pointRadius = radiusScale(d.value);
      const x = Math.cos(angle) * pointRadius;
      const y = Math.sin(angle) * pointRadius;

      const point = pointsGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("fill", d.color)
        .attr("stroke", theme === "dark" ? "#1F2937" : "#FFFFFF")
        .attr("stroke-width", 2)
        .style("cursor", interactive ? "pointer" : "default")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

      if (interactive) {
        point
          .on("mouseover", (event) => handlePointHover(event, d, x, y))
          .on("mouseout", handlePointLeave)
          .on("click", () => handlePointClick(d));
      }

      // Animate point appearance
      point
        .transition()
        .delay(animationDelay + i * 100)
        .duration(600)
        .ease(d3.easeElasticOut)
        .attr("r", 6);
    });

    // Animate paths
    if (isAnimating) {
      const totalLength = linePath.node()?.getTotalLength() || 0;

      linePath
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .delay(animationDelay)
        .duration(1500)
        .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0)
        .on("end", () => setIsAnimating(false));

      areaPath
        .attr("opacity", 0)
        .transition()
        .delay(animationDelay + 500)
        .duration(1000)
        .ease(d3.easeQuadInOut)
        .attr("opacity", 1);
    }
  }, [
    radarData,
    width,
    height,
    radius,
    theme,
    interactive,
    animationDelay,
    isAnimating,
  ]);

  const handleCategoryHover = (data: RadarDataPoint, index: number) => {
    setHoveredCategory(data.category);

    // Highlight the category
    const svg = d3.select(svgRef.current);
    svg
      .selectAll("text")
      .filter((d, i) => i === index)
      .transition()
      .duration(200)
      .attr("font-size", "14px")
      .attr("font-weight", "600");
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);

    // Reset category styling
    const svg = d3.select(svgRef.current);
    svg
      .selectAll("text")
      .transition()
      .duration(200)
      .attr("font-size", "12px")
      .attr("font-weight", "500");
  };

  const handlePointHover = (
    event: MouseEvent,
    data: RadarDataPoint,
    x: number,
    y: number
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setTooltip({
      category: data.category,
      value: data.value,
      skills: data.skills,
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    });

    // Animate point on hover
    d3.select(event.target as SVGCircleElement)
      .transition()
      .duration(200)
      .attr("r", 8)
      .attr("stroke-width", 3);
  };

  const handlePointLeave = (event: MouseEvent) => {
    setTooltip(null);

    // Reset point size
    d3.select(event.target as SVGCircleElement)
      .transition()
      .duration(200)
      .attr("r", 6)
      .attr("stroke-width", 2);
  };

  const handlePointClick = (data: RadarDataPoint) => {
    // Could emit an event or navigate to detailed skills view
    console.log("Clicked category:", data.category);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: animationDelay / 1000 }}
        className="relative"
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          style={{
            filter: theme === "neon" ? "drop-shadow(0 0 10px #00FFFF)" : "none",
          }}
        />

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/50">
          <h4 className="text-sm font-semibold mb-2 text-foreground">
            Proficiency Scale
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>1-2: Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>3-5: Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>6-8: Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>9-10: Expert</span>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg max-w-xs"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                transform: tooltip.x > width / 2 ? "translateX(-100%)" : "none",
              }}
            >
              <h4 className="font-semibold text-foreground mb-1">
                {tooltip.category}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Proficiency: {tooltip.value}/10
              </p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">
                  Top Skills:
                </p>
                {tooltip.skills
                  .sort((a, b) => b.level - a.level)
                  .slice(0, 3)
                  .map((skill) => (
                    <div
                      key={skill.name}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
                        {skill.name}
                      </span>
                      <span className="text-foreground font-medium">
                        {skill.level}/10
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
