"use client";

import React, { useRef, useState } from "react";
import * as framerMotion from "framer-motion";
import { cn } from "@/lib/utils";

const { motion } = framerMotion;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  magneticRadius?: number;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-foreground hover:bg-muted",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.3,
  magneticRadius = 100,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    if (distance < magneticRadius) {
      const strength = Math.max(0, 1 - distance / magneticRadius);
      const deltaX = (mouseX - centerX) * strength * magneticStrength;
      const deltaY = (mouseY - centerY) * strength * magneticStrength;

      setMousePosition({ x: deltaX, y: deltaY });
    } else {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background:
            variant === "primary"
              ? "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, transparent 70%)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: 2,
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
}

// Specialized CTA buttons for hero section
export function HeroCTAButtons({ className }: { className?: string }) {
  const handleViewWork = () => {
    const projectsSection = document.getElementById("projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <MagneticButton
        variant="primary"
        size="lg"
        onClick={handleViewWork}
        magneticStrength={0.4}
        magneticRadius={120}
        className="group"
      >
        <span className="mr-2">View My Work</span>
        <motion.span
          className="inline-block"
          animate={{ x: [0, 4, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          →
        </motion.span>
      </MagneticButton>

      <MagneticButton
        variant="outline"
        size="lg"
        onClick={handleContact}
        magneticStrength={0.3}
        magneticRadius={100}
        className="group"
      >
        <span className="mr-2">Get In Touch</span>
        <motion.div
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </MagneticButton>
    </div>
  );
}
