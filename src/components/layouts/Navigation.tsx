"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { scrollToElement } from "@/lib/utils";
import { createAriaAttributes, liveAnnouncer } from "@/lib/accessibility";

interface NavigationProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

const navigationItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: "🏠" },
  { id: "about", label: "About", href: "#about", icon: "👨‍💻" },
  { id: "projects", label: "Projects", href: "#projects", icon: "🚀" },
  { id: "skills", label: "Skills", href: "#skills", icon: "⚡" },
  { id: "experience", label: "Experience", href: "#experience", icon: "💼" },
  { id: "blog", label: "Blog", href: "#blog", icon: "📝" },
  { id: "contact", label: "Contact", href: "#contact", icon: "📧" },
];

export function Navigation({
  className,
  isMobile = false,
  onItemClick,
}: NavigationProps) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        if (sectionId) {
          const section = document.getElementById(sectionId);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, id: string, label: string) => {
    const targetId = href.replace("#", "");
    scrollToElement(targetId, 80); // Offset for fixed header
    setActiveSection(id);

    // Announce navigation to screen readers
    liveAnnouncer?.announce(`Navigated to ${label} section`, "polite");

    onItemClick?.();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    href: string,
    id: string,
    label: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavClick(href, id, label);
    }
  };

  if (isMobile) {
    return (
      <ul
        className={`space-y-2 ${className}`}
        role="list"
        aria-label="Main navigation menu"
      >
        {navigationItems.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            role="listitem"
          >
            <button
              onClick={() => handleNavClick(item.href, item.id, item.label)}
              onKeyDown={(e) =>
                handleKeyDown(e, item.href, item.id, item.label)
              }
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
              {...createAriaAttributes.currentPage()}
              aria-current={activeSection === item.id ? "page" : undefined}
              aria-label={`Navigate to ${item.label} section${
                activeSection === item.id ? " (current)" : ""
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  transition={{ duration: 0.2 }}
                  className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={`flex items-center space-x-1 ${className}`}
      role="list"
      aria-label="Main navigation menu"
    >
      {navigationItems.map((item) => (
        <motion.li key={item.id} className="relative" role="listitem">
          <motion.button
            onClick={() => handleNavClick(item.href, item.id, item.label)}
            onKeyDown={(e) => handleKeyDown(e, item.href, item.id, item.label)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                activeSection === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-current={activeSection === item.id ? "page" : undefined}
            aria-label={`Navigate to ${item.label} section${
              activeSection === item.id ? " (current)" : ""
            }`}
          >
            {item.label}
          </motion.button>

          {/* Active indicator */}
          {activeSection === item.id && (
            <motion.div
              layoutId="activeIndicator"
              transition={{ duration: 0.2 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
              aria-hidden="true"
            />
          )}
        </motion.li>
      ))}
    </ul>
  );
}
