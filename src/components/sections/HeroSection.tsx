"use client";

import React, { useState, useEffect } from "react";
import { HeroScene } from "@/components/3d/HeroScene";
import { HeroContent, HeroContentMobile } from "./HeroContent";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track mouse position for 3D scene interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Set loaded state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className={cn(
        "relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20",
        className
      )}
    >
      {/* 3D Background Scene */}
      <div className="absolute inset-0">
        <HeroScene
          theme={theme}
          mousePosition={mousePosition}
          isLoaded={isLoaded}
          className="w-full h-full"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {isMobile ? <HeroContentMobile /> : <HeroContent />}
      </div>

      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none" />

      {/* Theme-specific background effects */}
      {theme === "neon" && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
      )}

      {theme === "minimal" && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/30 pointer-events-none" />
      )}
    </section>
  );
}

export default HeroSection;
