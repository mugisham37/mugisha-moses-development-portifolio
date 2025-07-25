"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Button } from "./Button";
import { getContrastRatio, isAccessibleContrast } from "@/lib/theme-utils";
import { testSingleTheme, ThemeTestResult } from "@/lib/theme-testing";

interface AccessibilityReport {
  contrastRatios: {
    foregroundBackground: number;
    primaryBackground: number;
    secondaryBackground: number;
    mutedBackground: number;
  };
  wcagCompliance: {
    aa: boolean;
    aaa: boolean;
  };
  recommendations: string[];
  score: number;
}

interface ThemeAccessibilityCheckerProps {
  className?: string;
  autoCheck?: boolean;
}

export function ThemeAccessibilityChecker({
  className = "",
  autoCheck = true,
}: ThemeAccessibilityCheckerProps) {
  const { theme, config } = useTheme();
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [testResult, setTestResult] = useState<ThemeTestResult | null>(null);

  const checkAccessibility = async () => {
    setIsChecking(true);

    try {
      // Run theme test
      const result = await testSingleTheme(theme);
      setTestResult(result);

      // Calculate contrast ratios
      const contrastRatios = {
        foregroundBackground: getContrastRatio(
          config.colors.foreground,
          config.colors.background
        ),
        primaryBackground: getContrastRatio(
          config.colors.primary,
          config.colors.background
        ),
        secondaryBackground: getContrastRatio(
          config.colors.secondary,
          config.colors.background
        ),
        mutedBackground: getContrastRatio(
          config.colors.muted,
          config.colors.background
        ),
      };

      // Check WCAG compliance
      const wcagCompliance = {
        aa: contrastRatios.foregroundBackground >= 4.5,
        aaa: contrastRatios.foregroundBackground >= 7.0,
      };

      // Generate recommendations
      const recommendations: string[] = [];

      if (contrastRatios.foregroundBackground < 4.5) {
        recommendations.push(
          "Increase contrast between text and background colors"
        );
      }

      if (contrastRatios.primaryBackground < 3.0) {
        recommendations.push(
          "Primary color may be too subtle against background"
        );
      }

      if (!wcagCompliance.aa) {
        recommendations.push(
          "Consider adjusting colors to meet WCAG AA standards"
        );
      }

      if (theme === "neon" && contrastRatios.foregroundBackground > 15) {
        recommendations.push(
          "Very high contrast may cause eye strain - consider reducing"
        );
      }

      // Calculate accessibility score (0-100)
      let score = 0;
      score += Math.min((contrastRatios.foregroundBackground / 7) * 40, 40); // Max 40 points
      score += Math.min((contrastRatios.primaryBackground / 4.5) * 20, 20); // Max 20 points
      score += wcagCompliance.aa ? 30 : 0; // 30 points for AA compliance
      score += wcagCompliance.aaa ? 10 : 0; // 10 bonus points for AAA compliance

      const accessibilityReport: AccessibilityReport = {
        contrastRatios,
        wcagCompliance,
        recommendations,
        score: Math.round(score),
      };

      setReport(accessibilityReport);
    } catch (error) {
      console.error("Accessibility check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      checkAccessibility();
    }
  }, [theme, autoCheck]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <Card className={`w-full ${className}`} variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Accessibility Checker</CardTitle>
          <Button
            onClick={checkAccessibility}
            loading={isChecking}
            size="sm"
            variant="outline"
          >
            {isChecking ? "Checking..." : "Check Again"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyze theme accessibility and WCAG compliance
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {report && (
          <>
            {/* Accessibility Score */}
            <div className="text-center space-y-2">
              <div className="relative w-24 h-24 mx-auto">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-muted stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className={`stroke-current ${getScoreColor(report.score)}`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${report.score} 100` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      report.score
                    )}`}
                  >
                    {report.score}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className={`text-lg font-semibold ${getScoreColor(
                    report.score
                  )}`}
                >
                  {getScoreLabel(report.score)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Accessibility Score
                </div>
              </div>
            </div>

            {/* WCAG Compliance */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border ${
                  report.wcagCompliance.aa
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      report.wcagCompliance.aa
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {report.wcagCompliance.aa ? "✅" : "❌"}
                  </span>
                  <span className="font-medium">WCAG AA</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum contrast 4.5:1
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  report.wcagCompliance.aaa
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      report.wcagCompliance.aaa
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {report.wcagCompliance.aaa ? "✅" : "⚠️"}
                  </span>
                  <span className="font-medium">WCAG AAA</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Enhanced contrast 7:1
                </div>
              </div>
            </div>

            {/* Contrast Ratios */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Contrast Ratios</h4>
              <div className="space-y-2">
                {Object.entries(report.contrastRatios).map(([key, ratio]) => (
                  <ContrastRatioBar
                    key={key}
                    label={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    ratio={ratio}
                    isCompliant={ratio >= 4.5}
                  />
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <div className="space-y-2">
                  {report.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                        💡
                      </span>
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        {recommendation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Samples */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Color Samples</h4>
              <div className="grid grid-cols-2 gap-4">
                <ColorSample
                  label="Text on Background"
                  foreground={config.colors.foreground}
                  background={config.colors.background}
                  ratio={report.contrastRatios.foregroundBackground}
                />
                <ColorSample
                  label="Primary on Background"
                  foreground={config.colors.primary}
                  background={config.colors.background}
                  ratio={report.contrastRatios.primaryBackground}
                />
              </div>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Test Results</h4>
                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Status</span>
                    <span
                      className={`text-sm font-medium ${
                        testResult.passed
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {testResult.passed ? "✅ Passed" : "❌ Failed"}
                    </span>
                  </div>

                  {testResult.errors.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Errors: {testResult.errors.length}
                    </div>
                  )}

                  {testResult.warnings.length > 0 && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Warnings: {testResult.warnings.length}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!report && !isChecking && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              Click &quot;Check Again&quot; to analyze accessibility
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ContrastRatioBarProps {
  label: string;
  ratio: number;
  isCompliant: boolean;
}

function ContrastRatioBar({
  label,
  ratio,
  isCompliant,
}: ContrastRatioBarProps) {
  const percentage = Math.min((ratio / 10) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span
          className={`font-mono ${
            isCompliant
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {ratio.toFixed(2)}:1
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${
            isCompliant ? "bg-green-500" : "bg-red-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface ColorSampleProps {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
}

function ColorSample({
  label,
  foreground,
  background,
  ratio,
}: ColorSampleProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium">{label}</div>
      <div
        className="p-3 rounded border text-center"
        style={{
          backgroundColor: background,
          color: foreground,
          borderColor: foreground + "20",
        }}
      >
        <div className="font-medium">Sample Text</div>
        <div className="text-xs opacity-80">Ratio: {ratio.toFixed(2)}:1</div>
      </div>
    </div>
  );
}

export default ThemeAccessibilityChecker;
