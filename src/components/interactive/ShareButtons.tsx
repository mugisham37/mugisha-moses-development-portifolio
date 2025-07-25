"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description,
  className = "",
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const shareButtons = [
    {
      name: "Twitter",
      icon: Twitter,
      url: shareData.twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: shareData.linkedin,
      color: "hover:text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: shareData.facebook,
      color: "hover:text-blue-500",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-inherit hover:bg-white/10 border border-white/20"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      {/* Share Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-lg p-2 z-50 min-w-[200px]"
          >
            {/* Social Share Buttons */}
            <div className="space-y-1">
              {shareButtons.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${platform.color}`}
                  whileHover={{ x: 4 }}
                  onClick={() => setIsOpen(false)}
                >
                  <platform.icon className="w-4 h-4" />
                  <span>Share on {platform.name}</span>
                </motion.a>
              ))}

              {/* Copy Link Button */}
              <motion.button
                onClick={copyToClipboard}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                whileHover={{ x: 4 }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Copy link</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Native Share API (if available) */}
            {typeof navigator !== "undefined" && navigator.share && (
              <>
                <div className="border-t border-border my-2" />
                <motion.button
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title,
                        text: description,
                        url,
                      });
                      setIsOpen(false);
                    } catch (err) {
                      console.error("Error sharing:", err);
                    }
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <Share2 className="w-4 h-4" />
                  <span>More options</span>
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
