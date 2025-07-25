import type { Project, Skill, Experience, Testimonial } from "@/types";
import { projects, skills, experience, testimonials } from "./index";

// Data utility functions for common operations
export class DataUtils {
  // Project utilities
  static getProjectById(id: string): Project | undefined {
    return projects.find((project) => project.id === id);
  }

  static getFeaturedProjects(): Project[] {
    return projects.filter((project) => project.featured);
  }

  static getProjectsByTechnology(techName: string): Project[] {
    return projects.filter((project) =>
      project.technologies.some((tech) => tech.name === techName)
    );
  }

  static getProjectsByComplexity(complexity: Project["complexity"]): Project[] {
    return projects.filter((project) => project.complexity === complexity);
  }

  static getProjectsByStatus(status: Project["status"]): Project[] {
    return projects.filter((project) => project.status === status);
  }

  static getRecentProjects(count: number = 5): Project[] {
    return projects
      .sort((a, b) => {
        const aDate = a.endDate || a.startDate;
        const bDate = b.endDate || b.startDate;
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, count);
  }

  // Skill utilities
  static getSkillByName(name: string): Skill | undefined {
    return skills.find((skill) => skill.name === name);
  }

  static getSkillsByCategory(category: string): Skill[] {
    return skills.filter((skill) => skill.category === category);
  }

  static getExpertSkills(): Skill[] {
    return skills.filter((skill) => skill.level >= 9);
  }

  static getSkillsByProficiency(minLevel: number): Skill[] {
    return skills.filter((skill) => skill.level >= minLevel);
  }

  static getCertifiedSkills(): Skill[] {
    return skills.filter(
      (skill) => skill.certifications && skill.certifications.length > 0
    );
  }

  static getEndorsedSkills(): Skill[] {
    return skills.filter(
      (skill) => skill.endorsements && skill.endorsements.length > 0
    );
  }

  // Experience utilities
  static getCurrentPosition(): Experience | undefined {
    return experience.find((exp) => exp.current);
  }

  static getExperienceByCompany(company: string): Experience[] {
    return experience.filter((exp) => exp.company === company);
  }

  static getExperienceByType(type: Experience["type"]): Experience[] {
    return experience.filter((exp) => exp.type === type);
  }

  static getTotalExperienceYears(): number {
    const sortedExp = experience.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
    if (sortedExp.length === 0) return 0;

    const firstJob = sortedExp[0];
    const currentDate = new Date();
    const totalMs = currentDate.getTime() - firstJob.startDate.getTime();
    return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  static getExperienceWithAchievements(): Experience[] {
    return experience.filter(
      (exp) => exp.achievements && exp.achievements.length > 0
    );
  }

  // Testimonial utilities
  static getTestimonialById(id: string): Testimonial | undefined {
    return testimonials.find((testimonial) => testimonial.id === id);
  }

  static getVerifiedTestimonials(): Testimonial[] {
    return testimonials.filter((testimonial) => testimonial.verified);
  }

  static getTestimonialsByProject(projectId: string): Testimonial[] {
    return testimonials.filter(
      (testimonial) => testimonial.projectId === projectId
    );
  }

  static getTestimonialsByRating(minRating: number): Testimonial[] {
    return testimonials.filter(
      (testimonial) => testimonial.rating >= minRating
    );
  }

  static getRecentTestimonials(count: number = 5): Testimonial[] {
    return testimonials
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, count);
  }

  static getTestimonialsByCompany(company: string): Testimonial[] {
    return testimonials.filter(
      (testimonial) => testimonial.company === company
    );
  }

  // Cross-data utilities
  static getSkillsUsedInProject(projectId: string): Skill[] {
    const project = this.getProjectById(projectId);
    if (!project) return [];

    const projectTechNames = project.technologies.map((tech) => tech.name);
    return skills.filter((skill) => projectTechNames.includes(skill.name));
  }

  static getProjectsUsingSkill(skillName: string): Project[] {
    const skill = this.getSkillByName(skillName);
    if (!skill) return [];

    return projects.filter((project) => skill.projects.includes(project.id));
  }

  static getTestimonialsForSkill(skillName: string): Testimonial[] {
    const projectsUsingSkill = this.getProjectsUsingSkill(skillName);
    const projectIds = projectsUsingSkill.map((p) => p.id);

    return testimonials.filter(
      (testimonial) =>
        testimonial.projectId && projectIds.includes(testimonial.projectId)
    );
  }

  // Search utilities
  static searchProjects(query: string): Project[] {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(lowercaseQuery) ||
        project.description.toLowerCase().includes(lowercaseQuery) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(lowercaseQuery)
        ) ||
        project.technologies.some((tech) =>
          tech.name.toLowerCase().includes(lowercaseQuery)
        )
    );
  }

  static searchSkills(query: string): Skill[] {
    const lowercaseQuery = query.toLowerCase();
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(lowercaseQuery) ||
        (skill.description &&
          skill.description.toLowerCase().includes(lowercaseQuery)) ||
        (skill.keywords &&
          skill.keywords.some((keyword) =>
            keyword.toLowerCase().includes(lowercaseQuery)
          ))
    );
  }

  // Statistics utilities
  static getProjectStatistics() {
    return {
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      completed: projects.filter((p) => p.status === "completed").length,
      inProgress: projects.filter((p) => p.status === "in-progress").length,
      averageStars:
        projects.reduce((acc, p) => acc + p.metrics.githubStars, 0) /
        projects.length,
      averagePerformance:
        projects.reduce((acc, p) => acc + p.metrics.performanceScore, 0) /
        projects.length,
      totalCommits: projects.reduce((acc, p) => acc + p.metrics.commits, 0),
      totalLinesOfCode: projects.reduce(
        (acc, p) => acc + p.metrics.linesOfCode,
        0
      ),
    };
  }

  static getSkillStatistics() {
    return {
      total: skills.length,
      expert: skills.filter((s) => s.level >= 9).length,
      advanced: skills.filter((s) => s.level >= 7).length,
      certified: skills.filter(
        (s) => s.certifications && s.certifications.length > 0
      ).length,
      endorsed: skills.filter(
        (s) => s.endorsements && s.endorsements.length > 0
      ).length,
      averageLevel: skills.reduce((acc, s) => acc + s.level, 0) / skills.length,
      averageExperience:
        skills.reduce((acc, s) => acc + s.yearsExperience, 0) / skills.length,
    };
  }

  static getTestimonialStatistics() {
    return {
      total: testimonials.length,
      verified: testimonials.filter((t) => t.verified).length,
      averageRating:
        testimonials.reduce((acc, t) => acc + t.rating, 0) /
        testimonials.length,
      fiveStars: testimonials.filter((t) => t.rating === 5).length,
      withProjects: testimonials.filter((t) => t.projectId).length,
      uniqueCompanies: new Set(testimonials.map((t) => t.company)).size,
    };
  }

  // Validation utilities
  static validateDataIntegrity(): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check for missing project references in skills
    skills.forEach((skill) => {
      skill.projects.forEach((projectId) => {
        if (!projects.find((p) => p.id === projectId)) {
          issues.push(
            `Skill "${skill.name}" references non-existent project "${projectId}"`
          );
        }
      });
    });

    // Check for missing project references in testimonials
    testimonials.forEach((testimonial) => {
      if (
        testimonial.projectId &&
        !projects.find((p) => p.id === testimonial.projectId)
      ) {
        issues.push(
          `Testimonial "${testimonial.id}" references non-existent project "${testimonial.projectId}"`
        );
      }
    });

    // Check for duplicate IDs
    const projectIds = projects.map((p) => p.id);
    const duplicateProjectIds = projectIds.filter(
      (id, index) => projectIds.indexOf(id) !== index
    );
    if (duplicateProjectIds.length > 0) {
      issues.push(`Duplicate project IDs: ${duplicateProjectIds.join(", ")}`);
    }

    const testimonialIds = testimonials.map((t) => t.id);
    const duplicateTestimonialIds = testimonialIds.filter(
      (id, index) => testimonialIds.indexOf(id) !== index
    );
    if (duplicateTestimonialIds.length > 0) {
      issues.push(
        `Duplicate testimonial IDs: ${duplicateTestimonialIds.join(", ")}`
      );
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

// Export utility functions for easy access
export const {
  getProjectById,
  getFeaturedProjects,
  getProjectsByTechnology,
  getProjectsByComplexity,
  getRecentProjects,
  getSkillByName,
  getSkillsByCategory,
  getExpertSkills,
  getCurrentPosition,
  getVerifiedTestimonials,
  getTestimonialsByProject,
  searchProjects,
  searchSkills,
  getProjectStatistics,
  getSkillStatistics,
  getTestimonialStatistics,
  validateDataIntegrity,
} = DataUtils;
