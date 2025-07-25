"use client";

import { ExperienceTimeline } from "@/components/interactive";

export default function TestTimelinePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Experience Timeline Test
        </h1>
        <div className="max-w-4xl mx-auto">
          <ExperienceTimeline
            className="w-full"
            showAchievements={true}
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
}
