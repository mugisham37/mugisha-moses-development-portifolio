// Fix for Framer Motion typing issues with exactOptionalPropertyTypes
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";

// Create motion components that work with exactOptionalPropertyTypes
// Use any to bypass the strict typing temporarily
export const MotionDiv = motion.div as any;
export const MotionButton = motion.button as any;
export const MotionSpan = motion.span as any;
