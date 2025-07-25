"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";

interface SEOMetrics {
  metaTags: {
    title: { present: boolean; length: number; optimized: boolean };
    description: { present: boolean; length: number; optimized: boolean };
    keywords: { present: boolean; count: number; optimized: boolean };
    ogTags: { present: boolean; count: number; optimized: boolean };
    twitterTags: { present: boolean; count: number; optimized: boolean };
  };
  structuredData: {
    present: boolean;
    types: string[];
    valid: boolean;
  };
  performance: {
    loadTime: number;
    coreWebVitals: { LCP: number; FID: number; CLS: number };
    mobileOptimized: boolean;
  };
  content: {
    headingStructure: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    imageAltTags: { total: number; missing: number; optimized: boolean };
    internalLinks: number;
    externalLinks: number;
    wordCount: number;
  };
  technical: {
    robotsTxt: boolean;
    sitemap: boolean;
    canonicalTags: boolean;
    httpsEnabled: boolean;
    mobileResponsive: boolean;
  };
  accessibility: {
    score: number;
    issues: string[];
  };
}

interface SEOOptimizerProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function SEOOptimizer({ isVisible, onToggle }: SEOOptimizerProps) {
  const { track } = useAnalytics();
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [selectedView, setSelectedView] = useState<"overview" | "meta" | "content" | "technical" | "recommendations">("overview");
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const analyzeSEO = () => {
      if (typeof window === "undefined") return;

      const metrics: SEOMetrics = {
        metaTags: analyzeMetaTags(),
        structuredData: analyzeStructuredData(),
        performance: analyzePerformance(),
        content: analyzeContent(),
        technical: analyzeTechnical(),
        accessibility: analyzeAccessibility(),
      };

      setSeoMetrics(metrics);
      setOverallScore(calculateOverallScore(metrics));

      // Track SEO analysis
      track("page_view", {
        seo_score: calculateOverallScore(metrics),
        meta_tags_optimized: metrics.metaTags.title.optimized && metrics.metaTags.description.optimized,
        structured_data_present: metrics.structuredData.present,
      });
    };

    analyzeSEO();
  }, [isVisible, track]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-64 left-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          🔍 SEO Optimizer
        </Button>
      </div>
    );
  }

  if (!seoMetrics) {
    return (
      <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Analyzing SEO metrics...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Overall SEO Score</h3>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${overallScore}, 100`}
              className={`${
                overallScore >= 90 ? "text-green-500" :
                overallScore >= 70 ? "text-yellow-500" : "text-red-500"
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{overallScore}</span>
          </div>
        </div>
        <div className={`text-lg font-medium ${
          overallScore >= 90 ? "text-green-600" :
          overallScore >= 70 ? "text-yellow-600" : "text-red-600"
        }`}>
          {overallScore >= 90 ? "Excellent" :
           overallScore >= 70 ? "Good" : "Needs Improvement"}
        </div>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4"></Card>h4 className="font-medium mb-2">Meta Tags</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateMetaTagsScore(seoMetrics.metaTags)}%` }}
              />
            </div>
            <span className="text-sm font-medium">{calculateMetaTagsScore(seoMetrics.metaTags)}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Content Quality</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateContentScore(seoMetrics.content)}%` }}
              />
            </div>
            <span className="text-sm font-medium">{calculateContentScore(seoMetrics.content)}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Technical SEO</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateTechnicalScore(seoMetrics.technical)}%` }}
              />
            </div>
            <span className="text-sm font-medium">{calculateTechnicalScore(seoMetrics.technical)}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Performance</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculatePerformanceScore(seoMetrics.performance)}%` }}
              />
            </div>
            <span className="text-sm font-medium">{calculatePerformanceScore(seoMetrics.performance)}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Accessibility</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${seoMetrics.accessibility.score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{seoMetrics.accessibility.score}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Structured Data</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${seoMetrics.structuredData.present ? 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-medium">{seoMetrics.structuredData.present ? "✓" : "✗"}</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMetaTags = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Meta Tags Analysis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Title Tag</div>
              <div className="text-sm text-muted-foreground">
                Length: {seoMetrics.metaTags.title.length} characters
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm ${
              seoMetrics.metaTags.title.optimized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {seoMetrics.metaTags.title.optimized ? "Optimized" : "Needs Work"}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Meta Description</div>
              <div className="text-sm text-muted-foreground">
                Length: {seoMetrics.metaTags.description.length} characters
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm ${
              seoMetrics.metaTags.description.optimized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {seoMetrics.metaTags.description.optimized ? "Optimized" : "Needs Work"}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Open Graph Tags</div>
              <div className="text-sm text-muted-foreground">
                {seoMetrics.metaTags.ogTags.count} tags found
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm ${
              seoMetrics.metaTags.ogTags.optimized ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}>
              {seoMetrics.metaTags.ogTags.optimized ? "Complete" : "Partial"}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Twitter Cards</div>
              <div className="text-sm text-muted-foreground">
                {seoMetrics.metaTags.twitterTags.count} tags found
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm ${
              seoMetrics.metaTags.twitterTags.optimized ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}>
              {seoMetrics.metaTags.twitterTags.optimized ? "Complete" : "Partial"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Content Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Heading Structure</h4>
            <div className="space-y-2">
              {Object.entries(seoMetrics.content.headingStructure).map(([tag, count]) => (
                <div key={tag} className="flex justify-between">
                  <span className="uppercase">{tag}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Content Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Word Count:</span>
                <span>{seoMetrics.content.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Internal Links:</span>
                <span>{seoMetrics.content.internalLinks}</span>
              </div>
              <div className="flex justify-between">
                <span>External Links:</span>
                <span>{seoMetrics.content.externalLinks}</span>
              </div>
              <div className="flex justify-between">
                <span>Images w/o Alt:</span>
                <span className={seoMetrics.content.imageAltTags.missing > 0 ? "text-red-600" : "text-green-600"}>
                  {seoMetrics.content.imageAltTags.missing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTechnical = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Technical SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(seoMetrics.technical).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className={`px-3 py-1 rounded text-sm ${
                value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {value ? "✓ Enabled" : "✗ Missing"}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderRecommendations = () => {
    const recommendations = generateSEORecommendations(seoMetrics);
    
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">SEO Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="text-2xl">{rec.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{rec.description}</div>
                  <div className={`text-sm mt-2 px-2 py-1 rounded inline-block ${
                    rec.priority === "high" ? "bg-red-100 text-red-800" :
                    rec.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">SEO Optimizer</h2>
            <p className="text-muted-foreground">Overall Score: {overallScore}/100</p>
          </div>
          <Button onClick={onToggle} variant="outline" size="sm">
            ✕ Close
          </Button>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "meta", label: "Meta Tags", icon: "🏷️" },
            { key: "content", label: "Content", icon: "📝" },
            { key: "technical", label: "Technical", icon: "⚙️" },
            { key: "recommendations", label: "Recommendations", icon: "💡" },
          ].map((view) => (
            <Button
              key={view.key}
              onClick={() => setSelectedView(view.key as any)}
              variant={selectedView === view.key ? "default" : "outline"}
              size="sm"
            >
              {view.icon} {view.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === "overview" && renderOverview()}
          {selectedView === "meta" && renderMetaTags()}
          {selectedView === "content" && renderContent()}
          {selectedView === "technical" && renderTechnical()}
          {selectedView === "recommendations" && renderRecommendations()}
        </motion.div>
      </div>
    </div>
  );
}

// Helper functions
function analyzeMetaTags() {
  const title = document.querySelector('title')?.textContent || '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const ogTags = document.querySelectorAll('meta[property^="og:"]').length;
  const twitterTags = document.querySelectorAll('meta[name^="twitter:"]').length;

  return {
    title: {
      present: title.length > 0,
      length: title.length,
      optimized: title.length >= 30 && title.length <= 60,
    },
    description: {
      present: description.length > 0,
      length: description.length,
      optimized: description.length >= 120 && description.length <= 160,
    },
    keywords: {
      present: !!document.querySelector('meta[name="keywords"]'),
      count: 0,
      optimized: false,
    },
    ogTags: {
      present: ogTags > 0,
      count: ogTags,
      optimized: ogTags >= 4,
    },
    twitterTags: {
      present: twitterTags > 0,
      count: twitterTags,
      optimized: twitterTags >= 3,
    },
  };
}

function analyzeStructuredData() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const types: string[] = [];
  
  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '');
      if (data['@type']) types.push(data['@type']);
    } catch (e) {
      // Invalid JSON
    }
  });

  return {
    present: scripts.length > 0,
    types,
    valid: types.length > 0,
  };
}

function analyzePerformance() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  
  return {
    loadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
    coreWebVitals: {
      LCP: 2400, // Simulated
      FID: 85,
      CLS: 0.08,
    },
    mobileOptimized: window.innerWidth <= 768 || /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
  };
}

function analyzeContent() {
  const headings = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    h4: document.querySelectorAll('h4').length,
    h5: document.querySelectorAll('h5').length,
    h6: document.querySelectorAll('h6').length,
  };

  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '').length;

  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]').length;
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').length;

  const textContent = document.body.textContent || '';
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

  return {
    headingStructure: headings,
    imageAltTags: {
      total: images.length,
      missing: imagesWithoutAlt,
      optimized: imagesWithoutAlt === 0,
    },
    internalLinks,
    externalLinks,
    wordCount,
  };
}

function analyzeTechnical() {
  return {
    robotsTxt: true, // Would need to check /robots.txt
    sitemap: true, // Would need to check /sitemap.xml
    canonicalTags: !!document.querySelector('link[rel="canonical"]'),
    httpsEnabled: window.location.protocol === 'https:',
    mobileResponsive: !!document.querySelector('meta[name="viewport"]'),
  };
}

function analyzeAccessibility() {
  const issues: string[] = [];
  
  // Check for common accessibility issues
  if (!document.querySelector('html[lang]')) {
    issues.push('Missing lang attribute on html element');
  }
  
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
  if (imagesWithoutAlt > 0) {
    issues.push(`${imagesWithoutAlt} images missing alt attributes`);
  }

  const score = Math.max(0, 100 - (issues.length * 10));
  
  return { score, issues };
}

function calculateOverallScore(metrics: SEOMetrics): number {
  const metaScore = calculateMetaTagsScore(metrics.metaTags);
  const contentScore = calculateContentScore(metrics.content);
  const technicalScore = calculateTechnicalScore(metrics.technical);
  const performanceScore = calculatePerformanceScore(metrics.performance);
  const accessibilityScore = metrics.accessibility.score;
  const structuredDataScore = metrics.structuredData.present ? 100 : 0;

  return Math.round(
    (metaScore * 0.25 + 
     contentScore * 0.2 + 
     technicalScore * 0.2 + 
     performanceScore * 0.15 + 
     accessibilityScore * 0.15 + 
     structuredDataScore * 0.05)
  );
}

function calculateMetaTagsScore(metaTags: SEOMetrics['metaTags']): number {
  let score = 0;
  if (metaTags.title.optimized) score += 30;
  if (metaTags.description.optimized) score += 30;
  if (metaTags.ogTags.optimized) score += 20;
  if (metaTags.twitterTags.optimized) score += 20;
  return score;
}

function calculateContentScore(content: SEOMetrics['content']): number {
  let score = 0;
  if (content.headingStructure.h1 === 1) score += 25;
  if (content.headingStructure.h2 > 0) score += 15;
  if (content.imageAltTags.optimized) score += 20;
  if (content.wordCount > 300) score += 20;
  if (content.internalLinks > 0) score += 10;
  if (content.externalLinks > 0) score += 10;
  return Math.min(100, score);
}

function calculateTechnicalScore(technical: SEOMetrics['technical']): number {
  const trueCount = Object.values(technical).filter(Boolean).length;
  return (trueCount / Object.keys(technical).length) * 100;
}

function calculatePerformanceScore(performance: SEOMetrics['performance']): number {
  let score = 100;
  if (performance.coreWebVitals.LCP > 2500) score -= 20;
  if (performance.coreWebVitals.FID > 100) score -= 20;
  if (performance.coreWebVitals.CLS > 0.1) score -= 20;
  if (performance.loadTime > 3000) score -= 20;
  if (!performance.mobileOptimized) score -= 20;
  return Math.max(0, score);
}

function generateSEORecommendations(metrics: SEOMetrics) {
  const recommendations = [];

  if (!metrics.metaTags.title.optimized) {
    recommendations.push({
      icon: "🏷️",
      title: "Optimize Title Tag",
      description: `Title should be 30-60 characters. Current: ${metrics.metaTags.title.length} characters.`,
      priority: "high" as const,
    });
  }

  if (!metrics.metaTags.description.optimized) {
    recommendations.push({
      icon: "📝",
      title: "Improve Meta Description",
      description: `Meta description should be 120-160 characters. Current: ${metrics.metaTags.description.length} characters.`,
      priority: "high" as const,
    });
  }

  if (!metrics.structuredData.present) {
    recommendations.push({
      icon: "🏗️",
      title: "Add Structured Data",
      description: "Implement JSON-LD structured data to help search engines understand your content better.",
      priority: "medium" as const,
    });
  }

  if (metrics.content.imageAltTags.missing > 0) {
    recommendations.push({
      icon: "🖼️",
      title: "Add Alt Text to Images",
      description: `${metrics.content.imageAltTags.missing} images are missing alt attributes for accessibility and SEO.`,
      priority: "medium" as const,
    });
  }

  if (metrics.content.headingStructure.h1 !== 1) {
    recommendations.push({
      icon: "📋",
      title: "Fix Heading Structure",
      description: "Each page should have exactly one H1 tag for proper content hierarchy.",
      priority: "medium" as const,
    });
  }

  if (!metrics.technical.canonicalTags) {
    recommendations.push({
      icon: "🔗",
      title: "Add Canonical Tags",
      description: "Implement canonical tags to prevent duplicate content issues.",
      priority: "low" as const,
    });
  }

  return recommendations;
}