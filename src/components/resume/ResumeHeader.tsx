"use client";

import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { personalInfo } from "@/data/personal-info";
import { ResumeFormat, ResumeView } from "./ResumeContainer";

interface ResumeHeaderProps {
  format: ResumeFormat;
  view: ResumeView;
}

export function ResumeHeader({ format, view }: ResumeHeaderProps) {
  const contactInfo = [
    {
      icon: EnvelopeIcon,
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: PhoneIcon,
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
    },
    { icon: MapPinIcon, value: personalInfo.location, href: null },
    {
      icon: GlobeAltIcon,
      value: personalInfo.website,
      href: personalInfo.website,
    },
  ];

  // Determine classes based on view type
  const getViewClasses = () => {
    if (view === "print") {
      return "print:bg-white print:text-black print:shadow-none";
    }
    if (view === "presentation") {
      return "text-lg scale-110";
    }
    return "";
  };

  if (format === "creative") {
    return (
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`creative-header relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden ${getViewClasses()}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-4xl font-bold">
                  {personalInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
            </motion.div>

            {/* Main Info */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold mb-2"
              >
                {personalInfo.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-blue-100 mb-4"
              >
                {personalInfo.title}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-blue-100 max-w-2xl mb-6"
              >
                {personalInfo.bio}
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-blue-100"
                    >
                      <Icon className="h-4 w-4" />
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="hover:text-white transition-colors"
                          target={
                            contact.href.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span>{contact.value}</span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Available</span>
              </div>
              <p className="text-xs text-blue-100">
                {personalInfo.availability.type}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.header>
    );
  }

  if (format === "minimal") {
    return (
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`minimal-header border-b border-slate-200 dark:border-slate-700 py-8 ${getViewClasses()}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-slate-900 dark:text-white mb-2">
              {personalInfo.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              {personalInfo.title}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center space-x-1">
                    <Icon className="h-4 w-4" />
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        target={
                          contact.href.startsWith("http") ? "_blank" : undefined
                        }
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <span>{contact.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  // Standard format
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`standard-header bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ${getViewClasses()}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {personalInfo.name}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-3">
              {personalInfo.title}
            </p>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
              {personalInfo.bio}
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-slate-400" />
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      target={
                        contact.href.startsWith("http") ? "_blank" : undefined
                      }
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400">
                      {contact.value}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Availability */}
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <CalendarIcon className="h-5 w-5 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                {personalInfo.availability.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
