"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LightbulbIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CodeIcon,
  BarChart3Icon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import type { CaseStudy } from "@/types";
import { cn } from "@/lib/utils";

interface CaseStudySectionProps {
  caseStudy: CaseStudy;
  className?: string;
}

export function CaseStudySection({
  caseStudy,
  className,
}: CaseStudySectionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview"])
  );
  const [selectedCodeExample, setSelectedCodeExample] = useState(0);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

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

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-8", className)}
    >
      {/* Case Study Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Case Study
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A deep dive into the challenges, solutions, and outcomes of this
          project
        </p>
      </motion.div>

      {/* Overview Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <button
            onClick={() => toggleSection("overview")}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-card/30 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <TargetIcon className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold">Project Overview</h3>
            </div>
            {expandedSections.has("overview") ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has("overview") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-6">
                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-400 flex items-center gap-2">
                        <AlertCircleIcon className="w-4 h-4" />
                        The Problem
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {caseStudy.overview.problem}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" />
                        The Solution
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {caseStudy.overview.solution}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <ClockIcon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <div className="font-semibold">
                        {caseStudy.overview.timeline}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Timeline
                      </div>
                    </div>

                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <UsersIcon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      <div className="font-semibold">
                        {caseStudy.overview.teamSize || 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Team Size
                      </div>
                    </div>

                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <TargetIcon className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <div className="font-semibold">
                        {caseStudy.overview.role}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        My Role
                      </div>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  {caseStudy.overview.impact.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUpIcon className="w-4 h-4 text-primary-500" />
                        Key Impact
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {caseStudy.overview.impact.map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20"
                          >
                            <div className="text-2xl font-bold text-primary-400">
                              {metric.value}
                              {metric.unit && (
                                <span className="text-sm ml-1">
                                  {metric.unit}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {metric.label}
                            </div>
                            {metric.change && (
                              <div
                                className={cn(
                                  "text-xs flex items-center gap-1 mt-1",
                                  {
                                    "text-green-400": metric.trend === "up",
                                    "text-red-400": metric.trend === "down",
                                    "text-muted-foreground":
                                      metric.trend === "stable",
                                  }
                                )}
                              >
                                {metric.trend === "up" && "↗"}
                                {metric.trend === "down" && "↘"}
                                {metric.trend === "stable" && "→"}
                                {Math.abs(metric.change)}% change
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Technical Details Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <button
            onClick={() => toggleSection("technical")}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-card/30 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <CodeIcon className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold">
                Technical Implementation
              </h3>
            </div>
            {expandedSections.has("technical") ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has("technical") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-8">
                  {/* Architecture */}
                  {caseStudy.technicalDetails.architecture && (
                    <div>
                      <h4 className="font-semibold mb-4">
                        System Architecture
                      </h4>
                      <Card className="p-4 bg-muted/30">
                        <h5 className="font-medium mb-2">
                          {caseStudy.technicalDetails.architecture.title}
                        </h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          {caseStudy.technicalDetails.architecture.description}
                        </p>
                        {caseStudy.technicalDetails.architecture.components
                          .length > 0 && (
                          <div className="space-y-3">
                            <h6 className="text-sm font-medium">
                              Key Components:
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {caseStudy.technicalDetails.architecture.components.map(
                                (component, index) => (
                                  <div
                                    key={index}
                                    className="p-3 bg-card/50 rounded-md"
                                  >
                                    <div className="font-medium text-sm">
                                      {component.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {component.type}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {component.description}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {component.technologies.map((tech) => (
                                        <Badge
                                          key={tech}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {tech}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* Code Examples */}
                  {caseStudy.technicalDetails.codeExamples.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">Code Examples</h4>

                      {/* Code Example Tabs */}
                      {caseStudy.technicalDetails.codeExamples.length > 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {caseStudy.technicalDetails.codeExamples.map(
                            (example, index) => (
                              <Button
                                key={index}
                                variant={
                                  selectedCodeExample === index
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedCodeExample(index)}
                                className="text-xs"
                              >
                                {example.title}
                              </Button>
                            )
                          )}
                        </div>
                      )}

                      {/* Selected Code Example */}
                      <Card className="p-6 bg-muted/30">
                        <div className="mb-4">
                          <h5 className="font-medium">
                            {
                              caseStudy.technicalDetails.codeExamples[
                                selectedCodeExample
                              ].title
                            }
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {
                              caseStudy.technicalDetails.codeExamples[
                                selectedCodeExample
                              ].description
                            }
                          </p>
                        </div>

                        <CodeBlock
                          language={
                            caseStudy.technicalDetails.codeExamples[
                              selectedCodeExample
                            ].language
                          }
                          code={
                            caseStudy.technicalDetails.codeExamples[
                              selectedCodeExample
                            ].code
                          }
                          highlights={
                            caseStudy.technicalDetails.codeExamples[
                              selectedCodeExample
                            ].highlights
                          }
                        />

                        {caseStudy.technicalDetails.codeExamples[
                          selectedCodeExample
                        ].explanation && (
                          <div className="mt-4 p-4 bg-card/50 rounded-md">
                            <p className="text-sm text-muted-foreground">
                              {
                                caseStudy.technicalDetails.codeExamples[
                                  selectedCodeExample
                                ].explanation
                              }
                            </p>
                          </div>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* Challenges & Solutions */}
                  {caseStudy.technicalDetails.challenges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">
                        Challenges & Solutions
                      </h4>
                      <div className="space-y-4">
                        {caseStudy.technicalDetails.challenges.map(
                          (challenge, index) => (
                            <Card key={index} className="p-4 bg-muted/30">
                              <h5 className="font-medium mb-2 text-orange-400">
                                {challenge.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mb-3">
                                {challenge.description}
                              </p>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium text-green-400">
                                    Solution:{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {challenge.solution}
                                  </span>
                                </div>
                                {challenge.impact && (
                                  <div>
                                    <span className="text-sm font-medium text-blue-400">
                                      Impact:{" "}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {challenge.impact}
                                    </span>
                                  </div>
                                )}
                                {challenge.learnings &&
                                  challenge.learnings.length > 0 && (
                                    <div>
                                      <span className="text-sm font-medium text-purple-400">
                                        Learnings:{" "}
                                      </span>
                                      <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                                        {challenge.learnings.map(
                                          (learning, idx) => (
                                            <li key={idx}>{learning}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Technical Decisions */}
                  {caseStudy.technicalDetails.decisions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">
                        Key Technical Decisions
                      </h4>
                      <div className="space-y-4">
                        {caseStudy.technicalDetails.decisions.map(
                          (decision, index) => (
                            <Card key={index} className="p-4 bg-muted/30">
                              <h5 className="font-medium mb-2">
                                {decision.decision}
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-sm font-medium">
                                    Reasoning:{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {decision.reasoning}
                                  </span>
                                </div>

                                {decision.alternatives.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium">
                                      Alternatives Considered:{" "}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {decision.alternatives.map((alt, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {alt}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {decision.tradeoffs.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium">
                                      Trade-offs:{" "}
                                    </span>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                                      {decision.tradeoffs.map(
                                        (tradeoff, idx) => (
                                          <li key={idx}>{tradeoff}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {decision.outcome && (
                                  <div>
                                    <span className="text-sm font-medium text-green-400">
                                      Outcome:{" "}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {decision.outcome}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Results Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <button
            onClick={() => toggleSection("results")}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-card/30 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <BarChart3Icon className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold">Results & Impact</h3>
            </div>
            {expandedSections.has("results") ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has("results") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-8">
                  {/* Before/After Comparison */}
                  <div>
                    <h4 className="font-semibold mb-4">Before vs After</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-4 bg-red-500/10 border-red-500/20">
                        <h5 className="font-medium text-red-400 mb-2">
                          Before
                        </h5>
                        <div className="text-2xl font-bold mb-1">
                          {caseStudy.results.beforeAfter.before.value}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {caseStudy.results.beforeAfter.before.label}
                        </div>
                        {caseStudy.results.beforeAfter.before.description && (
                          <p className="text-xs text-muted-foreground">
                            {caseStudy.results.beforeAfter.before.description}
                          </p>
                        )}
                      </Card>

                      <Card className="p-4 bg-green-500/10 border-green-500/20">
                        <h5 className="font-medium text-green-400 mb-2">
                          After
                        </h5>
                        <div className="text-2xl font-bold mb-1">
                          {caseStudy.results.beforeAfter.after.value}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {caseStudy.results.beforeAfter.after.label}
                        </div>
                        {caseStudy.results.beforeAfter.after.description && (
                          <p className="text-xs text-muted-foreground">
                            {caseStudy.results.beforeAfter.after.description}
                          </p>
                        )}
                      </Card>
                    </div>

                    <div className="text-center mt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
                        <TrendingUpIcon className="w-4 h-4 text-primary-400" />
                        <span className="font-medium text-primary-400">
                          {caseStudy.results.beforeAfter.improvement.percentage}
                          % improvement
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {caseStudy.results.beforeAfter.improvement.description}
                      </p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  {caseStudy.results.metrics.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">
                        Performance Metrics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {caseStudy.results.metrics.map((metric, index) => (
                          <Card
                            key={index}
                            className={cn("p-4", {
                              "bg-green-500/10 border-green-500/20":
                                metric.status === "good",
                              "bg-yellow-500/10 border-yellow-500/20":
                                metric.status === "needs-improvement",
                              "bg-red-500/10 border-red-500/20":
                                metric.status === "poor",
                            })}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">
                                {metric.name}
                              </h5>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", {
                                  "border-green-500/30 text-green-400":
                                    metric.status === "good",
                                  "border-yellow-500/30 text-yellow-400":
                                    metric.status === "needs-improvement",
                                  "border-red-500/30 text-red-400":
                                    metric.status === "poor",
                                })}
                              >
                                {metric.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <div className="text-xl font-bold mb-1">
                              {metric.value} {metric.unit}
                            </div>
                            {metric.target && (
                              <div className="text-xs text-muted-foreground">
                                Target: {metric.target} {metric.unit}
                              </div>
                            )}
                            {metric.description && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {metric.description}
                              </p>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lessons Learned */}
                  {caseStudy.results.lessonsLearned.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BookOpenIcon className="w-4 h-4 text-primary-500" />
                        Lessons Learned
                      </h4>
                      <div className="space-y-3">
                        {caseStudy.results.lessonsLearned.map(
                          (lesson, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-muted/30 rounded-md"
                            >
                              <LightbulbIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">
                                {lesson}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Future Improvements */}
                  {caseStudy.results.futureImprovements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <ArrowRightIcon className="w-4 h-4 text-primary-500" />
                        Future Improvements
                      </h4>
                      <div className="space-y-2">
                        {caseStudy.results.futureImprovements.map(
                          (improvement, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-primary-500/5 border border-primary-500/10 rounded-md"
                            >
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">
                                {improvement}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}
