"use client";

import { useCallback, useEffect, useRef } from "react";
import { track as vercelTrack } from "@vercel/analytics";

// Analytics event types for type safety
export type AnalyticsEvent =
  | "page_view"
  | "project_view"
  | "project_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "contact_form_complete"
  | "resume_download"
  | "theme_change"
  | "skill_hover"
  | "blog_post_view"
  | "social_link_click"
  | "3d_interaction"
  | "scroll_depth"
  | "time_on_page"
  | "search_query"
  | "filter_applied"
  | "video_play"
  | "document_download"
  | "calendar_booking_start"
  | "calendar_booking_complete"
  | "live_chat_start"
  | "voice_message_play";

export interface AnalyticsProperties {
  // Page tracking
  page?: string;
  referrer?: string;
  user_agent?: string;

  // Project interactions
  project_id?: string;
  project_title?: string;
  project_category?: string;
  technology?: string;

  // Contact form funnel
  form_step?: number;
  form_field?: string;
  form_error?: string;
  inquiry_type?: string;

  // Engagement metrics
  scroll_percentage?: number;
  time_spent?: number;
  interaction_type?: string;
  element_id?: string;

  // Content interactions
  blog_post_id?: string;
  blog_category?: string;
  reading_progress?: number;

  // UI interactions
  theme?: string;
  skill_category?: string;
  search_term?: string;
  filter_type?: string;

  // Performance metrics
  load_time?: number;
  interaction_delay?: number;

  // Custom properties
  [key: string]: any;
}

// Engagement heatmap data structure
export interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  element?: string;
  timestamp: number;
}

// Conversion funnel stages
export type FunnelStage =
  | "landing"
  | "project_browse"
  | "project_detail"
  | "contact_interest"
  | "contact_form"
  | "contact_submit"
  | "conversion";

export function useAnalytics() {
  const sessionStartTime = useRef<number>(Date.now());
  const pageStartTime = useRef<number>(Date.now());
  const heatmapData = useRef<HeatmapData[]>([]);
  const funnelStage = useRef<FunnelStage>("landing");
  const scrollDepthTracked = useRef<Set<number>>(new Set());

  // Track custom events with Vercel Analytics
  const track = useCallback(
    (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
      try {
        // Send to Vercel Analytics
        vercelTrack(event, properties);

        // Store locally for heatmap and funnel analysis
        if (typeof window !== "undefined") {
          const analyticsData = {
            event,
            properties,
            timestamp: Date.now(),
            sessionId:
              sessionStorage.getItem("analytics_session_id") ||
              generateSessionId(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          };

          // Store in localStorage for dashboard
          const existingData = JSON.parse(
            localStorage.getItem("portfolio_analytics") || "[]"
          );
          existingData.push(analyticsData);

          // Keep only last 1000 events to prevent storage overflow
          if (existingData.length > 1000) {
            existingData.splice(0, existingData.length - 1000);
          }

          localStorage.setItem(
            "portfolio_analytics",
            JSON.stringify(existingData)
          );
        }

        // Development logging
        if (process.env.NODE_ENV === "development") {
          console.log("📊 Analytics Event:", event, properties);
        }
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    },
    []
  );

  // Track page views with enhanced metadata
  const trackPageView = useCallback(
    (path: string, additionalProperties?: AnalyticsProperties) => {
      pageStartTime.current = Date.now();
      scrollDepthTracked.current.clear();

      const properties: AnalyticsProperties = {
        page: path,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        session_duration: Date.now() - sessionStartTime.current,
        ...additionalProperties,
      };

      track("page_view", properties);
    },
    [track]
  );

  // Track scroll depth milestones
  const trackScrollDepth = useCallback(
    (percentage: number) => {
      const milestone = Math.floor(percentage / 25) * 25; // Track at 0%, 25%, 50%, 75%, 100%

      if (!scrollDepthTracked.current.has(milestone) && milestone > 0) {
        scrollDepthTracked.current.add(milestone);
        track("scroll_depth", {
          scroll_percentage: milestone,
          page: window.location.pathname,
          time_to_scroll: Date.now() - pageStartTime.current,
        });
      }
    },
    [track]
  );

  // Track time spent on page
  const trackTimeOnPage = useCallback(() => {
    const timeSpent = Date.now() - pageStartTime.current;

    if (timeSpent > 10000) {
      // Only track if more than 10 seconds
      track("time_on_page", {
        time_spent: timeSpent,
        page: window.location.pathname,
        engagement_level:
          timeSpent > 60000 ? "high" : timeSpent > 30000 ? "medium" : "low",
      });
    }
  }, [track]);

  // Track heatmap interactions
  const trackHeatmapInteraction = useCallback(
    (x: number, y: number, element?: string) => {
      const heatmapPoint: HeatmapData = {
        x: (x / window.innerWidth) * 100, // Convert to percentage
        y: (y / window.innerHeight) * 100,
        intensity: 1,
        element,
        timestamp: Date.now(),
      };

      heatmapData.current.push(heatmapPoint);

      // Batch send heatmap data every 50 interactions
      if (heatmapData.current.length >= 50) {
        track("heatmap_batch", {
          interactions: heatmapData.current.length,
          page: window.location.pathname,
        });
        heatmapData.current = [];
      }
    },
    [track]
  );

  // Track conversion funnel progression
  const trackFunnelStage = useCallback(
    (stage: FunnelStage, properties?: AnalyticsProperties) => {
      const previousStage = funnelStage.current;
      funnelStage.current = stage;

      track("funnel_progression", {
        from_stage: previousStage,
        to_stage: stage,
        session_duration: Date.now() - sessionStartTime.current,
        ...properties,
      });
    },
    [track]
  );

  // Track project interactions
  const trackProjectInteraction = useCallback(
    (
      action: "view" | "click" | "hover",
      projectId: string,
      additionalProperties?: AnalyticsProperties
    ) => {
      track(`project_${action}` as AnalyticsEvent, {
        project_id: projectId,
        interaction_type: action,
        timestamp: Date.now(),
        ...additionalProperties,
      });

      if (action === "view") {
        trackFunnelStage("project_detail", { project_id: projectId });
      }
    },
    [track, trackFunnelStage]
  );

  // Track contact form funnel
  const trackContactForm = useCallback(
    (
      stage: "start" | "submit" | "complete" | "error",
      properties?: AnalyticsProperties
    ) => {
      track(`contact_form_${stage}` as AnalyticsEvent, properties);

      if (stage === "start") {
        trackFunnelStage("contact_form");
      } else if (stage === "complete") {
        trackFunnelStage("conversion", { conversion_type: "contact_form" });
      }
    },
    [track, trackFunnelStage]
  );

  // Track search and filtering
  const trackSearch = useCallback(
    (query: string, results: number, filters?: Record<string, any>) => {
      track("search_query", {
        search_term: query,
        results_count: results,
        filters_applied: filters ? Object.keys(filters).length : 0,
        ...filters,
      });
    },
    [track]
  );

  // Get analytics dashboard data
  const getAnalyticsDashboard = useCallback(() => {
    if (typeof window === "undefined") return null;

    const data = JSON.parse(
      localStorage.getItem("portfolio_analytics") || "[]"
    );
    const heatmap = heatmapData.current;

    return {
      events: data,
      heatmap,
      sessionDuration: Date.now() - sessionStartTime.current,
      currentFunnelStage: funnelStage.current,
    };
  }, []);

  // Initialize session tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("analytics_session_id");
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem("analytics_session_id", sessionId);
      }

      // Track session start
      track("session_start", {
        session_id: sessionId,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      });

      // Set up scroll tracking
      const handleScroll = () => {
        const scrollPercentage =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        trackScrollDepth(scrollPercentage);
      };

      // Set up click tracking for heatmap
      const handleClick = (event: MouseEvent) => {
        trackHeatmapInteraction(
          event.clientX,
          event.clientY,
          (event.target as Element)?.tagName?.toLowerCase()
        );
      };

      // Set up page unload tracking
      const handleBeforeUnload = () => {
        trackTimeOnPage();

        // Send any remaining heatmap data
        if (heatmapData.current.length > 0) {
          track("heatmap_batch", {
            interactions: heatmapData.current.length,
            page: window.location.pathname,
          });
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("click", handleClick, { passive: true });
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [track, trackScrollDepth, trackTimeOnPage, trackHeatmapInteraction]);

  return {
    track,
    trackPageView,
    trackScrollDepth,
    trackTimeOnPage,
    trackHeatmapInteraction,
    trackFunnelStage,
    trackProjectInteraction,
    trackContactForm,
    trackSearch,
    getAnalyticsDashboard,
  };
}

// Utility function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
