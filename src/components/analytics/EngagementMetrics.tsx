"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

interface EngagementData {
  scrollDepth: { depth: number; users: number }[];
  timeOnPage: { page: string; avgTime: number; bounceRate: number }[];
  interactionHeatmap: { element: string; interactions: number }[];
  sessionFlow: { step: string; users: number; dropoff: number }[];
  deviceMetrics: { device: string; sessions: number; avgDuration: number }[];
}

interface EngagementMetricsProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function EngagementMetrics({ isVisible, onToggle }: EngagementMetricsProps) {
  const { getAnalyticsDashboard } = useAnalytics();
  const [engagementData, setEngagementData] = useState<EngagementData>({
    scrollDepth: [],
    timeOnPage: [],
    interactionHeatmap: [],
    sessionFlow: [],
    deviceMetrics: [],
  });
  const [selectedMetric, setSelectedMetric] = useState<"scroll" | "time" | "interactions" | "flow" | "devices">("scroll");

  useEffect(() => {
    const updateEngagementData = () => {
      const dashboard = getAnalyticsDashboard();
      if (!dashboard) return;

      const events = dashboard.events;

      // Process scroll depth data
      const scrollEvents = events.filter(e => e.event === "scroll_depth");
      const scrollDepthMap: Record<number, Set<string>> = {};
      
      scrollEvents.forEach(event => {
        const depth = event.properties?.scroll_percentage || 0;
        const sessionId = event.sessionId;
        if (!scrollDepthMap[depth]) scrollDepthMap[depth] = new Set();
        scrollDepthMap[depth].add(sessionId);
      });

      const scrollDepth = Object.entries(scrollDepthMap)
        .map(([depth, sessions]) => ({
          depth: parseInt(depth),
          users: sessions.size,
        }))
        .sort((a, b) => a.depth - b.depth);

      // Process time on page data
      const timeEvents = events.filter(e => e.event === "time_on_page");
      const pageTimeMap: Record<string, { times: number[]; sessions: Set<string> }> = {};
      
      timeEvents.forEach(event => {
        const page = event.properties?.page || "unknown";
        const time = event.properties?.time_spent || 0;
        const sessionId = event.sessionId;
        
        if (!pageTimeMap[page]) {
          pageTimeMap[page] = { times: [], sessions: new Set() };
        }
        pageTimeMap[page].times.push(time);
        pageTimeMap[page].sessions.add(sessionId);
      });

      const pageViews = events.filter(e => e.event === "page_view");
      const pageViewMap: Record<string, Set<string>> = {};
      
      pageViews.forEach(event => {
        const page = event.properties?.page || "unknown";
        const sessionId = event.sessionId;
        if (!pageViewMap[page]) pageViewMap[page] = new Set();
        pageViewMap[page].add(sessionId);
      });

      const timeOnPage = Object.entries(pageTimeMap)
        .map(([page, data]) => {
          const avgTime = data.times.reduce((sum, time) => sum + time, 0) / data.times.length;
          const totalViews = pageViewMap[page]?.size || 0;
          const engagedSessions = data.sessions.size;
          const bounceRate = totalViews > 0 ? ((totalViews - engagedSessions) / totalViews) * 100 : 0;
          
          return {
            page: page.replace(/^\//, "") || "home",
            avgTime: Math.round(avgTime / 1000), // Convert to seconds
            bounceRate: Math.round(bounceRate),
          };
        })
        .sort((a, b) => b.avgTime - a.avgTime)
        .slice(0, 10);

      // Process interaction heatmap data
      const heatmapEvents = events.filter(e => e.event === "heatmap_batch");
      const interactionMap: Record<string, number> = {};
      
      // Also count specific interaction events
      const interactionEvents = events.filter(e => 
        ["project_click", "skill_hover", "3d_interaction", "social_link_click"].includes(e.event)
      );
      
      interactionEvents.forEach(event => {
        const element = event.properties?.element_id || event.event;
        interactionMap[element] = (interactionMap[element] || 0) + 1;
      });

      const interactionHeatmap = Object.entries(interactionMap)
        .map(([element, interactions]) => ({ element, interactions }))
        .sort((a, b) => b.interactions - a.interactions)
        .slice(0, 10);

      // Process session flow data
      const funnelEvents = events.filter(e => e.event === "funnel_progression");
      const flowMap: Record<string, Set<string>> = {};
      
      funnelEvents.forEach(event => {
        const stage = event.properties?.to_stage || "unknown";
        const sessionId = event.sessionId;
        if (!flowMap[stage]) flowMap[stage] = new Set();
        flowMap[stage].add(sessionId);
      });

      const flowSteps = ["landing", "project_browse", "project_detail", "contact_interest", "contact_form", "conversion"];
      const sessionFlow = flowSteps.map((step, index) => {
        const users = flowMap[step]?.size || 0;
        const previousUsers = index > 0 ? (flowMap[flowSteps[index - 1]]?.size || 0) : users;
        const dropoff = previousUsers > 0 ? Math.round(((previousUsers - users) / previousUsers) * 100) : 0;
        
        return {
          step: step.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          users,
          dropoff: index > 0 ? dropoff : 0,
        };
      });

      // Process device metrics (simulated based on user agent)
      const sessionEvents = events.filter(e => e.event === "session_start");
      const deviceMap: Record<string, { sessions: number; durations: number[] }> = {};
      
      sessionEvents.forEach(event => {
        const userAgent = event.properties?.user_agent || "";
        const device = getDeviceType(userAgent);
        const sessionId = event.sessionId;
        
        if (!deviceMap[device]) {
          deviceMap[device] = { sessions: 0, durations: [] };
        }
        deviceMap[device].sessions++;
        
        // Find session duration
        const sessionTimeEvents = events.filter(e => 
          e.sessionId === sessionId && e.event === "time_on_page"
        );
        const totalTime = sessionTimeEvents.reduce((sum, e) => 
          sum + (e.properties?.time_spent || 0), 0
        );
        if (totalTime > 0) {
          deviceMap[device].durations.push(totalTime);
        }
      });

      const deviceMetrics = Object.entries(deviceMap)
        .map(([device, data]) => ({
          device,
          sessions: data.sessions,
          avgDuration: data.durations.length > 0 
            ? Math.round(data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length / 1000)
            : 0,
        }))
        .sort((a, b) => b.sessions - a.sessions);

      setEngagementData({
        scrollDepth,
        timeOnPage,
        interactionHeatmap,
        sessionFlow,
        deviceMetrics,
      });
    };

    updateEngagementData();
    const interval = setInterval(updateEngagementData, 30000);

    return () => clearInterval(interval);
  }, [getAnalyticsDashboard]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-28 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          📈 Engagement
        </Button>
      </div>
    );
  }

  const renderMetricContent = () => {
    switch (selectedMetric) {
      case "scroll":
        return (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Scroll Depth Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData.scrollDepth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="depth" label={{ value: "Scroll Depth (%)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Users", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value} users`, "Users"]} />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Shows how far users scroll down your pages. Higher percentages indicate better content engagement.</p>
            </div>
          </Card>
        );

      case "time":
        return (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Time on Page & Bounce Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData.timeOnPage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis yAxisId="time" orientation="left" label={{ value: "Time (seconds)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="bounce" orientation="right" label={{ value: "Bounce Rate (%)", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Bar yAxisId="time" dataKey="avgTime" fill="#82ca9d" name="Avg Time (s)" />
                <Bar yAxisId="bounce" dataKey="bounceRate" fill="#ff7c7c" name="Bounce Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Average time spent on each page and bounce rate. Lower bounce rates indicate better engagement.</p>
            </div>
          </Card>
        );

      case "interactions":
        return (
          <Card className="p-4"></Card>  <h3 className="text-lg font-semibold mb-4">Most Interacted Elements</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData.interactionHeatmap} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="element" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="interactions" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Elements that receive the most user interactions. Use this to optimize your most engaging content.</p>
            </div>
          </Card>
        );

      case "flow":
        return (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">User Session Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData.sessionFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis yAxisId="users" orientation="left" />
                <YAxis yAxisId="dropoff" orientation="right" />
                <Tooltip />
                <Line yAxisId="users" type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} name="Users" />
                <Line yAxisId="dropoff" type="monotone" dataKey="dropoff" stroke="#ff7c7c" strokeWidth={2} name="Dropoff %" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>User journey through your portfolio. Identify where users drop off to optimize the experience.</p>
            </div>
          </Card>
        );

      case "devices":
        return (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Device Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={engagementData.deviceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#82ca9d" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={engagementData.deviceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDuration" fill="#8884d8" name="Avg Duration (s)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Session count and average duration by device type. Optimize for your most common devices.</p>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Engagement Metrics</h2>
          <Button onClick={onToggle} variant="outline" size="sm">
            ✕ Close
          </Button>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "scroll", label: "Scroll Depth", icon: "📜" },
            { key: "time", label: "Time on Page", icon: "⏱️" },
            { key: "interactions", label: "Interactions", icon: "👆" },
            { key: "flow", label: "User Flow", icon: "🔄" },
            { key: "devices", label: "Devices", icon: "📱" },
          ].map((metric) => (
            <Button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              variant={selectedMetric === metric.key ? "default" : "outline"}
              size="sm"
            >
              {metric.icon} {metric.label}
            </Button>
          ))}
        </div>

        {/* Metric Content */}
        <motion.div
          key={selectedMetric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderMetricContent()}
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Avg Scroll Depth</h4>
            <p className="text-xl font-bold">
              {engagementData.scrollDepth.length > 0
                ? Math.round(
                    engagementData.scrollDepth.reduce((sum, item) => sum + item.depth * item.users, 0) /
                    engagementData.scrollDepth.reduce((sum, item) => sum + item.users, 0)
                  )
                : 0}%
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Avg Time on Site</h4>
            <p className="text-xl font-bold">
              {engagementData.timeOnPage.length > 0
                ? Math.round(
                    engagementData.timeOnPage.reduce((sum, item) => sum + item.avgTime, 0) /
                    engagementData.timeOnPage.length
                  )
                : 0}s
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Total Interactions</h4>
            <p className="text-xl font-bold">
              {engagementData.interactionHeatmap.reduce((sum, item) => sum + item.interactions, 0)}
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Device Types</h4>
            <p className="text-xl font-bold">{engagementData.deviceMetrics.length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getDeviceType(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return "Mobile";
  if (/Tablet|iPad/.test(userAgent)) return "Tablet";
  return "Desktop";
}