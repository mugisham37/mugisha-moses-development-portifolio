import type { Project, Skill, Experience, Testimonial } from "@/types";
import {
  projects,
  skills,
  experience,
  testimonials,
} from "./index";

// Data validation utilities
export class DataValidator {
  static validateProjects(projectsData: Project[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    projectsData.forEach((project, index) => {
      // Required fields validation
      if (!project.id) errors.push(`Project ${index}: Missing ID`);
      if (!project.title) errors.push(`Project ${index}: Missing title`);
      if (!project.description)
        errors.push(`Project ${index}: Missing description`);
      if (!project.githubUrl)
        errors.push(`Project ${index}: Missing GitHub URL`);

      // Date validation
      if (!project.startDate)
        errors.push(`Project ${index}: Missing start date`);
      if (
        project.endDate &&
        project.startDate &&
        project.endDate < project.startDate
      ) {
        errors.push(`Project ${index}: End date before start date`);
      }

      // Metrics validation
      if (project.metrics) {
        if (
          project.metrics.performanceScore < 0 ||
          project.metrics.performanceScore > 100
        ) {
          warnings.push(
            `Project ${index}: Performance score out of range (0-100)`
          );
        }
        if (
          project.metrics.accessibilityScore < 0 ||
          project.metrics.accessibilityScore > 100
        ) {
          warnings.push(
            `Project ${index}: Accessibility score out of range (0-100)`
          );
        }
        if (
          project.metrics.testCoverage < 0 ||
          project.metrics.testCoverage > 100
        ) {
          warnings.push(`Project ${index}: Test coverage out of range (0-100)`);
        }
      }

      // Technology validation
      if (!project.technologies || project.technologies.length === 0) {
        warnings.push(`Project ${index}: No technologies specified`);
      }

      // Image validation
      if (!project.images || project.images.length === 0) {
        warnings.push(`Project ${index}: No images specified`);
      }
    });

    return { errors, warnings, valid: errors.length === 0 };
  }

  static validateSkills(skillsData: Skill[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    skillsData.forEach((skill, index) => {
      // Required fields validation
      if (!skill.name) errors.push(`Skill ${index}: Missing name`);
      if (!skill.category) errors.push(`Skill ${index}: Missing category`);

      // Level validation
      if (skill.level < 1 || skill.level > 10) {
        errors.push(`Skill ${index}: Level must be between 1-10`);
      }

      // Years experience validation
      if (skill.yearsExperience < 0) {
        errors.push(`Skill ${index}: Years experience cannot be negative`);
      }
      if (skill.yearsExperience > 20) {
        warnings.push(
          `Skill ${index}: Years experience seems high (${skill.yearsExperience})`
        );
      }

      // Projects validation
      if (!skill.projects || skill.projects.length === 0) {
        warnings.push(`Skill ${index}: No associated projects`);
      }
    });

    return { errors, warnings, valid: errors.length === 0 };
  }

  static validateExperience(experienceData: Experience[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    experienceData.forEach((exp, index) => {
      // Required fields validation
      if (!exp.company) errors.push(`Experience ${index}: Missing company`);
      if (!exp.position) errors.push(`Experience ${index}: Missing position`);
      if (!exp.startDate)
        errors.push(`Experience ${index}: Missing start date`);

      // Date validation
      if (exp.endDate && exp.startDate && exp.endDate < exp.startDate) {
        errors.push(`Experience ${index}: End date before start date`);
      }

      // Current position validation
      if (exp.current && exp.endDate) {
        warnings.push(
          `Experience ${index}: Marked as current but has end date`
        );
      }
      if (!exp.current && !exp.endDate) {
        warnings.push(`Experience ${index}: Not current but missing end date`);
      }

      // Responsibilities validation
      if (!exp.responsibilities || exp.responsibilities.length === 0) {
        warnings.push(`Experience ${index}: No responsibilities listed`);
      }

      // Technologies validation
      if (!exp.technologies || exp.technologies.length === 0) {
        warnings.push(`Experience ${index}: No technologies listed`);
      }
    });

    return { errors, warnings, valid: errors.length === 0 };
  }

  static validateTestimonials(
    testimonialsData: Testimonial[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    testimonialsData.forEach((testimonial, index) => {
      // Required fields validation
      if (!testimonial.name) errors.push(`Testimonial ${index}: Missing name`);
      if (!testimonial.content)
        errors.push(`Testimonial ${index}: Missing content`);
      if (!testimonial.position)
        errors.push(`Testimonial ${index}: Missing position`);
      if (!testimonial.company)
        errors.push(`Testimonial ${index}: Missing company`);

      // Rating validation
      if (testimonial.rating < 1 || testimonial.rating > 5) {
        errors.push(`Testimonial ${index}: Rating must be between 1-5`);
      }

      // Date validation
      if (!testimonial.date) errors.push(`Testimonial ${index}: Missing date`);

      // Content length validation
      if (testimonial.content && testimonial.content.length < 50) {
        warnings.push(`Testimonial ${index}: Content seems too short`);
      }
      if (testimonial.content && testimonial.content.length > 500) {
        warnings.push(`Testimonial ${index}: Content seems too long`);
      }
    });

    return { errors, warnings, valid: errors.length === 0 };
  }

  static validateAllData(): DataValidationReport {
    const projectValidation = this.validateProjects(projects);
    const skillValidation = this.validateSkills(skills);
    const experienceValidation = this.validateExperience(experience);
    const testimonialValidation = this.validateTestimonials(testimonials);

    const allErrors = [
      ...projectValidation.errors,
      ...skillValidation.errors,
      ...experienceValidation.errors,
      ...testimonialValidation.errors,
    ];

    const allWarnings = [
      ...projectValidation.warnings,
      ...skillValidation.warnings,
      ...experienceValidation.warnings,
      ...testimonialValidation.warnings,
    ];

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      summary: {
        totalProjects: projects.length,
        totalSkills: skills.length,
        totalExperience: experience.length,
        totalTestimonials: testimonials.length,
        totalErrors: allErrors.length,
        totalWarnings: allWarnings.length,
      },
      details: {
        projects: projectValidation,
        skills: skillValidation,
        experience: experienceValidation,
        testimonials: testimonialValidation,
      },
    };
  }

  // Data consistency checks
  static checkDataConsistency(): ConsistencyReport {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check if all project technologies exist in skills
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        const skillExists = skills.some((skill) => skill.name === tech.name);
        if (!skillExists) {
          issues.push(
            `Technology "${tech.name}" in project "${project.title}" not found in skills`
          );
        }
      });
    });

    // Check if all skill projects exist
    skills.forEach((skill) => {
      skill.projects.forEach((projectId) => {
        const projectExists = projects.some(
          (project) => project.id === projectId
        );
        if (!projectExists) {
          issues.push(
            `Project "${projectId}" referenced in skill "${skill.name}" not found`
          );
        }
      });
    });

    // Check testimonial project references
    testimonials.forEach((testimonial) => {
      if (testimonial.projectId) {
        const projectExists = projects.some(
          (project) => project.id === testimonial.projectId
        );
        if (!projectExists) {
          issues.push(
            `Project "${testimonial.projectId}" referenced in testimonial not found`
          );
        }
      }
    });

    // Check for duplicate IDs
    const projectIds = projects.map((p) => p.id);
    const duplicateProjectIds = projectIds.filter(
      (id, index) => projectIds.indexOf(id) !== index
    );
    if (duplicateProjectIds.length > 0) {
      issues.push(
        `Duplicate project IDs found: ${duplicateProjectIds.join(", ")}`
      );
    }

    const testimonialIds = testimonials.map((t) => t.id);
    const duplicateTestimonialIds = testimonialIds.filter(
      (id, index) => testimonialIds.indexOf(id) !== index
    );
    if (duplicateTestimonialIds.length > 0) {
      issues.push(
        `Duplicate testimonial IDs found: ${duplicateTestimonialIds.join(", ")}`
      );
    }

    // Suggestions for data improvement
    if (projects.filter((p) => p.featured).length < 3) {
      suggestions.push("Consider featuring more projects to showcase variety");
    }

    if (skills.filter((s) => s.level >= 9).length < 5) {
      suggestions.push("Consider highlighting more expert-level skills");
    }

    if (
      testimonials.filter((t) => t.verified).length / testimonials.length <
      0.8
    ) {
      suggestions.push("Consider verifying more testimonials for credibility");
    }

    return {
      consistent: issues.length === 0,
      issues,
      suggestions,
      summary: {
        totalIssues: issues.length,
        totalSuggestions: suggestions.length,
      },
    };
  }
}

// Type definitions for validation results
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface DataValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalProjects: number;
    totalSkills: number;
    totalExperience: number;
    totalTestimonials: number;
    totalErrors: number;
    totalWarnings: number;
  };
  details: {
    projects: ValidationResult;
    skills: ValidationResult;
    experience: ValidationResult;
    testimonials: ValidationResult;
  };
}

interface ConsistencyReport {
  consistent: boolean;
  issues: string[];
  suggestions: string[];
  summary: {
    totalIssues: number;
    totalSuggestions: number;
  };
}

// Export validation functions for use in development
export const validateData = () => DataValidator.validateAllData();
export const checkConsistency = () => DataValidator.checkDataConsistency();

// Development helper to run validation
if (process.env.NODE_ENV === "development") {
  const validation = DataValidator.validateAllData();
  const consistency = DataValidator.checkDataConsistency();

  if (!validation.valid || !consistency.consistent) {
    console.warn("⚠️ Data validation issues found:");
    if (validation.errors.length > 0) {
      console.error("Errors:", validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn("Warnings:", validation.warnings);
    }
    if (consistency.issues.length > 0) {
      console.warn("Consistency Issues:", consistency.issues);
    }
  } else {
    console.log("✅ All data validation passed");
  }

  if (consistency.suggestions.length > 0) {
    console.info("💡 Suggestions:", consistency.suggestions);
  }
}
