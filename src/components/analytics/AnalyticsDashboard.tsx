"use client";

import { useState, useEffect } from "react";
import {
  useAnalytics,
  type AnalyticsProperties,
  type FunnelStage,
} from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface AnalyticsEvent {
  event: string;
  properties?: AnalyticsProperties;
  timestamp: number;
  sessionId: string;
  url: string;
}

interface DashboardData {
  events: AnalyticsEvent[];
  heatmap: any[];
  sessionDuration: number;
  currentFunnelStage: FunnelStage;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard() {
  const { getAnalyticsDashboard } = useAnalytics();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h"
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateDashboard = () => {
      const data = getAnalyticsDashboard();
      if (data) {
        setDashboardData(data);
      }
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getAnalyticsDashboard]);

  if (!dashboardData || !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          📊 Analytics
        </Button>
      </div>
    );
  }

  const filteredEvents = filterEventsByTimeRange(
    dashboardData.events,
    timeRange
  );
  const pageViews = getPageViewsData(filteredEvents);
  const eventCounts = getEventCountsData(filteredEvents);
  const funnelData = getFunnelData(filteredEvents);
  const engagementMetrics = getEngagementMetrics(filteredEvents);

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border rounded-md bg-background"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              ✕ Close
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Events
            </h3>
            <p className="text-2xl font-bold">{filteredEvents.length}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Page Views
            </h3>
            <p className="text-2xl font-bold">
              {pageViews.reduce((sum, item) => sum + item.views, 0)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avg. Session Duration
            </h3>
            <p className="text-2xl font-bold">
              {formatDuration(engagementMetrics.avgSessionDuration)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </h3>
            <p className="text-2xl font-bold">
              {engagementMetrics.conversionRate}%
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Page Views Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Page Views</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Event Distribution */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Event Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={eventCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {eventCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Conversion Funnel */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funnelData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Engagement Over Time */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={getEngagementOverTime(filteredEvents)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#FFBB28"
                  fill="#FFBB28"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Event</th>
                  <th className="text-left p-2">Page</th>
                  <th className="text-left p-2">Properties</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.slice(0, 20).map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-2">{event.event}</td>
                    <td className="p-2">
                      {event.properties?.page || new URL(event.url).pathname}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {event.properties
                        ? Object.keys(event.properties).length + " props"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
function filterEventsByTimeRange(
  events: AnalyticsEvent[],
  timeRange: string
): AnalyticsEvent[] {
  const now = Date.now();
  const ranges = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - ranges[timeRange as keyof typeof ranges];
  return events.filter((event) => event.timestamp > cutoff);
}

function getPageViewsData(events: AnalyticsEvent[]) {
  const pageViews: Record<string, number> = {};

  events.forEach((event) => {
    if (event.event === "page_view") {
      const page = event.properties?.page || new URL(event.url).pathname;
      pageViews[page] = (pageViews[page] || 0) + 1;
    }
  });

  return Object.entries(pageViews)
    .map(([page, views]) => ({
      page: page.replace(/^\//, "") || "home",
      views,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

function getEventCountsData(events: AnalyticsEvent[]) {
  const eventCounts: Record<string, number> = {};

  events.forEach((event) => {
    eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
  });

  return Object.entries(eventCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function getFunnelData(events: AnalyticsEvent[]) {
  const funnelCounts: Record<string, number> = {};

  events.forEach((event) => {
    if (event.event === "funnel_progression") {
      const stage = event.properties?.to_stage;
      if (stage) {
        funnelCounts[stage] = (funnelCounts[stage] || 0) + 1;
      }
    }
  });

  const funnelOrder = [
    "landing",
    "project_browse",
    "project_detail",
    "contact_interest",
    "contact_form",
    "conversion",
  ];

  return funnelOrder.map((stage) => ({
    stage: stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count: funnelCounts[stage] || 0,
  }));
}

function getEngagementMetrics(events: AnalyticsEvent[]) {
  const sessionDurations: number[] = [];
  const conversions = events.filter(
    (e) =>
      e.event === "funnel_progression" &&
      e.properties?.to_stage === "conversion"
  ).length;
  const totalSessions = new Set(events.map((e) => e.sessionId)).size;

  events.forEach((event) => {
    if (event.event === "time_on_page" && event.properties?.time_spent) {
      sessionDurations.push(event.properties.time_spent);
    }
  });

  const avgSessionDuration =
    sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) /
        sessionDurations.length
      : 0;

  const conversionRate =
    totalSessions > 0 ? ((conversions / totalSessions) * 100).toFixed(1) : "0";

  return {
    avgSessionDuration,
    conversionRate: parseFloat(conversionRate),
  };
}

function getEngagementOverTime(events: AnalyticsEvent[]) {
  const hourlyData: Record<string, number> = {};

  events.forEach((event) => {
    const hour = new Date(event.timestamp).toISOString().slice(0, 13) + ":00";
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
  });

  return Object.entries(hourlyData)
    .map(([time, events]) => ({
      time: new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      events,
    }))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(-24); // Last 24 hours
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
