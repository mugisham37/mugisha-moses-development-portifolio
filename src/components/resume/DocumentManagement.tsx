"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  LockClosedIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface Document {
  id: string;
  title: string;
  type: "recommendation" | "work-sample" | "salary" | "other";
  description: string;
  isSecure: boolean;
  downloadCount: number;
  lastAccessed: Date;
  fileSize: string;
  format: string;
}

const documents: Document[] = [
  {
    id: "rec-1",
    title: "Senior Developer Recommendation - TechInnovate",
    type: "recommendation",
    description:
      "Recommendation letter from CTO highlighting technical leadership and project delivery",
    isSecure: true,
    downloadCount: 12,
    lastAccessed: new Date("2024-01-15"),
    fileSize: "245 KB",
    format: "PDF",
  },
  {
    id: "rec-2",
    title: "Team Lead Recommendation - Digital Dynamics",
    type: "recommendation",
    description:
      "Recommendation from former team lead emphasizing collaboration and mentoring skills",
    isSecure: true,
    downloadCount: 8,
    lastAccessed: new Date("2024-01-10"),
    fileSize: "198 KB",
    format: "PDF",
  },
  {
    id: "sample-1",
    title: "React Component Library",
    type: "work-sample",
    description:
      "Comprehensive component library with TypeScript, Storybook, and testing",
    isSecure: false,
    downloadCount: 45,
    lastAccessed: new Date("2024-01-20"),
    fileSize: "2.1 MB",
    format: "ZIP",
  },
  {
    id: "sample-2",
    title: "3D Web Application Demo",
    type: "work-sample",
    description:
      "Three.js application showcasing advanced 3D web development skills",
    isSecure: false,
    downloadCount: 32,
    lastAccessed: new Date("2024-01-18"),
    fileSize: "1.8 MB",
    format: "ZIP",
  },
  {
    id: "salary-1",
    title: "Compensation Expectations",
    type: "salary",
    description:
      "Detailed salary expectations and compensation discussion framework",
    isSecure: true,
    downloadCount: 5,
    lastAccessed: new Date("2024-01-12"),
    fileSize: "156 KB",
    format: "PDF",
  },
];

export function DocumentManagement() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [accessCode, setAccessCode] = useState("");
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const documentTypes = [
    { value: "all", label: "All Documents", icon: DocumentTextIcon },
    { value: "recommendation", label: "Recommendations", icon: LockClosedIcon },
    { value: "work-sample", label: "Work Samples", icon: CodeBracketIcon },
    { value: "salary", label: "Compensation", icon: CurrencyDollarIcon },
  ];

  const filteredDocuments =
    selectedType === "all"
      ? documents
      : documents.filter((doc) => doc.type === selectedType);

  const handleDocumentAccess = (document: Document) => {
    if (document.isSecure) {
      setSelectedDocument(document);
      setShowAccessModal(true);
    } else {
      handleDownload(document);
    }
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    console.log(`Downloading ${document.title}`);
    // In a real implementation, this would trigger the actual download
    alert(`Downloading ${document.title}`);

    // Update download count (in real app, this would be handled by the backend)
    document.downloadCount += 1;
    document.lastAccessed = new Date();
  };

  const handleSecureAccess = () => {
    if (accessCode === "portfolio2024" && selectedDocument) {
      setShowAccessModal(false);
      setAccessCode("");
      handleDownload(selectedDocument);
      setSelectedDocument(null);
    } else {
      alert("Invalid access code. Please contact for access.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return LockClosedIcon;
      case "work-sample":
        return CodeBracketIcon;
      case "salary":
        return CurrencyDollarIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "from-green-500 to-emerald-500";
      case "work-sample":
        return "from-blue-500 to-cyan-500";
      case "salary":
        return "from-purple-500 to-pink-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Professional Documents
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Access recommendation letters, work samples, and compensation
          information
        </p>
      </div>

      {/* Document Type Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedType === type.value
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document, index) => {
          const TypeIcon = getTypeIcon(document.type);
          return (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(
                    document.type
                  )} rounded-lg flex items-center justify-center`}
                >
                  <TypeIcon className="h-6 w-6 text-white" />
                </div>
                {document.isSecure && (
                  <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                    <LockClosedIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Secure</span>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {document.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {document.description}
              </p>

              {/* Document Metadata */}
              <div className="space-y-2 mb-4 text-xs text-slate-500 dark:text-slate-500">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{document.format}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{document.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="font-medium">{document.downloadCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Accessed:</span>
                  <span className="font-medium">
                    {document.lastAccessed.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDocumentAccess(document)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download</span>
                </button>

                {!document.isSecure && (
                  <button
                    onClick={() =>
                      alert("Preview functionality would be implemented here")
                    }
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Document Analytics
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {documents.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Documents
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Downloads
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {documents.filter((doc) => doc.isSecure).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Secure Documents
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(
                documents.reduce(
                  (sum, doc) => sum + parseFloat(doc.fileSize),
                  0
                ) / 1000
              )}
              MB
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Size
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secure Access Modal */}
      <AnimatePresence>
        {showAccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <LockClosedIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Secure Document Access
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Enter access code to download
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Document: {selectedDocument?.title}
                </p>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleSecureAccess()}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAccessModal(false);
                    setAccessCode("");
                    setSelectedDocument(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSecureAccess}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Access Document
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  💡 For demo purposes, use access code:{" "}
                  <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    portfolio2024
                  </code>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
