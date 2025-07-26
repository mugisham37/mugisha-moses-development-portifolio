"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Clock, MapPin, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface TimezoneHandlerProps {
  className?: string;
  onTimezoneChange?: (timezone: string) => void;
}

interface TimezoneInfo {
  name: string;
  label: string;
  offset: string;
  currentTime: string;
  abbreviation: string;
}

const popularTimezones = [
  { name: "America/New_York", label: "Eastern Time", abbreviation: "EST/EDT" },
  { name: "America/Chicago", label: "Central Time", abbreviation: "CST/CDT" },
  { name: "America/Denver", label: "Mountain Time", abbreviation: "MST/MDT" },
  {
    name: "America/Los_Angeles",
    label: "Pacific Time",
    abbreviation: "PST/PDT",
  },
  { name: "Europe/London", label: "London", abbreviation: "GMT/BST" },
  { name: "Europe/Paris", label: "Paris", abbreviation: "CET/CEST" },
  { name: "Asia/Tokyo", label: "Tokyo", abbreviation: "JST" },
  { name: "Asia/Shanghai", label: "Shanghai", abbreviation: "CST" },
  { name: "Australia/Sydney", label: "Sydney", abbreviation: "AEST/AEDT" },
  { name: "UTC", label: "UTC", abbreviation: "UTC" },
];

export function TimezoneHandler({
  className,
  onTimezoneChange,
}: TimezoneHandlerProps) {
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [detectedTimezone, setDetectedTimezone] = useState<string>("");
  const [timezoneInfo, setTimezoneInfo] = useState<TimezoneInfo[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Detect user's timezone
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setDetectedTimezone(detected);
    setSelectedTimezone(detected);

    // Update times every second
    const timer = setInterval(() => {
      updateTimezoneInfo();
    }, 1000);

    updateTimezoneInfo();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (onTimezoneChange) {
      onTimezoneChange(selectedTimezone);
    }
  }, [selectedTimezone, onTimezoneChange]);

  const updateTimezoneInfo = () => {
    const now = new Date();
    const info = popularTimezones.map((tz) => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz.name,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const offsetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz.name,
        timeZoneName: "longOffset",
      });

      const parts = offsetFormatter.formatToParts(now);
      const offsetPart = parts.find((part) => part.type === "timeZoneName");
      const offset = offsetPart ? offsetPart.value : "";

      return {
        name: tz.name,
        label: tz.label,
        offset,
        currentTime: formatter.format(now),
        abbreviation: tz.abbreviation,
      };
    });

    setTimezoneInfo(info);
  };

  const handleTimezoneSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    setIsDropdownOpen(false);
  };

  const getSelectedTimezoneInfo = () => {
    return (
      timezoneInfo.find((tz) => tz.name === selectedTimezone) || timezoneInfo[0]
    );
  };

  const isDetectedTimezone = (timezone: string) => {
    return timezone === detectedTimezone;
  };

  const formatTimezoneForDisplay = (timezone: string) => {
    const info = timezoneInfo.find((tz) => tz.name === timezone);
    if (!info) return timezone;

    return `${info.label} (${info.abbreviation})`;
  };

  const selectedInfo = getSelectedTimezoneInfo();

  return (
    <div className={className}>
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold">Timezone Settings</h3>
            <p className="text-sm text-muted-foreground">
              All meeting times will be displayed in your selected timezone
            </p>
          </div>
        </div>

        {/* Current Selection */}
        {selectedInfo && (
          <div className="mb-6">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{selectedInfo.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedInfo.abbreviation} • {selectedInfo.offset}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-semibold">
                    {selectedInfo.currentTime}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current time
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Timezone Selector */}
        <div className="relative mb-6">
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{formatTimezoneForDisplay(selectedTimezone)}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto"
            >
              {timezoneInfo.map((tz) => (
                <button
                  key={tz.name}
                  onClick={() => handleTimezoneSelect(tz.name)}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between ${
                    selectedTimezone === tz.name
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {tz.label}
                      {isDetectedTimezone(tz.name) && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Detected
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tz.abbreviation} • {tz.offset}
                    </div>
                  </div>
                  <div className="text-sm font-mono">{tz.currentTime}</div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Auto-detection Info */}
        <div className="p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <p className="text-muted-foreground">
                <strong>Auto-detected:</strong>{" "}
                {formatTimezoneForDisplay(detectedTimezone)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We automatically detected your timezone, but you can change it
                above if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Time Preview */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Meeting Time Preview</h4>
          <div className="space-y-2">
            {["9:00 AM", "2:00 PM", "5:00 PM"].map((time, index) => {
              const timeParts = time.split(" ");
              const hourPart = timeParts[0];
              const period = timeParts[1];
              
              if (!hourPart || !period) {
                return null; // Skip invalid time format
              }
              
              const hourMinuteParts = hourPart.split(":");
              const hourNum = hourMinuteParts[0];
              
              if (!hourNum) {
                return null; // Skip if hour is not available
              }
              
              const hour24 =
                period === "PM" && hourNum !== "12"
                  ? parseInt(hourNum, 10) + 12
                  : period === "AM" && hourNum === "12"
                  ? 0
                  : parseInt(hourNum, 10);

              const meetingDate = new Date();
              meetingDate.setHours(hour24, 0, 0, 0);

              const localTime = new Intl.DateTimeFormat("en-US", {
                timeZone: selectedTimezone,
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(meetingDate);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-secondary/30 rounded"
                >
                  <span>Sample meeting at {time} EST</span>
                  <span className="font-medium">{localTime} (Your time)</span>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      </Card>
    </div>
  );
}
