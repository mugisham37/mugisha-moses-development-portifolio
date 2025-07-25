"use client";

import { CompetencyMatrix } from "@/components/interactive";

export default function TestMatrixPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Competency Matrix Test
        </h1>
        <div className="max-w-6xl mx-auto">
          <CompetencyMatrix
            className="w-full"
            showEndorsements={true}
            showCertifications={true}
            showLearningGoals={true}
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
}
