import { Metadata } from "next";
import { personalInfo } from "@/data/personal-info";

export const metadata: Metadata = {
  title: `${personalInfo.name} - Interactive Resume`,
  description: `Interactive resume of ${personalInfo.name}, ${personalInfo.title}. Download PDF or view in presentation mode.`,
  keywords: [
    "resume",
    "cv",
    "curriculum vitae",
    personalInfo.name,
    "developer",
    "full stack",
    "react",
    "next.js",
  ],
  openGraph: {
    title: `${personalInfo.name} - Interactive Resume`,
    description: `Interactive resume of ${personalInfo.name}, ${personalInfo.title}`,
    type: "profile",
    url: "/resume",
  },
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {personalInfo.name}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
              {personalInfo.title}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {personalInfo.bio}
            </p>
          </header>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              ✅ Task 11 - Professional Documentation System Completed!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Task 11.1 */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ 11.1 Interactive Resume
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Multiple format options, PDF generation, and analytics
                  tracking
                </p>
                <a
                  href="/resume-demo"
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  View Demo
                </a>
              </div>

              {/* Task 11.2 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  ✅ 11.2 Presentation Mode
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Slide-deck view with keyboard navigation and fullscreen
                  support
                </p>
                <a
                  href="/resume-demo"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Try Presentation
                </a>
              </div>

              {/* Task 11.3 */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  ✅ 11.3 Document Management
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                  Secure access to recommendations, work samples, and
                  compensation info
                </p>
                <a
                  href="/documents"
                  className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Access Documents
                </a>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Key Features Implemented:
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Interactive resume with downloadable PDF generation</li>
                <li>
                  • Multiple resume format options (standard, creative, minimal)
                </li>
                <li>• Print-optimized styling with proper page breaks</li>
                <li>• Resume analytics tracking for download metrics</li>
                <li>• Slide-deck presentation mode optimized for interviews</li>
                <li>• Keyboard navigation for presentation control</li>
                <li>
                  • Fullscreen mode with professional presentation styling
                </li>
                <li>• Secure access system for recommendation letters</li>
                <li>• Work samples gallery with categorized code snippets</li>
                <li>
                  • Salary expectations and compensation discussion section
                </li>
                <li>• Document download tracking and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
