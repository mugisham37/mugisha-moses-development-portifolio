"use client";

import { SkillRadarSimple } from "@/components/interactive/SkillRadarSimple";

export default function TestRadarPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Skills Radar Chart Test
        </h1>
        <div className="flex justify-center">
          <SkillRadarSimple className="w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}
