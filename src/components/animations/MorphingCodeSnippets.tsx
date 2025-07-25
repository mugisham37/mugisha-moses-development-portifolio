"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/lib/theme";

interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  title: string;
}

interface MorphingCodeSnippetsProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const codeSnippets: CodeSnippet[] = [
  {
    id: "react-component",
    language: "tsx",
    title: "React Component",
    code: `const Portfolio = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="portfolio"
    >
      <h1>Welcome to my portfolio</h1>
    </motion.div>
  );
};`,
  },
  {
    id: "typescript-interface",
    language: "typescript",
    title: "TypeScript Interface",
    code: `interface Developer {
  name: string;
  skills: Skill[];
  experience: number;
  passion: 'coding' | 'learning' | 'building';
}

type Skill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience: number;
};`,
  },
  {
    id: "api-integration",
    language: "javascript",
    title: "API Integration",
    code: `const fetchProjects = async () => {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    return projects.map(project => ({
      ...project,
      technologies: project.tech.split(','),
      featured: project.stars > 100
    }));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};`,
  },
  {
    id: "css-animation",
    language: "css",
    title: "CSS Animation",
    code: `@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.floating-element {
  animation: float 6s ease-in-out infinite;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
}`,
  },
  {
    id: "node-server",
    language: "javascript",
    title: "Node.js Server",
    code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/portfolio', (req, res) => {
  res.json({
    developer: 'Elite Developer',
    status: 'Available for hire',
    projects: await getProjects(),
    contact: 'hello@developer.com'
  });
});

app.listen(3000, () => {
  console.log('Portfolio API running on port 3000');
});`,
  },
];

export function MorphingCodeSnippets({
  className = "",
  autoPlay = true,
  interval = 4000,
}: MorphingCodeSnippetsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();

  const syntaxTheme = theme === "dark" || theme === "neon" ? vscDarkPlus : vs;

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const currentSnippet = codeSnippets[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSnippet.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="bg-card border border-border rounded-lg overflow-hidden shadow-lg"
        >
          {/* Code snippet header */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentSnippet.title}
              </span>
            </div>
            <span className="text-xs text-muted-foreground uppercase">
              {currentSnippet.language}
            </span>
          </div>

          {/* Code content */}
          <div className="relative">
            <SyntaxHighlighter
              language={currentSnippet.language}
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                color:
                  theme === "dark" || theme === "neon" ? "#6b7280" : "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              {currentSnippet.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {codeSnippets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Show code snippet ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
