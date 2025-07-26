import {
  type AnalyticsEvent,
  type AnalyticsProperties,
} from "@/hooks/useAnalytics";

// Types for analytics event processing
export interface AnalyticsEventData {
  event: AnalyticsEvent;
  timestamp: number;
  properties?: AnalyticsProperties;
  sessionId?: string;
}

export interface AnalyticsStepData {
  step: string;
  timestamp: number;
  properties?: AnalyticsProperties;
}

export interface FormDataRecord {
  [key: string]: string | number | boolean | File | null | undefined;
}

// Analytics event tracking utilities
export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private trackingFunction:
    | ((event: AnalyticsEvent, properties?: AnalyticsProperties) => void)
    | null = null;

  static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  setTrackingFunction(
    fn: (event: AnalyticsEvent, properties?: AnalyticsProperties) => void
  ) {
    this.trackingFunction = fn;
  }

  track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (this.trackingFunction) {
      this.trackingFunction(event, properties);
    }
  }

  // Project interaction tracking
  trackProjectView(projectId: string, projectTitle: string, category?: string) {
    const properties: AnalyticsProperties = {
      project_id: projectId,
      project_title: projectTitle,
      timestamp: Date.now(),
    };
    
    if (category !== undefined) {
      properties.project_category = category;
    }
    
    this.track("project_view", properties);
  }

  trackProjectClick(
    projectId: string,
    projectTitle: string,
    clickType: "live_demo" | "github" | "case_study"
  ) {
    this.track("project_click", {
      project_id: projectId,
      project_title: projectTitle,
      interaction_type: clickType,
      timestamp: Date.now(),
    });
  }

  // Contact form tracking
  trackContactFormStart(inquiryType?: string) {
    const properties: AnalyticsProperties = {
      timestamp: Date.now(),
    };
    
    if (inquiryType !== undefined) {
      properties.inquiry_type = inquiryType;
    }
    
    this.track("contact_form_start", properties);
  }

  trackContactFormStep(step: number, fieldName?: string) {
    const properties: AnalyticsProperties = {
      form_step: step,
      timestamp: Date.now(),
    };
    
    if (fieldName !== undefined) {
      properties.form_field = fieldName;
    }
    
    this.track("contact_form_submit", properties);
  }

  trackContactFormComplete(inquiryType: string, formData: FormDataRecord) {
    this.track("contact_form_complete", {
      inquiry_type: inquiryType,
      form_fields_completed: Object.keys(formData).length,
      timestamp: Date.now(),
    });
  }

  trackContactFormError(step: number, error: string, fieldName?: string) {
    const properties: AnalyticsProperties = {
      form_step: step,
      form_error: error,
      timestamp: Date.now(),
    };
    
    if (fieldName !== undefined) {
      properties.form_field = fieldName;
    }
    
    this.track("contact_form_submit", properties);
  }

  // Skills and resume tracking
  trackSkillHover(
    skillName: string,
    category: string,
    proficiencyLevel: number
  ) {
    this.track("skill_hover", {
      skill_category: category,
      element_id: skillName,
      interaction_type: "hover",
      proficiency_level: proficiencyLevel,
    });
  }

  trackResumeDownload(format: "pdf" | "doc" | "txt") {
    this.track("resume_download", {
      document_format: format,
      timestamp: Date.now(),
    });
  }

  // Blog and content tracking
  trackBlogPostView(postId: string, postTitle: string, category?: string) {
    const properties: AnalyticsProperties = {
      blog_post_id: postId,
      content_title: postTitle,
      timestamp: Date.now(),
    };
    
    if (category !== undefined) {
      properties.blog_category = category;
    }
    
    this.track("blog_post_view", properties);
  }

  trackBlogReadingProgress(postId: string, percentage: number) {
    this.track("blog_post_view", {
      blog_post_id: postId,
      reading_progress: percentage,
      timestamp: Date.now(),
    });
  }

  // Search and filtering
  trackSearch(
    query: string,
    resultsCount: number,
    section: "projects" | "blog" | "skills"
  ) {
    this.track("search_query", {
      search_term: query,
      results_count: resultsCount,
      search_section: section,
      timestamp: Date.now(),
    });
  }

  trackFilterApplied(filterType: string, filterValue: string, section: string) {
    this.track("filter_applied", {
      filter_type: filterType,
      filter_value: filterValue,
      section: section,
      timestamp: Date.now(),
    });
  }

  // Theme and UI interactions
  trackThemeChange(fromTheme: string, toTheme: string) {
    this.track("theme_change", {
      from_theme: fromTheme,
      to_theme: toTheme,
      timestamp: Date.now(),
    });
  }

  track3DInteraction(
    interactionType: "hover" | "click" | "drag",
    element: string
  ) {
    this.track("3d_interaction", {
      interaction_type: interactionType,
      element_id: element,
      timestamp: Date.now(),
    });
  }

  // Social and external links
  trackSocialLinkClick(
    platform: string,
    context: "header" | "footer" | "contact"
  ) {
    this.track("social_link_click", {
      social_platform: platform,
      link_context: context,
      timestamp: Date.now(),
    });
  }

  trackExternalLinkClick(url: string, linkText: string, context: string) {
    this.track("social_link_click", {
      external_url: url,
      link_text: linkText,
      link_context: context,
      timestamp: Date.now(),
    });
  }

  // Calendar and communication
  trackCalendarBookingStart(meetingType?: string) {
    this.track("calendar_booking_start", {
      meeting_type: meetingType,
      timestamp: Date.now(),
    });
  }

  trackCalendarBookingComplete(meetingType: string, duration: number) {
    this.track("calendar_booking_complete", {
      meeting_type: meetingType,
      meeting_duration: duration,
      timestamp: Date.now(),
    });
  }

  trackLiveChatStart() {
    this.track("live_chat_start", {
      timestamp: Date.now(),
    });
  }

  trackVoiceMessagePlay(messageId: string, duration: number) {
    this.track("voice_message_play", {
      message_id: messageId,
      message_duration: duration,
      timestamp: Date.now(),
    });
  }

  // Performance tracking
  trackPerformanceMetric(
    metric: "LCP" | "FID" | "CLS",
    value: number,
    page: string
  ) {
    this.track("page_view", {
      performance_metric: metric,
      metric_value: value,
      page: page,
      timestamp: Date.now(),
    });
  }

  trackLoadTime(page: string, loadTime: number) {
    this.track("page_view", {
      page: page,
      load_time: loadTime,
      timestamp: Date.now(),
    });
  }
}

// Utility functions for analytics data processing
export function calculateEngagementScore(events: AnalyticsEventData[]): number {
  if (events.length === 0) return 0;

  let score = 0;
  const weights = {
    page_view: 1,
    project_view: 3,
    project_click: 5,
    skill_hover: 2,
    contact_form_start: 8,
    contact_form_complete: 15,
    blog_post_view: 4,
    search_query: 3,
    theme_change: 1,
    social_link_click: 2,
    scroll_depth: 1,
    time_on_page: 2,
  };

  events.forEach((event) => {
    const weight = weights[event.event as keyof typeof weights] || 1;
    score += weight;

    // Bonus for longer engagement
    if (event.properties?.time_spent && event.properties.time_spent > 30000) score += 2;
    if (event.properties?.scroll_percentage && event.properties.scroll_percentage > 75) score += 1;
    if (event.properties?.reading_progress && event.properties.reading_progress > 50) score += 2;
  });

  return Math.min(score, 100); // Cap at 100
}

export function getTopPages(
  events: AnalyticsEventData[]
): Array<{ page: string; views: number; engagement: number }> {
  const pageStats: Record<
    string,
    { views: number; totalTime: number; interactions: number }
  > = {};

  events.forEach((event) => {
    const page = event.properties?.page || "unknown";

    if (!pageStats[page]) {
      pageStats[page] = { views: 0, totalTime: 0, interactions: 0 };
    }

    if (event.event === "page_view") {
      pageStats[page].views++;
    }

    if (event.properties?.time_spent) {
      pageStats[page].totalTime += event.properties.time_spent;
    }

    if (
      ["project_click", "skill_hover", "contact_form_start"].includes(
        event.event
      )
    ) {
      pageStats[page].interactions++;
    }
  });

  return Object.entries(pageStats)
    .map(([page, stats]) => ({
      page: page.replace(/^\//, "") || "home",
      views: stats.views,
      engagement: stats.interactions + stats.totalTime / 10000, // Normalize time to engagement score
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);
}

export function getUserJourney(
  events: AnalyticsEventData[],
  sessionId: string
): AnalyticsStepData[] {
  return events
    .filter((event) => event.sessionId === sessionId)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((event) => {
      const step: AnalyticsStepData = {
        step: event.event,
        timestamp: event.timestamp,
      };
      
      if (event.properties !== undefined) {
        step.properties = event.properties;
      }
      
      return step;
    });
}

export function calculateConversionRate(
  events: AnalyticsEventData[],
  timeframe: "1h" | "24h" | "7d" | "30d" = "24h"
): number {
  const now = Date.now();
  const timeframes = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - timeframes[timeframe];
  const recentEvents = events.filter((event) => event.timestamp > cutoff);

  const totalSessions = new Set(recentEvents.map((e) => e.sessionId)).size;
  const conversions = recentEvents.filter(
    (e) =>
      e.event === "contact_form_complete" ||
      e.event === "calendar_booking_complete"
  ).length;

  return totalSessions > 0 ? (conversions / totalSessions) * 100 : 0;
}

// Export singleton instance
export const analyticsTracker = AnalyticsTracker.getInstance();
