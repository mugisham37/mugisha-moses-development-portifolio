"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Globe,
  Coffee,
  Moon,
  Sun,
} from "lucide-react";
import { Card } from "../ui/Card";

interface AvailabilityStatusProps {
  className?: string;
}

interface AvailabilityData {
  status: "available" | "busy" | "away" | "offline";
  message: string;
  nextAvailable?: string;
  currentTime: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  upcomingMeetings: {
    title: string;
    time: string;
    duration: number;
  }[];
}

export function AvailabilityStatus({ className }: AvailabilityStatusProps) {
  const [availability, setAvailability] = useState<AvailabilityData>({
    status: "available",
    message: "Available for new projects",
    currentTime: "",
    timezone: "EST",
    workingHours: {
      start: "9:00 AM",
      end: "6:00 PM",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    upcomingMeetings: [],
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateAvailabilityStatus();
    }, 60000);

    // Initial update
    updateAvailabilityStatus();

    return () => clearInterval(timer);
  }, []);

  const updateAvailabilityStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHours = hour >= 9 && hour < 18;

    let status: AvailabilityData["status"] = "available";
    let message = "Available for new projects";
    let nextAvailable = "";

    // Determine status based on time
    if (!isWeekday) {
      status = "away";
      message = "Enjoying the weekend";
      nextAvailable = "Monday at 9:00 AM EST";
    } else if (!isWorkingHours) {
      if (hour < 9) {
        status = "offline";
        message = "Starting work soon";
        nextAvailable = "Today at 9:00 AM EST";
      } else {
        status = "offline";
        message = "Work day ended";
        nextAvailable = "Tomorrow at 9:00 AM EST";
      }
    } else {
      // During working hours - simulate some busy periods
      const busyHours = [10, 14, 16]; // 10 AM, 2 PM, 4 PM
      if (busyHours.includes(hour)) {
        status = "busy";
        message = "In a meeting";
        nextAvailable = `Today at ${hour + 1}:00 PM EST`;
      }
    }

    // Mock upcoming meetings
    const upcomingMeetings = [
      {
        title: "Project Review",
        time: "2:00 PM",
        duration: 60,
      },
      {
        title: "Client Call",
        time: "4:30 PM",
        duration: 30,
      },
    ];

    setAvailability((prev) => ({
      ...prev,
      status,
      message,
      nextAvailable,
      currentTime: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }),
      upcomingMeetings: isWeekday && isWorkingHours ? upcomingMeetings : [],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "busy":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "away":
        return <Coffee className="w-5 h-5 text-yellow-500" />;
      case "offline":
        return <Moon className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      case "busy":
        return "border-red-500 bg-red-50 dark:bg-red-950";
      case "away":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      case "offline":
        return "border-gray-500 bg-gray-50 dark:bg-gray-950";
      default:
        return "border-gray-300 bg-gray-50 dark:bg-gray-950";
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-4 h-4 text-yellow-500" />;
    } else {
      return <Moon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className={className}>
      <Card className={`p-6 border-2 ${getStatusColor(availability.status)}`}>
        {/* Main Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getStatusIcon(availability.status)}
            </motion.div>
            <div>
              <h3 className="font-semibold capitalize">
                {availability.status}
              </h3>
              <p className="text-sm text-muted-foreground">
                {availability.message}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTimeIcon()}
              <span>{availability.currentTime}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Globe className="w-3 h-3" />
              <span>{availability.timezone}</span>
            </div>
          </div>
        </div>

        {/* Next Available */}
        {availability.nextAvailable && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next available:</span>
              <span className="font-medium">{availability.nextAvailable}</span>
            </div>
          </div>
        )}

        {/* Working Hours */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Working Hours</h4>
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span>
                {availability.workingHours.start} -{" "}
                {availability.workingHours.end}
              </span>
            </div>
            <div className="text-xs">
              {availability.workingHours.days.join(", ")}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        {availability.upcomingMeetings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Today&apos;s Schedule</h4>
            <div className="space-y-2">
              {availability.upcomingMeetings.map((meeting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-secondary/30 rounded"
                >
                  <span>{meeting.title}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{meeting.time}</span>
                    <span>({meeting.duration}m)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Time */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Typical response time:
            </span>
            <span className="font-medium">
              {availability.status === "available"
                ? "Within 2 hours"
                : "Within 24 hours"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
