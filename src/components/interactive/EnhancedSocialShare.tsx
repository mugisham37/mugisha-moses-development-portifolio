"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Mail,
  MessageCircle,
  Bookmark,
  Heart,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAnalytics } from "@/hooks/useAnalytics";

interface EnhancedSocialShareProps {
  url: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  className?: string;
  variant?: "floating" | "inline" | "compact";
  showStats?: boolean;
}

interface ShareStats {
  views: number;
  shares: number;
  likes: number;
  bookmarks: number;
}

export function EnhancedSocialShare({
  url,
  title,
  description,
  author,
  tags,
  className = "",
  variant = "inline",
  showStats = false,
}: EnhancedSocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [stats, setStats] = useState<ShareStats>({
    views: 0,
    shares: 0,
    likes: 0,
    bookmarks: 0,
  });

  const { trackEvent } = useAnalytics();

  // Load engagement stats and user preferences
  useEffect(() => {
    const loadEngagementData = () => {
      // Load from localStorage for demo purposes
      const savedLiked = localStorage.getItem(`liked-${url}`) === "true";
      const savedBookmarked =
        localStorage.getItem(`bookmarked-${url}`) === "true";
      const savedStats = localStorage.getItem(`stats-${url}`);

      setLiked(savedLiked);
      setBookmarked(savedBookmarked);

      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Generate realistic demo stats
        setStats({
          views: Math.floor(Math.random() * 1000) + 100,
          shares: Math.floor(Math.random() * 50) + 5,
          likes: Math.floor(Math.random() * 100) + 10,
          bookmarks: Math.floor(Math.random() * 30) + 3,
        });
      }
    };

    loadEngagementData();
  }, [url]);

  const shareData = {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}&via=alexmorgan_dev&hashtags=${tags
        .slice(0, 3)
        .join(",")}`,
      color: "hover:text-blue-400 hover:bg-blue-400/10",
      label: "Share on Twitter",
    },
    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        description
      )}`,
      color: "hover:text-blue-600 hover:bg-blue-600/10",
      label: "Share on LinkedIn",
    },
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(title)}`,
      color: "hover:text-blue-500 hover:bg-blue-500/10",
      label: "Share on Facebook",
    },
    email: {
      url: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(
        `Check out this article by ${author}: ${title}\n\n${description}\n\n${url}`
      )}`,
      color: "hover:text-green-600 hover:bg-green-600/10",
      label: "Share via Email",
    },
    whatsapp: {
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      color: "hover:text-green-500 hover:bg-green-500/10",
      label: "Share on WhatsApp",
    },
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    // Track share event
    trackEvent("article_shared", {
      platform,
      article_title: title,
      article_url: url,
    });

    // Update share count
    const newStats = { ...stats, shares: stats.shares + 1 };
    setStats(newStats);
    localStorage.setItem(`stats-${url}`, JSON.stringify(newStats));

    // Open share URL
    window.open(shareUrl, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      trackEvent("article_link_copied", {
        article_title: title,
        article_url: url,
      });

      // Update share count for copy action
      const newStats = { ...stats, shares: stats.shares + 1 };
      setStats(newStats);
      localStorage.setItem(`stats-${url}`, JSON.stringify(newStats));
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`liked-${url}`, newLiked.toString());

    const newStats = {
      ...stats,
      likes: newLiked ? stats.likes + 1 : stats.likes - 1,
    };
    setStats(newStats);
    localStorage.setItem(`stats-${url}`, JSON.stringify(newStats));

    trackEvent("article_liked", {
      article_title: title,
      article_url: url,
      liked: newLiked,
    });
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    localStorage.setItem(`bookmarked-${url}`, newBookmarked.toString());

    const newStats = {
      ...stats,
      bookmarks: newBookmarked ? stats.bookmarks + 1 : stats.bookmarks - 1,
    };
    setStats(newStats);
    localStorage.setItem(`stats-${url}`, JSON.stringify(newStats));

    trackEvent("article_bookmarked", {
      article_title: title,
      article_url: url,
      bookmarked: newBookmarked,
    });
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url,
      });

      trackEvent("article_native_shared", {
        article_title: title,
        article_url: url,
      });

      setIsOpen(false);
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Floating variant
  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 ${className}`}
      >
        <Card className="p-3 bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
          <div className="flex flex-col gap-3">
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                liked
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              }`}
              title="Like this article"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              title="Share this article"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                bookmarked
                  ? "text-yellow-500 bg-yellow-500/10"
                  : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
              }`}
              title="Bookmark this article"
            >
              <Bookmark
                className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
              />
            </motion.button>

            {/* Stats */}
            {showStats && (
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{stats.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{stats.likes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Share Options Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-4 top-0 bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]"
            >
              <div className="space-y-2">
                {Object.entries(shareData).map(([platform, data]) => {
                  const Icon =
                    platform === "twitter"
                      ? Twitter
                      : platform === "linkedin"
                      ? Linkedin
                      : platform === "facebook"
                      ? Facebook
                      : platform === "email"
                      ? Mail
                      : MessageCircle;

                  return (
                    <motion.button
                      key={platform}
                      onClick={() => handleShare(platform, data.url)}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors ${data.color}`}
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{data.label}</span>
                    </motion.button>
                  );
                })}

                <div className="border-t border-border pt-2">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
            liked
              ? "text-red-500 bg-red-500/10"
              : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span>{stats.likes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{stats.shares}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBookmark}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
            bookmarked
              ? "text-yellow-500 bg-yellow-500/10"
              : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
          <span>{stats.bookmarks}</span>
        </motion.button>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3">
        {/* Engagement Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              liked
                ? "text-red-500 bg-red-500/10 border border-red-500/20"
                : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border hover:border-red-500/20"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>Like</span>
            {showStats && <Badge variant="secondary">{stats.likes}</Badge>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              bookmarked
                ? "text-yellow-500 bg-yellow-500/10 border border-yellow-500/20"
                : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 border border-border hover:border-yellow-500/20"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
            />
            <span>Save</span>
            {showStats && <Badge variant="secondary">{stats.bookmarks}</Badge>}
          </motion.button>
        </div>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
          {showStats && <Badge variant="secondary">{stats.shares}</Badge>}
        </Button>
      </div>

      {/* Share Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-lg p-4 z-50 min-w-[280px]"
          >
            <h4 className="font-semibold mb-3">Share this article</h4>

            {/* Social Platforms */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(shareData).map(([platform, data]) => {
                const Icon =
                  platform === "twitter"
                    ? Twitter
                    : platform === "linkedin"
                    ? Linkedin
                    : platform === "facebook"
                    ? Facebook
                    : platform === "email"
                    ? Mail
                    : MessageCircle;

                return (
                  <motion.button
                    key={platform}
                    onClick={() => handleShare(platform, data.url)}
                    className={`flex items-center gap-2 p-3 rounded-lg border border-border transition-colors ${data.color}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                      {platform}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t border-border pt-3">
              <motion.button
                onClick={copyToClipboard}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                whileHover={{ x: 4 }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">
                      Link copied to clipboard!
                    </span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Copy article link</span>
                  </>
                )}
              </motion.button>

              {/* Native Share */}
              {typeof navigator !== "undefined" && navigator.share && (
                <motion.button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors mt-1"
                  whileHover={{ x: 4 }}
                >
                  <Share2 className="w-4 h-4" />
                  <span>More sharing options</span>
                </motion.button>
              )}
            </div>

            {/* Article Preview */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <h5 className="font-medium text-sm mb-1 line-clamp-1">{title}</h5>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  by {author}
                </span>
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
