import { Metadata } from "next";
import { SimpleResumeContainer } from "@/components/resume/SimpleResumeContainer";
import { personalInfo } from "@/data/personal-info";

export const metadata: Metadata = {
  title: `${personalInfo.name} - Interactive Resume Demo`,
  description: `Interactive resume demo with multiple formats and PDF generation`,
};

export default function ResumeDemoPage() {
  return <SimpleResumeContainer />;
}
