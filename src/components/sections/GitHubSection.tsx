"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/components/interactive";

interface GitHubSectionProps {
  className?: string;
}

export default function GitHubSection({ className = "" }: GitHubSectionProps) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GitHub Analytics
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time insights into my development activity, repository
            statistics, and coding patterns powered by the GitHub API.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GitHubStats />
        </motion.div>
      </div>
    </section>
  );
}
