"use client";

import {
  CalendarBooking,
  AvailabilityStatus,
  TimezoneHandler,
} from "@/components/interactive";
import { Toaster } from "react-hot-toast";

export default function TestCalendarPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Calendar Integration Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Availability Status */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Availability Status</h2>
            <AvailabilityStatus />
          </div>

          {/* Timezone Handler */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Timezone Settings</h2>
            <TimezoneHandler />
          </div>
        </div>

        {/* Calendar Booking */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Calendar Booking</h2>
          <CalendarBooking />
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}
