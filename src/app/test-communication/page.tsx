"use client";

import {
  CommunicationOptions,
  AvailabilityStatus,
} from "@/components/interactive";
import { Toaster } from "react-hot-toast";

export default function TestCommunicationPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Communication Options Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Availability Status */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <AvailabilityStatus />
          </div>

          {/* Communication Options */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Communication Options
            </h2>
            <CommunicationOptions />
          </div>
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}
