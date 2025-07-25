import React from "react";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "./MDXComponents";
import { motion } from "framer-motion";

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
  className?: string;
}

export const MDXRenderer: React.FC<MDXRendererProps> = ({
  source,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
    >
      <MDXRemote {...source} components={mdxComponents} />
    </motion.div>
  );
};

export default MDXRenderer;
