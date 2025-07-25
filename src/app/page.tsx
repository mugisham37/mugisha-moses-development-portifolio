"use client";

import React from "react";
import ThemeSwitcher, { ThemePreview } from "@/components/ui/ThemeSwitcher";
import { ThemeMotion, useTheme } from "@/components/providers/ThemeProvider";
import ThemeStatus from "@/components/ui/ThemeStatus";
import ThemeConfiguration from "@/components/ui/ThemeConfiguration";
import ThemePerformanceMonitor from "@/components/ui/ThemePerformanceMonitor";
import ThemeAccessibilityChecker from "@/components/ui/ThemeAccessibilityChecker";
import {
  SkillRadar,
  ExperienceTimeline,
  CompetencyMatrix,
  ContactForm,
  CalendarBooking,
  CommunicationOptions,
} from "@/components/interactive";
import {
  ScrollAnimation,
  Magnetic,
  Tilt,
  Floating,
  Typewriter,
} from "@/components/animations";
import {
  SemanticSection,
  SemanticHeading,
} from "@/components/accessibility/SemanticSection";
import { useAccessibility } from "@/hooks/useAccessibility";
import { themes } from "@/lib/theme";

export default function Home() {
  const { announcePageChange } = useAccessibility();

  // Announce page load for screen readers
  React.useEffect(() => {
    announcePageChange("Elite Developer Portfolio homepage");
  }, [announcePageChange]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <SemanticSection
        id="home"
        as="section"
        ariaLabel="Hero section with portfolio introduction"
        className="min-h-screen flex items-center justify-center"
        landmark
      >
        <ThemeDemo />
      </SemanticSection>

      {/* About Section */}
      <SemanticSection
        id="about"
        as="section"
        ariaLabel="About the developer"
        className="min-h-screen flex items-center justify-center bg-muted/20"
        landmark
      >
        <div className="text-center">
          <SemanticHeading level={2} className="text-4xl font-bold mb-4">
            About Section
          </SemanticHeading>
          <p className="text-muted-foreground">
            This is the about section placeholder
          </p>
        </div>
      </SemanticSection>

      {/* Projects Section */}
      <SemanticSection
        id="projects"
        as="section"
        ariaLabel="Portfolio projects showcase"
        className="min-h-screen flex items-center justify-center py-20"
        landmark
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <SemanticHeading level={2} className="text-4xl font-bold mb-4">
              Projects Section
            </SemanticHeading>
            <p className="text-muted-foreground">
              Project showcase temporarily disabled for testing
            </p>
          </div>
        </div>
      </SemanticSection>

      {/* Skills Section */}
      <SemanticSection
        id="skills"
        as="section"
        ariaLabel="Technical skills and expertise"
        className="min-h-screen bg-muted/20 py-20"
        landmark
      >
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <SemanticHeading level={2} className="text-4xl font-bold mb-4">
              Skills & Expertise
            </SemanticHeading>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Interactive visualization of my technical skills and proficiency
              levels across different domains
            </p>
          </header>

          {/* Skills Radar Chart */}
          <div
            className="flex justify-center mb-16"
            role="img"
            aria-label="Interactive skills radar chart showing technical proficiency levels"
          >
            <SkillRadar
              className="w-full max-w-2xl"
              interactive={true}
              size="lg"
              animationDelay={200}
            />
          </div>

          {/* Competency Matrix */}
          <div
            className="max-w-6xl mx-auto"
            role="region"
            aria-label="Detailed competency matrix with endorsements and certifications"
          >
            <CompetencyMatrix
              className="w-full"
              showEndorsements={true}
              showCertifications={true}
              showLearningGoals={true}
              interactive={true}
            />
          </div>
        </div>
      </SemanticSection>

      {/* Experience Section */}
      <SemanticSection
        id="experience"
        as="section"
        ariaLabel="Professional experience and career timeline"
        className="min-h-screen flex items-center justify-center py-20"
        landmark
      >
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <SemanticHeading level={2} className="text-4xl font-bold mb-4">
              Professional Experience
            </SemanticHeading>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visual career progression timeline showing my journey, key
              milestones, and achievements in software development
            </p>
          </header>
          <div
            className="max-w-4xl mx-auto"
            role="img"
            aria-label="Interactive career timeline with achievements and milestones"
          >
            <ExperienceTimeline
              className="w-full"
              showAchievements={true}
              interactive={true}
            />
          </div>
        </div>
      </SemanticSection>

      {/* Blog Section */}
      <SemanticSection
        id="blog"
        as="section"
        ariaLabel="Technical blog and articles"
        className="min-h-screen flex items-center justify-center bg-muted/20"
        landmark
      >
        <div className="text-center">
          <SemanticHeading level={2} className="text-4xl font-bold mb-4">
            Blog Section
          </SemanticHeading>
          <p className="text-muted-foreground">
            This is the blog section placeholder
          </p>
        </div>
      </SemanticSection>

      {/* Contact Section */}
      <SemanticSection
        id="contact"
        as="section"
        ariaLabel="Contact information and communication options"
        className="min-h-screen flex items-center justify-center py-20"
        landmark
      >
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <SemanticHeading level={2} className="text-4xl font-bold mb-4">
              Let&apos;s Work Together
            </SemanticHeading>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to bring your project to life? Let&apos;s discuss your ideas
              and create something amazing together.
            </p>
          </header>

          {/* Contact Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Contact Form */}
            <div role="region" aria-labelledby="contact-form-heading">
              <SemanticHeading
                level={3}
                id="contact-form-heading"
                className="text-2xl font-semibold mb-6 text-center"
              >
                Send a Message
              </SemanticHeading>
              <ContactForm className="w-full" />
            </div>

            {/* Calendar Booking */}
            <div role="region" aria-labelledby="calendar-heading">
              <SemanticHeading
                level={3}
                id="calendar-heading"
                className="text-2xl font-semibold mb-6 text-center"
              >
                Schedule a Meeting
              </SemanticHeading>
              <CalendarBooking className="w-full" />
            </div>

            {/* Communication Options */}
            <div role="region" aria-labelledby="communication-heading">
              <SemanticHeading
                level={3}
                id="communication-heading"
                className="text-2xl font-semibold mb-6 text-center"
              >
                Other Ways to Connect
              </SemanticHeading>
              <CommunicationOptions className="w-full" />
            </div>
          </div>
        </div>
      </SemanticSection>
    </div>
  );
}

function ThemeDemo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <SemanticHeading
            level={1}
            className="text-4xl font-bold gradient-text"
          >
            Elite Developer Portfolio
          </SemanticHeading>
          <p className="text-lg text-muted-foreground">
            Advanced Theme System Implementation
          </p>
        </header>

        {/* Theme Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ThemeConfiguration showAdvanced />
          <div className="space-y-8">
            <ThemePerformanceMonitor showDetails />
            <ThemeAccessibilityChecker />
          </div>
        </div>

        {/* Theme Status */}
        <ThemeStatus showDetails />

        {/* Theme Switcher Demo */}
        <ThemeSwitcherDemo />

        {/* Theme Effects Demo */}
        <ThemeEffectsDemo />

        {/* Animation Demo */}
        <AnimationDemo />

        {/* Cards Demo */}
        <CardsDemo />
      </div>
    </div>
  );
}

function ThemeSwitcherDemo() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <SemanticHeading level={2} className="text-2xl font-semibold">
        Theme Switchers
      </SemanticHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Dropdown
          </h3>
          <ThemeSwitcher variant="dropdown" showLabels />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Toggle</h3>
          <ThemeSwitcher variant="toggle" showLabels />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Cycle</h3>
          <ThemeSwitcher variant="cycle" showLabels />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Grid</h3>
          <ThemeSwitcher variant="grid" showLabels={false} size="sm" />
        </div>
      </div>

      {/* Theme Previews */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme Previews</h3>
        <div className="flex gap-4 flex-wrap">
          {themes.map((themeName) => (
            <ThemePreview
              key={themeName}
              themeName={themeName}
              isActive={theme === themeName}
              onClick={() => setTheme(themeName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeEffectsDemo() {
  return (
    <div className="space-y-6">
      <SemanticHeading level={2} className="text-2xl font-semibold">
        Theme Effects
      </SemanticHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Glass Effect */}
        <div className="glass rounded-lg p-6 space-y-2">
          <SemanticHeading level={3} className="font-semibold">
            Glass Morphism
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            Backdrop blur with transparency
          </p>
        </div>

        {/* Neumorphism Effect */}
        <div className="neumorphism rounded-lg p-6 space-y-2">
          <SemanticHeading level={3} className="font-semibold">
            Neumorphism
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            Soft shadows and highlights
          </p>
        </div>

        {/* Gradient Effect */}
        <div className="gradient-bg rounded-lg p-6 space-y-2 text-white">
          <SemanticHeading level={3} className="font-semibold">
            Animated Gradient
          </SemanticHeading>
          <p className="text-sm opacity-90">Dynamic color transitions</p>
        </div>
      </div>
    </div>
  );
}

function AnimationDemo() {
  return (
    <div className="space-y-6">
      <SemanticHeading level={2} className="text-2xl font-semibold">
        Animation Showcase
      </SemanticHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scroll Animation */}
        <ScrollAnimation
          variant="slideUp"
          className="p-4 bg-card rounded-lg border border-border"
        >
          <SemanticHeading level={3} className="font-medium mb-2">
            Scroll Animation
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            This card animates when scrolled into view
          </p>
        </ScrollAnimation>

        {/* Magnetic Effect */}
        <Magnetic className="p-4 bg-card rounded-lg border border-border cursor-pointer">
          <SemanticHeading level={3} className="font-medium mb-2">
            Magnetic Effect
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            Hover to see magnetic attraction
          </p>
        </Magnetic>

        {/* Tilt Effect */}
        <Tilt className="p-4 bg-card rounded-lg border border-border cursor-pointer">
          <SemanticHeading level={3} className="font-medium mb-2">
            Tilt Effect
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            Hover for 3D tilt interaction
          </p>
        </Tilt>

        {/* Floating Animation */}
        <Floating className="p-4 bg-card rounded-lg border border-border">
          <SemanticHeading level={3} className="font-medium mb-2">
            Floating
          </SemanticHeading>
          <p className="text-sm text-muted-foreground">
            Gentle floating animation
          </p>
        </Floating>
      </div>

      {/* Typewriter Effect */}
      <div className="p-6 bg-card rounded-lg border border-border">
        <SemanticHeading level={3} className="font-medium mb-4">
          Typewriter Effect
        </SemanticHeading>
        <Typewriter
          text="This text appears with a typewriter effect, creating an engaging user experience."
          speed={50}
          className="text-lg"
        />
      </div>
    </div>
  );
}

function CardsDemo() {
  return (
    <div className="space-y-6">
      <SemanticHeading level={2} className="text-2xl font-semibold">
        Interactive Cards
      </SemanticHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <ScrollAnimation
            key={i}
            variant="slideUp"
            delay={i * 0.1}
            className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/50"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded bg-primary/20" />
              </div>
              <SemanticHeading level={3} className="font-semibold">
                Project {i}
              </SemanticHeading>
              <p className="text-sm text-muted-foreground">
                This is a demo card that responds to theme changes with smooth
                animations.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                  React
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                  TypeScript
                </span>
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </div>
  );
}
