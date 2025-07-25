"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { analyticsTracker } from "@/lib/analytics-utils";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { track, trackPageView } = useAnalytics();

  // Initialize analytics tracker with the tracking function
  useEffect(() => {
    analyticsTracker.setTrackingFunction(track);
  }, [track]);

  // Track page views on route changes
  useEffect(() => {
    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url, {
      referrer: document.referrer,
      search_params: searchParams.toString(),
    });

    // Track performance metrics
    if (typeof window !== "undefined") {
      // Track Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
            analyticsTracker.trackLoadTime(pathname, loadTime);
          }
        });
      });

      observer.observe({ entryTypes: ["navigation"] });

      return () => observer.disconnect();
    }
  }, [pathname, searchParams, trackPageView]);

  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
