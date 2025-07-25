"use client";

import { motion } from "framer-motion";
import { ResumeFormat, ResumeView } from "./ResumeContainer";
import { ResumeSection } from "./ResumeSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { AchievementsSection } from "./sections/AchievementsSection";

interface ResumeContentProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function ResumeContent({ format, view }: ResumeContentProps) {
  const getSectionOrder = () => {
    switch (format) {
      case "creative":
        return [
          {
            component: SkillsSection,
            title: "Core Competencies",
            key: "skills",
          },
          {
            component: ExperienceSection,
            title: "Professional Experience",
            key: "experience",
          },
          {
            component: ProjectsSection,
            title: "Featured Projects",
            key: "projects",
          },
          {
            component: AchievementsSection,
            title: "Key Achievements",
            key: "achievements",
          },
          { component: EducationSection, title: "Education", key: "education" },
          {
            component: CertificationsSection,
            title: "Certifications",
            key: "certifications",
          },
        ];
      case "minimal":
        return [
          {
            component: ExperienceSection,
            title: "Experience",
            key: "experience",
          },
          { component: EducationSection, title: "Education", key: "education" },
          { component: SkillsSection, title: "Skills", key: "skills" },
          {
            component: CertificationsSection,
            title: "Certifications",
            key: "certifications",
          },
        ];
      default: // standard
        return [
          {
            component: ExperienceSection,
            title: "Professional Experience",
            key: "experience",
          },
          {
            component: SkillsSection,
            title: "Technical Skills",
            key: "skills",
          },
          {
            component: ProjectsSection,
            title: "Notable Projects",
            key: "projects",
          },
          { component: EducationSection, title: "Education", key: "education" },
          {
            component: CertificationsSection,
            title: "Certifications & Awards",
            key: "certifications",
          },
          {
            component: AchievementsSection,
            title: "Professional Achievements",
            key: "achievements",
          },
        ];
    }
  };

  const sections = getSectionOrder();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        resume-content
        ${format === "creative" ? "creative-layout" : ""}
        ${format === "minimal" ? "minimal-layout" : ""}
        ${view === "print" ? "print-layout" : ""}
        ${view === "presentation" ? "presentation-layout" : ""}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {format === "creative" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Skills and Certifications */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div variants={sectionVariants}>
                <SkillsSection format={format} view={view} />
              </motion.div>
              <motion.div variants={sectionVariants}>
                <CertificationsSection format={format} view={view} />
              </motion.div>
              <motion.div variants={sectionVariants}>
                <AchievementsSection format={format} view={view} />
              </motion.div>
            </div>

            {/* Right Column - Experience, Projects, Education */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={sectionVariants}>
                <ExperienceSection format={format} view={view} />
              </motion.div>
              <motion.div variants={sectionVariants}>
                <ProjectsSection format={format} view={view} />
              </motion.div>
              <motion.div variants={sectionVariants}>
                <EducationSection format={format} view={view} />
              </motion.div>
            </div>
          </div>
        )}

        {format === "minimal" && (
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => {
              const SectionComponent = section.component;
              return (
                <motion.div key={section.key} variants={sectionVariants}>
                  <SectionComponent format={format} view={view} />
                </motion.div>
              );
            })}
          </div>
        )}

        {format === "standard" && (
          <div className="space-y-12">
            {sections.map((section, index) => {
              const SectionComponent = section.component;
              return (
                <motion.div key={section.key} variants={sectionVariants}>
                  <ResumeSection title={section.title} format={format}>
                    <SectionComponent format={format} view={view} />
                  </ResumeSection>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.main>
  );
}
