"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle, 
  Eye, 
  TrendingUp,
  Users,
  Rss,
  Download,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EnhancedSocialShare } from "@/components/interactive/EnhancedSocialShare";
import { PrintFriendlyPost } from "@/components/interactive/PrintFriendlyPost";
import type { BlogPost } from "@/types";

interface BlogEngagementDashboardProps {
  post: BlogPost;
  content: string;
  className?: string;
}

interface EngagementMetrics {
  views: number;
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  readingProgress: number;
  timeSpent: number;
  bounceRate: number;
  socialReach: number;
  engagementRate: number;
}

export function BlogEngagementDashboard({ 
  post, 
  content, 
  className = "" 
}: BlogEngagementDashboardProps) {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    views: 0,
    likes: 0,
    shares: 0,
    bookmarks: 0,
    comments: 0,
    readingProgress: 0,
    timeSpent: 0,
    bounceRate: 0,
    socialReach: 0,
    engagementRate: 0
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'engagement' | 'sharing' | 'export'>('engagement');

  // Load and simulate engagement metrics
  useEffect(() => {
    const loadMetrics = () => {
      // In a real app, this would come from your analytics API
      const savedMetrics = localStorage.getItem(`engagement-${post.slug}`);
      
      if (savedMetrics) {
        setMetrics(JSON.parse(savedMetrics));
      } else {
        // Generate realistic demo metrics
        const baseViews = Math.floor(Math.random() * 2000) + 500;
        const newMetrics: EngagementMetrics = {
          views: baseViews,
          likes: Math.floor(baseViews * 0.05) + Math.floor(Math.random() * 50),
          shares: Math.floor(baseViews * 0.02) + Math.floor(Math.random() * 20),
          bookmarks: Math.floor(baseViews * 0.03) + Math.floor(Math.random() * 30),
          comments: Math.floor(baseViews * 0.01) + Math.floor(Math.random() * 10),
          readingProgress: Math.floor(Math.random() * 100),
          timeSpent: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
          bounceRate: Math.floor(Math.random() * 30) + 20, // 20-50%
          socialReach: Math.floor(baseViews * 0.1) + Math.floor(Math.random() * 100),
          engagementRate: Math.floor(Math.random() * 15) + 5 // 5-20%
        };
        
        setMetrics(newMetrics);
        localStorage.setItem(`engagement-${post.slug}`, JSON.stringify(newMetrics));
      }
    };

    loadMetrics();
  }, [post.slug]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      
      setMetrics(prev => ({ ...prev, readingProgress: Math.round(progress) }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const engagementStats = [
    {
      icon: Eye,
      label: "Views",
      value: metrics.views.toLocaleString(),
      change: "+12%",
      trend: "up",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      label: "Likes",
      value: metrics.likes.toLocaleString(),
      change: "+8%",
      trend: "up",
      color: "text-red-500"
    },
    {
      icon: Share2,
      label: "Shares",
      value: metrics.shares.toLocaleString(),
      change: "+15%",
      trend: "up",
      color: "text-green-600"
    },
    {
      icon: Bookmark,
      label: "Saves",
      value: metrics.bookmarks.toLocaleString(),
      change: "+5%",
      trend: "up",
      color: "text-yellow-600"
    },
    {
      icon: MessageCircle,
      label: "Comments",
      value: metrics.comments.toLocaleString(),
      change: "+3%",
      trend: "up",
      color: "text-purple-600"
    },
    {
      icon: Users,
      label: "Reach",
      value: metrics.socialReach.toLocaleString(),
      change: "+20%",
      trend: "up",
      color: "text-indigo-600"
    }
  ];

  const performanceStats = [
    {
      label: "Reading Progress",
      value: `${metrics.readingProgress}%`,
      description: "How far readers scroll"
    },
    {
      label: "Avg. Time Spent",
      value: `${Math.floor(metrics.timeSpent / 60)}:${(metrics.timeSpent % 60).toString().padStart(2, '0')}`,
      description: "Average reading time"
    },
    {
      label: "Engagement Rate",
      value: `${metrics.engagementRate}%`,
      description: "Likes + shares + comments / views"
    },
    {
      label: "Bounce Rate",
      value: `${metrics.bounceRate}%`,
      description: "Readers who leave quickly"
    }
  ];

  const feedLinks = [
    {
      title: "RSS Feed",
      description: "Subscribe to get updates in your RSS reader",
      url: "/blog/rss.xml",
      icon: Rss,
      format: "RSS 2.0"
    },
    {
      title: "Atom Feed",
      description: "Alternative feed format for feed readers",
      url: "/blog/atom.xml",
      icon: Rss,
      format: "Atom 1.0"
    },
    {
      title: "JSON Feed",
      description: "Modern JSON-based feed format",
      url: "/blog/feed.json",
      icon: Download,
      format: "JSON Feed"
    }
  ];

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Article Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time metrics and sharing options
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Live
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-muted rounded-lg">
            {[
              { id: 'engagement', label: 'Engagement', icon: TrendingUp },
              { id: 'sharing', label: 'Sharing', icon: Share2 },
              { id: 'export', label: 'Export', icon: Download }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'engagement' | 'sharing' | 'export')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {engagementStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="p-4 text-center hover:shadow-md transition-shadow">
                      <div className={`inline-flex p-2 rounded-full bg-muted mb-2 ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                      <div className="text-xs text-green-600 font-medium">
                        {stat.change}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Performance Metrics */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-semibold mb-4">Performance Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {performanceStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right max-w-[120px]">
                          {stat.description}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Reading Progress Visualization */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Reading Progress</span>
                      <span className="text-sm text-muted-foreground">{metrics.readingProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.readingProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Sharing Tab */}
          {activeTab === 'sharing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedSocialShare
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={post.title}
                description={post.description}
                author={post.author.name}
                tags={post.tags}
                variant="inline"
                showStats={true}
              />

              {/* RSS Feeds */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-8"
                >
                  <h4 className="font-semibold mb-4">Subscribe to Updates</h4>
                  <div className="space-y-3">
                    {feedLinks.map((feed, index) => (
                      <motion.div
                        key={feed.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <feed.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{feed.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {feed.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {feed.format}
                              </Badge>
                              <a
                                href={feed.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Subscribe</span>
                              </a>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PrintFriendlyPost
                post={post}
                content={content}
              />
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}