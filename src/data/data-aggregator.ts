import type { Project, Skill, Experience, Testimonial } from "@/types";
import {
  projects,
  skills,
  experience,
  testimonials,
  personalInfo,
  socialLinks,
  achievements,
  careerTimeline,
  education,
  certifications,
  speakingEngagements,
  publications,
} from "./index";
import { allMetrics } from "./enhanced-metrics";

// Data aggregation utilities for enhanced analytics and insights
export class DataAggregator {
  // Project analytics
  static getProjectAnalytics() {
    const totalProjects = projects.length;
    const featuredProjects = projects.filter((p) => p.featured).length;
    const completedProjects = projects.filter(
      (p) => p.status === "completed"
    ).length;
    const averageProjectDuration = this.calculateAverageProjectDuration();
    const technologiesUsed = this.getUniqueTechnologies();
    const projectsByComplexity = this.groupProjectsByComplexity();
    const projectsByCategory = this.groupProjectsByCategory();

    return {
      total: totalProjects,
      featured: featuredProjects,
      completed: completedProjects,
      averageDuration: averageProjectDuration,
      technologiesCount: technologiesUsed.length,
      byComplexity: projectsByComplexity,
      byCategory: projectsByCategory,
      performanceMetrics: {
        averagePerformanceScore:
          this.calculateAverageMetric("performanceScore"),
        averageAccessibilityScore:
          this.calculateAverageMetric("accessibilityScore"),
        averageTestCoverage: this.calculateAverageMetric("testCoverage"),
      },
    };
  }

  // Skills analytics
  static getSkillsAnalytics() {
    const totalSkills = skills.length;
    const expertSkills = skills.filter((s) => s.level >= 9).length;
    const advancedSkills = skills.filter(
      (s) => s.level >= 7 && s.level < 9
    ).length;
    const skillsByCategory = this.groupSkillsByCategory();
    const averageExperience = this.calculateAverageSkillExperience();
    const mostUsedSkills = this.getMostUsedSkills();

    return {
      total: totalSkills,
      expert: expertSkills,
      advanced: advancedSkills,
      byCategory: skillsByCategory,
      averageExperience,
      mostUsed: mostUsedSkills,
      certifiedSkills: skills.filter(
        (s) => s.certifications && s.certifications.length > 0
      ).length,
      endorsedSkills: skills.filter(
        (s) => s.endorsements && s.endorsements.length > 0
      ).length,
    };
  }

  // Experience analytics
  static getExperienceAnalytics() {
    const totalPositions = experience.length;
    const totalYearsExperience = this.calculateTotalExperience();
    const currentPosition = experience.find((e) => e.current);
    const companiesWorkedWith = experience.map((e) => e.company);
    const positionsByType = this.groupExperienceByType();
    const achievementsCount = experience.reduce(
      (acc, exp) => acc + exp.achievements.length,
      0
    );

    return {
      totalPositions,
      totalYears: totalYearsExperience,
      currentPosition: currentPosition?.position || "Available",
      currentCompany: currentPosition?.company || "Freelance",
      companiesCount: new Set(companiesWorkedWith).size,
      byType: positionsByType,
      totalAchievements: achievementsCount,
      averageAchievementsPerRole: achievementsCount / totalPositions,
    };
  }

  // Testimonials analytics
  static getTestimonialsAnalytics() {
    const totalTestimonials = testimonials.length;
    const verifiedTestimonials = testimonials.filter((t) => t.verified).length;
    const averageRating =
      testimonials.reduce((acc, t) => acc + t.rating, 0) / totalTestimonials;
    const testimonialsByProject = this.groupTestimonialsByProject();
    const testimonialsByCompany = this.groupTestimonialsByCompany();
    const recentTestimonials = this.getRecentTestimonials(6);

    return {
      total: totalTestimonials,
      verified: verifiedTestimonials,
      verificationRate: (verifiedTestimonials / totalTestimonials) * 100,
      averageRating,
      byProject: testimonialsByProject,
      byCompany: testimonialsByCompany,
      recent: recentTestimonials,
    };
  }

  // Professional growth analytics
  static getProfessionalGrowthAnalytics() {
    const totalCertifications = certifications.length;
    const activeCertifications = certifications.filter(
      (c) => !c.expiryDate || c.expiryDate > new Date()
    ).length;
    const totalSpeakingEngagements = speakingEngagements.length;
    const totalPublications = publications.length;
    const totalAchievements = achievements.length;

    return {
      certifications: {
        total: totalCertifications,
        active: activeCertifications,
        expiringSoon: certifications.filter(
          (c) =>
            c.expiryDate &&
            c.expiryDate < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        ).length,
      },
      speaking: {
        total: totalSpeakingEngagements,
        totalAudience: speakingEngagements.reduce(
          (acc, s) => acc + (s.audience || 0),
          0
        ),
        averageAudience:
          speakingEngagements.reduce((acc, s) => acc + (s.audience || 0), 0) /
          totalSpeakingEngagements,
      },
      publications: {
        total: totalPublications,
        totalViews: publications.reduce((acc, p) => acc + (p.views || 0), 0),
        averageViews:
          publications.reduce((acc, p) => acc + (p.views || 0), 0) /
          totalPublications,
      },
      achievements: {
        total: totalAchievements,
        byCategory: this.groupAchievementsByCategory(),
        recent: achievements.slice(0, 5),
      },
    };
  }

  // Comprehensive portfolio summary
  static getPortfolioSummary() {
    return {
      overview: {
        name: personalInfo.name,
        title: personalInfo.title,
        experience: this.calculateTotalExperience(),
        location: personalInfo.location,
        availability: personalInfo.availability.status,
      },
      metrics: {
        projects: this.getProjectAnalytics(),
        skills: this.getSkillsAnalytics(),
        experience: this.getExperienceAnalytics(),
        testimonials: this.getTestimonialsAnalytics(),
        growth: this.getProfessionalGrowthAnalytics(),
      },
      highlights: {
        featuredProjects: projects.filter((p) => p.featured),
        expertSkills: skills.filter((s) => s.level >= 9),
        recentAchievements: achievements.slice(0, 3),
        topTestimonials: testimonials.filter((t) => t.rating === 5).slice(0, 3),
      },
      social: {
        links: socialLinks,
        metrics: allMetrics.portfolio.social,
      },
    };
  }

  // Helper methods
  private static calculateAverageProjectDuration(): number {
    const completedProjects = projects.filter((p) => p.endDate);
    const totalDuration = completedProjects.reduce((acc, project) => {
      const duration = project.endDate!.getTime() - project.startDate.getTime();
      return acc + duration;
    }, 0);
    return totalDuration / completedProjects.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private static getUniqueTechnologies(): string[] {
    const allTechs = projects.flatMap((p) => p.technologies.map((t) => t.name));
    return [...new Set(allTechs)];
  }

  private static groupProjectsByComplexity() {
    return projects.reduce((acc, project) => {
      acc[project.complexity] = (acc[project.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupProjectsByCategory() {
    return projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static calculateAverageMetric(
    metric: keyof (typeof projects)[0]["metrics"]
  ): number {
    const values = projects
      .map((p) => p.metrics[metric] as number)
      .filter((v) => v !== undefined);
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  }

  private static groupSkillsByCategory() {
    return skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static calculateAverageSkillExperience(): number {
    return (
      skills.reduce((acc, skill) => acc + skill.yearsExperience, 0) /
      skills.length
    );
  }

  private static getMostUsedSkills(): Array<{
    name: string;
    projectCount: number;
  }> {
    const skillUsage = skills.map((skill) => ({
      name: skill.name,
      projectCount: skill.projects.length,
    }));
    return skillUsage
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 10);
  }

  private static calculateTotalExperience(): number {
    const sortedExperience = experience.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
    if (sortedExperience.length === 0) return 0;

    const firstJob = sortedExperience[0];
    const currentDate = new Date();
    const totalMs = currentDate.getTime() - firstJob.startDate.getTime();
    return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25)); // Convert to years
  }

  private static groupExperienceByType() {
    return experience.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupTestimonialsByProject() {
    return testimonials.reduce((acc, testimonial) => {
      const project = testimonial.projectId || "general";
      acc[project] = (acc[project] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupTestimonialsByCompany() {
    return testimonials.reduce((acc, testimonial) => {
      acc[testimonial.company] = (acc[testimonial.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static getRecentTestimonials(count: number) {
    return testimonials
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, count);
  }

  private static groupAchievementsByCategory() {
    return achievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Export convenience functions
export const getPortfolioSummary = () => DataAggregator.getPortfolioSummary();
export const getProjectAnalytics = () => DataAggregator.getProjectAnalytics();
export const getSkillsAnalytics = () => DataAggregator.getSkillsAnalytics();
export const getExperienceAnalytics = () =>
  DataAggregator.getExperienceAnalytics();
export const getTestimonialsAnalytics = () =>
  DataAggregator.getTestimonialsAnalytics();
export const getProfessionalGrowthAnalytics = () =>
  DataAggregator.getProfessionalGrowthAnalytics();

// Development helper
if (process.env.NODE_ENV === "development") {
  console.log(
    "📊 Portfolio Analytics Summary:",
    DataAggregator.getPortfolioSummary()
  );
}
