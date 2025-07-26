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
  | "voice_message_play"
  | "heatmap_batch"
  | "funnel_progression"
  | "session_start";

export interface AnalyticsProperties {
  // Page tracking
  page?: string | undefined;
  referrer?: string | undefined;
  user_agent?: string | undefined;

  // Project interactions
  project_id?: string | undefined;
  project_title?: string | undefined;
  project_category?: string | undefined;
  technology?: string | undefined;

  // Contact form funnel
  form_step?: number | undefined;
  form_field?: string | undefined;
  form_error?: string | undefined;
  inquiry_type?: string | undefined;

  // Engagement metrics
  scroll_percentage?: number | undefined;
  time_spent?: number | undefined;
  interaction_type?: string | undefined;
  element_id?: string | undefined;

  // Content interactions
  blog_post_id?: string | undefined;
  blog_category?: string | undefined;
  reading_progress?: number | undefined;

  // UI interactions
  theme?: string | undefined;
  skill_category?: string | undefined;
  search_term?: string | undefined;
  filter_type?: string | undefined;

  // Performance metrics
  load_time?: number | undefined;
  interaction_delay?: number | undefined;

  // Funnel and session data
  from_stage?: string | undefined;
  to_stage?: string | undefined;
  session_duration?: number | undefined;
  session_id?: string | undefined;
  screen_resolution?: string | undefined;
  viewport_size?: string | undefined;
  interactions?: number | undefined;
  engagement_level?: string | undefined;
  timestamp?: number | undefined;
  results_count?: number | undefined;

  // Custom properties - using specific types instead of any
  [key: string]: string | number | boolean | undefined;
}

// Engagement heatmap data structure
export interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  element?: string | undefined;
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
        // Filter out undefined values for Vercel Analytics
        const cleanProperties = properties
          ? Object.fromEntries(
              Object.entries(properties).filter(([, value]) => value !== undefined)
            )
          : undefined;

        vercelTrack(event, cleanProperties as Record<string, string | number | boolean>);
        
        // Log for development
        if (process.env.NODE_ENV === "development") {
          console.log("Analytics Event:", event, cleanProperties);
        }
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    },
    []
  );

  // Track page views
  const trackPageView = useCallback(
    (page: string, properties?: AnalyticsProperties) => {
      pageStartTime.current = Date.now();

      track("page_view", {
        page,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        timestamp: Date.now(),
        ...properties,
      });
    },
    [track]
  );

  // Track scroll depth milestones
  const trackScrollDepth = useCallback(
    (percentage: number) => {
      const milestone = Math.floor(percentage / 25) * 25; // 0, 25, 50, 75, 100

      if (milestone > 0 && !scrollDepthTracked.current.has(milestone)) {
        scrollDepthTracked.current.add(milestone);

        track("scroll_depth", {
          scroll_percentage: milestone,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
          timestamp: Date.now(),
        });
      }
    },
    [track]
  );

  // Track contact form interactions
  const trackContactForm = useCallback(
    (
      action: "start" | "submit" | "complete",
      step?: number,
      properties?: AnalyticsProperties
    ) => {
      const eventName = `contact_form_${action}` as AnalyticsEvent;
      
      track(eventName, {
        form_step: step,
        timestamp: Date.now(),
        ...properties,
      });
    },
    [track]
  );

  // Track search interactions
  const trackSearch = useCallback(
    (query: string, results: number, filters?: Record<string, string | number | boolean>) => {
      track("search_query", {
        search_term: query,
        results_count: results,
        timestamp: Date.now(),
        ...filters,
      });
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
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
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
        element: element || undefined,
        timestamp: Date.now(),
      };

      heatmapData.current.push(heatmapPoint);

      // Batch send heatmap data every 50 interactions
      if (heatmapData.current.length >= 50) {
        track("heatmap_batch", {
          interactions: heatmapData.current.length,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
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
    },
    [track]
  );

  // Get analytics dashboard data
  const getAnalyticsDashboard = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTime.current;
    const heatmap = [...heatmapData.current];
    
    return {
      sessionDuration,
      currentFunnelStage: funnelStage.current,
      heatmapDataPoints: heatmap.length,
      scrollDepthMilestones: Array.from(scrollDepthTracked.current),
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
    // Return undefined for server-side rendering
    return undefined;
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
