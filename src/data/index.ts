// Data Barrel Export
export * from "./projects";
export * from "./skills";
export * from "./experience";
export * from "./testimonials";
export * from "./personal-info";
export * from "./enhanced-metrics";
export * from "./data-aggregator";
export * from "./data-utils";

// Re-export commonly used data collections
export { projects } from "./projects";
export { skills, skillCategories } from "./skills";
export { experience } from "./experience";
export { testimonials } from "./testimonials";
export {
  personalInfo,
  socialLinks,
  contactPreferences,
  professionalSummary,
  achievements,
  careerTimeline,
  education,
  certifications,
  speakingEngagements,
  publications,
} from "./personal-info";

// Enhanced data exports
export { allMetrics } from "./enhanced-metrics";
export {
  getPortfolioSummary,
  getProjectAnalytics,
  getSkillsAnalytics,
  getExperienceAnalytics,
  getTestimonialsAnalytics,
  getProfessionalGrowthAnalytics,
} from "./data-aggregator";

// Content management exports
export {
  ContentLoader,
  getBlogPosts,
  getBlogPost,
  getBlogPostsByTag,
  getBlogPostsByCategory,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
  getCaseStudies,
  getCaseStudy,
  getLearningNotes,
  getLearningNote,
  serializeMDX,
  serializeBlogPost,
  serializeCaseStudy,
  searchContent,
  getContentStatistics,
} from "../lib/content-loader";

// Utility exports
export {
  DataUtils,
  getProjectById,
  getFeaturedProjects,
  getProjectsByTechnology,
  getRecentProjects,
  getSkillByName,
  getExpertSkills,
  getCurrentPosition,
  getVerifiedTestimonials,
  searchProjects,
  searchSkills,
  getProjectStatistics,
  getSkillStatistics,
  getTestimonialStatistics,
  validateDataIntegrity,
} from "./data-utils";
