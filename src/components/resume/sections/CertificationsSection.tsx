"use client";

import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { certifications } from "@/data/personal-info";
import { ResumeFormat, ResumeView } from "../ResumeContainer";

interface CertificationsSectionProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function CertificationsSection({
  format,
  view,
}: CertificationsSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    return expiryDate < new Date();
  };

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return "No Expiry";
    if (isExpired(expiryDate)) return "Expired";

    const monthsUntilExpiry = Math.floor(
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    if (monthsUntilExpiry <= 6) return "Expires Soon";
    return "Valid";
  };

  if (format === "minimal") {
    return (
      <div className="space-y-3">
        {certifications.slice(0, 4).map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-200 dark:border-slate-700 pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h3 className="font-medium text-slate-900 dark:text-white">
                {cert.name}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {formatDate(cert.date)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {cert.issuer}
            </p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (format === "creative") {
    return (
      <div className="space-y-3">
        {certifications.slice(0, 5).map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <CheckBadgeIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  {cert.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {cert.issuer}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(cert.date)}
                  </span>
                  <span
                    className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${
                      getExpiryStatus(cert.expiryDate) === "Valid"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        : getExpiryStatus(cert.expiryDate) === "Expires Soon"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                        : getExpiryStatus(cert.expiryDate) === "Expired"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    }
                  `}
                  >
                    {getExpiryStatus(cert.expiryDate)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Standard format
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certifications.map((cert, index) => (
        <motion.div
          key={cert.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {cert.name}
                </h3>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="View Credential"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {cert.issuer}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Issued {formatDate(cert.date)}</span>
                </div>

                <span
                  className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${
                    getExpiryStatus(cert.expiryDate) === "Valid"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                      : getExpiryStatus(cert.expiryDate) === "Expires Soon"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                      : getExpiryStatus(cert.expiryDate) === "Expired"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  }
                `}
                >
                  {getExpiryStatus(cert.expiryDate)}
                </span>
              </div>

              {cert.expiryDate && !isExpired(cert.expiryDate) && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Expires {formatDate(cert.expiryDate)}
                </p>
              )}

              {cert.credentialId && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
