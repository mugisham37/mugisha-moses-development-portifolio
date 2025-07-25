"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { skillCategories } from "@/data/skills";

interface SkillRadarSimpleProps {
  className?: string;
}

export function SkillRadarSimple({ className = "" }: SkillRadarSimpleProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 400;
  const height = 400;
  const margin = 60;
  const radius = Math.min(width, height) / 2 - margin;

  // Prepare data
  const radarData = skillCategories.map((category) => ({
    category: category.name,
    value: category.proficiency,
    color: category.color,
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
    gridLevels.forEach((level) => {
      g.append("circle")
        .attr("r", radiusScale(level))
        .attr("fill", "none")
        .attr("stroke", "#374151")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6);
    });

    // Create axis lines
    radarData.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#374151")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6);

      // Add category labels
      const labelRadius = radius + 20;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#F3F4F6")
        .text(d.category.replace(/[&-]/g, " "));
    });

    // Create radar area
    const radarLine = d3
      .lineRadial<(typeof radarData)[0]>()
      .angle((d, i) => angleScale(i))
      .radius((d) => radiusScale(d.value))
      .curve(d3.curveLinearClosed);

    // Add radar line
    g.append("path")
      .datum(radarData)
      .attr("d", radarLine)
      .attr("fill", "rgba(59, 130, 246, 0.3)")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2);

    // Add data points
    radarData.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const pointRadius = radiusScale(d.value);
      const x = Math.cos(angle) * pointRadius;
      const y = Math.sin(angle) * pointRadius;

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", d.color)
        .attr("stroke", "#1F2937")
        .attr("stroke-width", 2);
    });
  }, [radarData]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        />
      </motion.div>
    </div>
  );
}
