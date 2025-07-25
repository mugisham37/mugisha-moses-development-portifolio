import { Metadata } from "next";
import { DocumentManagement } from "@/components/resume/DocumentManagement";
import { personalInfo } from "@/data/personal-info";

export const metadata: Metadata = {
  title: `${personalInfo.name} - Professional Documents`,
  description:
    "Access recommendation letters, work samples, and professional documentation",
  keywords: [
    "documents",
    "recommendations",
    "work samples",
    "portfolio",
    personalInfo.name,
  ],
};

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DocumentManagement />
    </div>
  );
}
