"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  StarIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  LinkedinIcon,
  AwardIcon,
  TrendingUpIcon,
  BookOpenIcon,
  TargetIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import { skills, skillCategories } from "@/data/skills";
import { experience } from "@/data/experience";
import type { Skill, SkillCategory, Endorsement, Certification } from "@/types";

interface CompetencyMatrixProps {
  className?: string;
  showEndorsements?: boolean;
  showCertifications?: boolean;
  showLearningGoals?: boolean;
  interactive?: boolean;
}

interface SkillMatrixItem extends Skill {
  categoryColor: string;
  projectCount: number;
  endorsementCount: number;
  certificationCount: number;
  verified: boolean;
}

interface LearningGoal {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  deadline: Date;
  progress: number;
  resources: string[];
}

// Mock learning goals data (in a real app, this would come from a data source)
const learningGoals: LearningGoal[] = [
  {
    skill: "Rust",
    currentLevel: 5,
    targetLevel: 8,
    deadline: new Date("2024-12-31"),
    progress: 60,
    resources: [
      "The Rust Programming Language",
      "Rust by Example",
      "Rustlings",
    ],
  },
  {
    skill: "Kubernetes",
    currentLevel: 6,
    targetLevel: 9,
    deadline: new Date("2024-10-31"),
    progress: 75,
    resources: ["Kubernetes in Action", "CKA Certification Course"],
  },
  {
    skill: "Machine Learning",
    currentLevel: 4,
    targetLevel: 7,
    deadline: new Date("2025-06-30"),
    progress: 30,
    resources: ["Hands-On Machine Learning", "Fast.ai Course"],
  },
];

export function CompetencyMatrix({
  className = "",
  showEndorsements = true,
  showCertifications = true,
  showLearningGoals = true,
  interactive = true,
}: CompetencyMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<SkillMatrixItem | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "skills" | "endorsements" | "goals"
  >("skills");

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Process skills data for the matrix
  const matrixData: SkillMatrixItem[] = useMemo(() => {
    return skills.map((skill) => {
      const category = skillCategories.find((cat) =>
        cat.skills.some((s) => s.name === skill.name)
      );

      return {
        ...skill,
        categoryColor: category?.color || "#6B7280",
        projectCount: skill.projects.length,
        endorsementCount: skill.endorsements?.length || 0,
        certificationCount: skill.certifications?.length || 0,
        verified:
          (skill.certifications?.length || 0) > 0 ||
          (skill.endorsements?.length || 0) > 0,
      };
    });
  }, []);

  // Filter skills based on category and search
  const filteredSkills = useMemo(() => {
    return matrixData.filter((skill) => {
      const matchesCategory =
        selectedCategory === "all" || skill.category === selectedCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [matrixData, selectedCategory, searchTerm]);

  // Get all endorsements from experience and skills
  const allEndorsements = useMemo(() => {
    const skillEndorsements = skills.flatMap(
      (skill) => skill.endorsements || []
    );
    return skillEndorsements;
  }, []);

  const getSkillLevelColor = (level: number) => {
    if (level >= 9) return "text-green-500 bg-green-500/10";
    if (level >= 7) return "text-blue-500 bg-blue-500/10";
    if (level >= 5) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 9) return "Expert";
    if (level >= 7) return "Advanced";
    if (level >= 5) return "Intermediate";
    return "Beginner";
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {[
                { id: "skills", label: "Skills Matrix", icon: TargetIcon },
                { id: "endorsements", label: "Endorsements", icon: StarIcon },
                { id: "goals", label: "Learning Goals", icon: TrendingUpIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters for Skills Tab */}
          {activeTab === "skills" && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                >
                  <option value="all">All Categories</option>
                  {skillCategories.map((category) => (
                    <option
                      key={category.name}
                      value={category.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "-")}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-md">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SkillsMatrix
                skills={filteredSkills}
                onSkillClick={interactive ? setSelectedSkill : undefined}
              />
            </motion.div>
          )}

          {activeTab === "endorsements" && showEndorsements && (
            <motion.div
              key="endorsements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <EndorsementsSection endorsements={allEndorsements} />
            </motion.div>
          )}

          {activeTab === "goals" && showLearningGoals && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LearningGoalsSection goals={learningGoals} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <SkillDetailModal
                  skill={selectedSkill}
                  onClose={() => setSelectedSkill(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SkillsMatrix({
  skills,
  onSkillClick,
}: {
  skills: SkillMatrixItem[];
  onSkillClick?: (skill: SkillMatrixItem) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={`p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all ${
            onSkillClick ? "cursor-pointer hover:border-primary/50" : ""
          }`}
          onClick={() => onSkillClick?.(skill)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {skill.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getSkillLevelColor(
                    skill.level
                  )}`}
                >
                  {getSkillLevelLabel(skill.level)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {skill.level}/10
                </span>
              </div>
            </div>
            {skill.verified && (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-medium text-foreground">
                {skill.yearsExperience} year
                {skill.yearsExperience !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Projects</span>
              <span className="font-medium text-foreground">
                {skill.projectCount}
              </span>
            </div>

            {skill.endorsementCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Endorsements</span>
                <span className="font-medium text-foreground">
                  {skill.endorsementCount}
                </span>
              </div>
            )}

            {skill.certificationCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Certifications</span>
                <span className="font-medium text-foreground">
                  {skill.certificationCount}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${skill.level * 10}%`,
                  backgroundColor: skill.categoryColor,
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EndorsementsSection({
  endorsements,
}: {
  endorsements: Endorsement[];
}) {
  return (
    <div className="space-y-6">
      {endorsements.length === 0 ? (
        <div className="text-center py-12">
          <StarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No endorsements available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {endorsements.map((endorsement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {endorsement.endorser.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {endorsement.endorser}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {endorsement.position} at {endorsement.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {endorsement.relationship} •{" "}
                    {endorsement.date.toLocaleDateString()}
                  </p>
                </div>
                {endorsement.linkedinUrl && (
                  <a
                    href={endorsement.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
              </div>

              <blockquote className="text-muted-foreground italic">
                "{endorsement.content}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function LearningGoalsSection({ goals }: { goals: LearningGoal[] }) {
  return (
    <div className="space-y-6">
      {goals.map((goal, index) => (
        <motion.div
          key={goal.skill}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 bg-card border border-border rounded-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {goal.skill}
              </h4>
              <p className="text-sm text-muted-foreground">
                Target: Level {goal.targetLevel} by{" "}
                {goal.deadline.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {goal.progress}%
              </div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Current: Level {goal.currentLevel}</span>
              <span>Target: Level {goal.targetLevel}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="h-3 bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              Learning Resources
            </h5>
            <div className="flex flex-wrap gap-2">
              {goal.resources.map((resource, resourceIndex) => (
                <span
                  key={resourceIndex}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                >
                  {resource}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SkillDetailModal({
  skill,
  onClose,
}: {
  skill: SkillMatrixItem;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {skill.name}
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-sm rounded-full ${getSkillLevelColor(
                skill.level
              )}`}
            >
              {getSkillLevelLabel(skill.level)} - Level {skill.level}/10
            </span>
            {skill.verified && (
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm">Verified</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      {skill.description && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-muted-foreground">{skill.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Experience</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Years of Experience</span>
              <span className="font-medium">{skill.yearsExperience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projects Used</span>
              <span className="font-medium">{skill.projectCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proficiency Level</span>
              <span className="font-medium">{skill.level}/10</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Verification</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Endorsements</span>
              <span className="font-medium">{skill.endorsementCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certifications</span>
              <span className="font-medium">{skill.certificationCount}</span>
            </div>
          </div>
        </div>
      </div>

      {skill.keywords && skill.keywords.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">
            Related Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {skill.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {skill.certifications && skill.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AwardIcon className="w-4 h-4" />
            Certifications
          </h3>
          <div className="space-y-3">
            {skill.certifications.map((cert, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} • {cert.date.toLocaleDateString()}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skill.endorsements && skill.endorsements.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <StarIcon className="w-4 h-4" />
            Endorsements
          </h3>
          <div className="space-y-3">
            {skill.endorsements.map((endorsement, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {endorsement.endorser}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {endorsement.position} at {endorsement.company}
                    </p>
                  </div>
                  {endorsement.linkedinUrl && (
                    <a
                      href={endorsement.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <blockquote className="text-sm text-muted-foreground italic">
                  "{endorsement.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getSkillLevelColor(level: number) {
  if (level >= 9) return "text-green-500 bg-green-500/10";
  if (level >= 7) return "text-blue-500 bg-blue-500/10";
  if (level >= 5) return "text-yellow-500 bg-yellow-500/10";
  return "text-red-500 bg-red-500/10";
}

function getSkillLevelLabel(level: number) {
  if (level >= 9) return "Expert";
  if (level >= 7) return "Advanced";
  if (level >= 5) return "Intermediate";
  return "Beginner";
}
