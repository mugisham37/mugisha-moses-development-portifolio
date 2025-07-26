"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/elitedev",
    icon: "🐙",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/elitedev",
    icon: "💼",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/elitedev",
    icon: "🐦",
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    href: "mailto:hello@elitedev.com",
    icon: "📧",
    color: "hover:text-green-600",
  },
  {
    name: "Resume",
    href: "/resume.pdf",
    icon: "📄",
    color: "hover:text-purple-600",
  },
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label="Site footer"
      className={`bg-muted/30 border-t border-border ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <section className="space-y-4" aria-labelledby="brand-heading">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold gradient-text"
            >
              <h2 id="brand-heading" className="sr-only">
                Elite Developer Portfolio
              </h2>
              <span aria-hidden="true">Elite Dev</span>
            </motion.div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting exceptional digital experiences with cutting-edge
              technology and innovative design solutions.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span aria-hidden="true">🌍</span>
              <span>Available worldwide</span>
            </div>
          </section>

          {/* Quick Links */}
          <section className="space-y-4" aria-labelledby="quick-links-heading">
            <h3
              id="quick-links-heading"
              className="font-semibold text-foreground"
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation" role="navigation">
              <ul className="space-y-2" role="list">
                {quickLinks.map((link) => (
                  <li key={link.name} role="listitem">
                    <motion.div whileHover={{ x: 4 }}>
                      <a
                        href={link.href}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label={`Navigate to ${link.name} section`}
                      >
                        {link.name}
                      </a>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Services */}
          <section className="space-y-4" aria-labelledby="services-heading">
            <h3 id="services-heading" className="font-semibold text-foreground">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li role="listitem">Web Development</li>
              <li role="listitem">UI/UX Design</li>
              <li role="listitem">Mobile Apps</li>
              <li role="listitem">Consulting</li>
            </ul>
          </section>

          {/* Contact & Social */}
          <section className="space-y-4" aria-labelledby="connect-heading">
            <h3 id="connect-heading" className="font-semibold text-foreground">
              Connect
            </h3>
            <nav aria-label="Social media links" role="navigation">
              <ul className="flex flex-wrap gap-3" role="list">
                {socialLinks.map((social) => (
                  <li key={social.name} role="listitem">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a
                        href={social.href}
                        target={
                          social.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          social.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={`${social.name}${
                          social.href.startsWith("http")
                            ? " (opens in new tab)"
                            : ""
                        }`}
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-lg
                          bg-background border border-border text-muted-foreground
                          transition-all duration-200 ${social.color}
                          hover:border-current hover:shadow-md
                          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        `}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {social.icon}
                        </span>
                      </a>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <address className="text-sm text-muted-foreground not-italic">
              <div className="flex items-center space-x-2">
                <span aria-hidden="true">📍</span>
                <span>Remote & On-site</span>
              </div>
              <div className="flex items-center space-x-2">
                <span aria-hidden="true">⏰</span>
                <span>Available 24/7</span>
              </div>
            </address>
          </section>
        </div>

        {/* Bottom Section */}
        <section
          className="mt-12 pt-8 border-t border-border"
          aria-labelledby="footer-bottom"
        >
          <h2 id="footer-bottom" className="sr-only">
            Copyright and Legal Information
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <span role="img" aria-label="Copyright">
                ©
              </span>{" "}
              {currentYear} Elite Developer Portfolio. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <nav aria-label="Legal links" role="navigation">
                <ul className="flex items-center space-x-6" role="list">
                  <li role="listitem">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link
                        href="/privacy"
                        className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label="Privacy Policy"
                      >
                        Privacy Policy
                      </Link>
                    </motion.div>
                  </li>
                  <li role="listitem">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link
                        href="/terms"
                        className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        aria-label="Terms of Service"
                      >
                        Terms of Service
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </nav>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-red-500"
                  role="img"
                  aria-label="love"
                >
                  ❤️
                </motion.span>
                <span>and Next.js</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
