"use client";

import { useState, useEffect } from "react";
import { useAnalytics, type FunnelStage } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface FunnelStageData {
  stage: FunnelStage;
  count: number;
  percentage: number;
  dropoffRate: number;
}

interface ConversionFunnelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function ConversionFunnel({
  isVisible,
  onToggle,
}: ConversionFunnelProps) {
  const { getAnalyticsDashboard } = useAnalytics();
  const [funnelData, setFunnelData] = useState<FunnelStageData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const updateFunnelData = () => {
      const dashboard = getAnalyticsDashboard();
      if (!dashboard) return;

      // Process funnel progression events
      const funnelEvents = dashboard.events.filter(
        (event) => event.event === "funnel_progression"
      );

      const stageCounts: Record<FunnelStage, number> = {
        landing: 0,
        project_browse: 0,
        project_detail: 0,
        contact_interest: 0,
        contact_form: 0,
        conversion: 0,
      };

      // Count unique users at each stage
      const stageUsers: Record<FunnelStage, Set<string>> = {
        landing: new Set(),
        project_browse: new Set(),
        project_detail: new Set(),
        contact_interest: new Set(),
        contact_form: new Set(),
        conversion: new Set(),
      };

      funnelEvents.forEach((event) => {
        const stage = event.properties?.to_stage as FunnelStage;
        const sessionId = event.sessionId;

        if (stage && stageCounts.hasOwnProperty(stage)) {
          stageUsers[stage].add(sessionId);
        }
      });

      // Convert to counts
      Object.keys(stageCounts).forEach((stage) => {
        stageCounts[stage as FunnelStage] =
          stageUsers[stage as FunnelStage].size;
      });

      // Add landing page views (all sessions start here)
      const allSessions = new Set(dashboard.events.map((e) => e.sessionId));
      stageCounts.landing = allSessions.size;

      const total = stageCounts.landing;
      setTotalUsers(total);

      // Calculate percentages and dropoff rates
      const stages: FunnelStage[] = [
        "landing",
        "project_browse",
        "project_detail",
        "contact_interest",
        "contact_form",
        "conversion",
      ];

      const processedData: FunnelStageData[] = stages.map((stage, index) => {
        const count = stageCounts[stage];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const previousCount =
          index > 0 ? stageCounts[stages[index - 1]] : count;
        const dropoffRate =
          previousCount > 0
            ? ((previousCount - count) / previousCount) * 100
            : 0;

        return {
          stage,
          count,
          percentage,
          dropoffRate: index > 0 ? dropoffRate : 0,
        };
      });

      setFunnelData(processedData);
    };

    updateFunnelData();
    const interval = setInterval(updateFunnelData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getAnalyticsDashboard]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-16 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          📊 Funnel
        </Button>
      </div>
    );
  }

  const getStageLabel = (stage: FunnelStage): string => {
    const labels: Record<FunnelStage, string> = {
      landing: "Landing Page",
      project_browse: "Browse Projects",
      project_detail: "View Project Details",
      contact_interest: "Show Contact Interest",
      contact_form: "Start Contact Form",
      conversion: "Complete Conversion",
    };
    return labels[stage];
  };

  const getStageColor = (stage: FunnelStage): string => {
    const colors: Record<FunnelStage, string> = {
      landing: "bg-blue-500",
      project_browse: "bg-green-500",
      project_detail: "bg-yellow-500",
      contact_interest: "bg-orange-500",
      contact_form: "bg-red-500",
      conversion: "bg-purple-500",
    };
    return colors[stage];
  };

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Conversion Funnel</h2>
            <p className="text-muted-foreground">Total Users: {totalUsers}</p>
          </div>
          <Button onClick={onToggle} variant="outline" size="sm">
            ✕ Close
          </Button>
        </div>

        <div className="space-y-4">
          {funnelData.map((stageData, index) => (
            <motion.div
              key={stageData.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${getStageColor(
                        stageData.stage
                      )}`}
                    />
                    <h3 className="font-semibold">
                      {getStageLabel(stageData.stage)}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stageData.count}</p>
                    <p className="text-sm text-muted-foreground">
                      {stageData.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3 mb-2">
                  <motion.div
                    className={`h-3 rounded-full ${getStageColor(
                      stageData.stage
                    )}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stageData.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>

                {/* Dropoff Rate */}
                {index > 0 && stageData.dropoffRate > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Dropoff from previous stage:
                    </span>
                    <span className="text-red-500 font-medium">
                      -{stageData.dropoffRate.toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Stage-specific insights */}
                <div className="mt-2 text-sm text-muted-foreground">
                  {getStageInsight(stageData.stage, stageData)}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Conversion Rate Summary */}
        <Card className="p-4 mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <h3 className="font-semibold mb-2">Overall Conversion Rate</h3>
          <div className="flex items-center justify-between">
            <span>Landing to Conversion:</span>
            <span className="text-2xl font-bold text-purple-600">
              {totalUsers > 0
                ? (
                    ((funnelData.find((d) => d.stage === "conversion")?.count ||
                      0) /
                      totalUsers) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {getConversionInsight(funnelData, totalUsers)}
          </div>
        </Card>

        {/* Optimization Suggestions */}
        <Card className="p-4 mt-4">
          <h3 className="font-semibold mb-2">Optimization Suggestions</h3>
          <div className="space-y-2 text-sm">
            {getOptimizationSuggestions(funnelData).map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-yellow-500">💡</span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getStageInsight(stage: FunnelStage, data: FunnelStageData): string {
  const insights: Record<FunnelStage, string> = {
    landing: `${data.count} visitors reached your portfolio`,
    project_browse: `${data.percentage.toFixed(
      1
    )}% of visitors explored your projects`,
    project_detail: `${data.percentage.toFixed(
      1
    )}% viewed detailed project information`,
    contact_interest: `${data.percentage.toFixed(
      1
    )}% showed interest in contacting you`,
    contact_form: `${data.percentage.toFixed(1)}% started the contact process`,
    conversion: `${data.percentage.toFixed(1)}% completed a conversion action`,
  };
  return insights[stage];
}

function getConversionInsight(
  funnelData: FunnelStageData[],
  totalUsers: number
): string {
  const conversionRate =
    totalUsers > 0
      ? ((funnelData.find((d) => d.stage === "conversion")?.count || 0) /
          totalUsers) *
        100
      : 0;

  if (conversionRate > 5)
    return "Excellent conversion rate! Your portfolio is highly effective.";
  if (conversionRate > 2)
    return "Good conversion rate. Consider optimizing the contact flow.";
  if (conversionRate > 1)
    return "Average conversion rate. Focus on improving project presentation.";
  return "Low conversion rate. Consider redesigning the user journey.";
}

function getOptimizationSuggestions(funnelData: FunnelStageData[]): string[] {
  const suggestions: string[] = [];

  const projectBrowse = funnelData.find((d) => d.stage === "project_browse");
  const projectDetail = funnelData.find((d) => d.stage === "project_detail");
  const contactInterest = funnelData.find(
    (d) => d.stage === "contact_interest"
  );
  const contactForm = funnelData.find((d) => d.stage === "contact_form");

  if (projectBrowse && projectBrowse.dropoffRate > 50) {
    suggestions.push(
      "High dropoff at project browsing. Consider improving project thumbnails and descriptions."
    );
  }

  if (projectDetail && projectDetail.dropoffRate > 40) {
    suggestions.push(
      "Many users leave after viewing project details. Add more engaging content or clearer CTAs."
    );
  }

  if (contactInterest && contactInterest.dropoffRate > 60) {
    suggestions.push(
      "Users show interest but don't proceed. Simplify the contact process or add trust signals."
    );
  }

  if (contactForm && contactForm.dropoffRate > 30) {
    suggestions.push(
      "Contact form has high abandonment. Consider reducing form fields or adding progress indicators."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Your funnel is performing well! Continue monitoring for optimization opportunities."
    );
  }

  return suggestions;
}
