"use client";

import React from "react";
import { motion } from "framer-motion";
import { DeveloperIntroTyping } from "@/components/animations/TypingEffect";
import { MorphingCodeSnippets } from "@/components/animations/MorphingCodeSnippets";
import { HeroCTAButtons } from "@/components/ui/MagneticButton";
import { ScrollIndicator } from "@/components/animations/ScrollIndicator";
import { cn } from "@/lib/utils";

interface HeroContentProps {
  className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-center justify-center min-h-screen px-4",
        className
      )}
    >
      {/* Main content container */}
      <div className="max-w-6xl mx-auto text-center">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="text-lg md:text-xl text-muted-foreground font-medium">
            Hello, I&apos;m
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        >
          Elite Developer
        </motion.h1>

        {/* Typing effect subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
            <DeveloperIntroTyping />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Crafting exceptional digital experiences with modern technologies.
          Passionate about clean code, innovative solutions, and bringing ideas
          to life through the power of development.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <HeroCTAButtons />
        </motion.div>

        {/* Code snippets showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <MorphingCodeSnippets className="shadow-2xl" />
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating geometric shapes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Floating code symbols */}
          {["</", "{}", "()", "[]", "=>", "&&"].map((symbol, i) => (
            <motion.div
              key={symbol}
              className="absolute text-2xl font-mono text-primary/30 select-none"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId="about" />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </div>
  );
}

// Minimal version for smaller screens
export function HeroContentMobile({ className }: HeroContentProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-center justify-center min-h-screen px-4",
        className
      )}
    >
      <div className="max-w-sm mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Elite Developer
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg mb-6"
        >
          <DeveloperIntroTyping />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-muted-foreground mb-8"
        >
          Crafting exceptional digital experiences with modern technologies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <HeroCTAButtons className="flex-col" />
        </motion.div>
      </div>

      <ScrollIndicator targetId="about" className="bottom-4" />
    </div>
  );
}

export default HeroContent;
