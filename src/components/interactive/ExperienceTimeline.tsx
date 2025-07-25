"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  CalendarIcon,
  MapPinIcon,
  BuildingIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";
import { experience } from "@/data/experience";
import type { Experience, Achievement } from "@/types";

interface ExperienceTimelineProps {
  className?: string;
  showAchievements?: boolean;
  maxItems?: number;
  interactive?: boolean;
}

interface TimelineItemProps {
  experience: Experience;
  index: number;
  isLast: boolean;
  showAchievements: boolean;
  interactive: boolean;
}

export function ExperienceTimeline({
  className = "",
  showAchievements = true,
  maxItems,
  interactive = true,
}: ExperienceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const displayedExperience = maxItems
    ? experience.slice(0, maxItems)
    : experience;

  const toggleExpanded = (id: string) => {
    if (!interactive) return;

    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate: Date, endDate?: Date) => {
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
    }

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    if (months === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    }

    return `${years} year${years !== 1 ? "s" : ""} ${months} month${
      months !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      <div className="space-y-8">
        {displayedExperience.map((exp, index) => (
          <TimelineItem
            key={exp.id}
            experience={exp}
            index={index}
            isLast={index === displayedExperience.length - 1}
            showAchievements={showAchievements}
            interactive={interactive}
            isExpanded={expandedItems.has(exp.id)}
            onToggleExpanded={() => toggleExpanded(exp.id)}
            onAchievementClick={setSelectedAchievement}
          />
        ))}
      </div>

      {/* Achievement Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrophyIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {selectedAchievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedAchievement.date)}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.impact && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAchievement.impact}
                  </p>
                </div>
              )}

              {selectedAchievement.metrics &&
                selectedAchievement.metrics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">
                      Metrics
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedAchievement.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-muted/50 rounded"
                        >
                          <span className="text-sm text-muted-foreground">
                            {metric.label}
                          </span>
                          <span className="font-medium text-foreground">
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedAchievement.recognition && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {selectedAchievement.recognition}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({
  experience: exp,
  index,
  isLast,
  showAchievements,
  interactive,
  isExpanded,
  onToggleExpanded,
  onAchievementClick,
}: TimelineItemProps & {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onAchievementClick: (achievement: Achievement) => void;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative pl-20"
    >
      {/* Timeline Node */}
      <div className="absolute left-6 top-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10">
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
      </div>

      {/* Experience Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                {exp.position}
              </h3>
              {exp.current && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Current
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <BuildingIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{exp.company}</span>
              {exp.companyUrl && (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {formatDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{calculateDuration(exp.startDate, exp.endDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{exp.location}</span>
              </div>
            </div>
          </div>

          {interactive && (
            <button
              onClick={onToggleExpanded}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4">{exp.description}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {(isExpanded || !interactive) && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              {/* Responsibilities */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((responsibility, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {showAchievements &&
                exp.achievements &&
                exp.achievements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <TrophyIcon className="w-4 h-4 text-primary" />
                      Key Achievements
                    </h4>
                    <div className="space-y-3">
                      {exp.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => onAchievementClick(achievement)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-foreground">
                              {achievement.title}
                            </h5>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(achievement.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.metrics &&
                            achievement.metrics.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {achievement.metrics
                                  .slice(0, 2)
                                  .map((metric, metricIndex) => (
                                    <div
                                      key={metricIndex}
                                      className="flex items-center gap-1 text-xs"
                                    >
                                      <TrendingUpIcon className="w-3 h-3 text-green-500" />
                                      <span className="text-muted-foreground">
                                        {metric.label}:
                                      </span>
                                      <span className="font-medium text-foreground">
                                        {metric.value} {metric.unit}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function calculateDuration(startDate: Date, endDate?: Date) {
  const end = endDate || new Date();
  const diffTime = Math.abs(end.getTime() - startDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  }

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""} ${months} month${
    months !== 1 ? "s" : ""
  }`;
}
