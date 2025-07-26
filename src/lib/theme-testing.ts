"use client";

import { Theme, themeConfigs, isValidTheme } from "./theme";
import { validateThemeConfig, getContrastRatio } from "./theme-utils";
import type { ExtendedPerformance } from "../types/performance";

export interface ThemeTestResult {
  theme: Theme;
  passed: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    switchTime?: number;
    renderTime?: number;
    memoryUsage?: number;
  };
  accessibility: {
    contrastRatio: number;
    wcagCompliant: boolean;
  };
}

export interface ThemeTestSuite {
  results: ThemeTestResult[];
  overallPassed: boolean;
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export class ThemeTester {
  private results: ThemeTestResult[] = [];

  async runAllTests(): Promise<ThemeTestSuite> {
    this.results = [];

    for (const theme of Object.keys(themeConfigs) as Theme[]) {
      const result = await this.testTheme(theme);
      this.results.push(result);
    }

    return this.generateSummary();
  }

  async testTheme(theme: Theme): Promise<ThemeTestResult> {
    const result: ThemeTestResult = {
      theme,
      passed: true,
      errors: [],
      warnings: [],
      performance: {},
      accessibility: {
        contrastRatio: 0,
        wcagCompliant: false,
      },
    };

    try {
      // Test theme validity
      await this.testThemeValidity(theme, result);

      // Test theme configuration
      await this.testThemeConfiguration(theme, result);

      // Test accessibility
      await this.testAccessibility(theme, result);

      // Test performance (if in browser)
      if (typeof window !== "undefined") {
        await this.testPerformance(theme, result);
      }

      // Test CSS custom properties
      await this.testCSSProperties(theme, result);

      // Test theme transitions
      await this.testTransitions(theme, result);
    } catch (error) {
      result.errors.push(`Unexpected error: ${error}`);
      result.passed = false;
    }

    result.passed = result.errors.length === 0;
    return result;
  }

  private async testThemeValidity(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    if (!isValidTheme(theme)) {
      result.errors.push(`Invalid theme: ${theme}`);
      return;
    }

    if (!(theme in themeConfigs)) {
      result.errors.push(`Theme configuration missing: ${theme}`);
      return;
    }
  }

  private async testThemeConfiguration(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    const config = themeConfigs[theme];

    if (!validateThemeConfig(config)) {
      result.errors.push(`Invalid theme configuration for ${theme}`);
      return;
    }

    // Test required colors
    const requiredColors = [
      "primary",
      "secondary",
      "background",
      "foreground",
      "accent",
      "muted",
    ];
    for (const color of requiredColors) {
      if (!config.colors[color as keyof typeof config.colors]) {
        result.errors.push(`Missing required color: ${color}`);
      }
    }

    // Test required gradients
    const requiredGradients = ["hero", "primary", "secondary"] as const;
    for (const gradient of requiredGradients) {
      if (!config.gradients[gradient as keyof typeof config.gradients]) {
        result.errors.push(`Missing required gradient: ${gradient}`);
      }
    }

    // Test animation configuration
    if (!config.animations.duration || !config.animations.easing) {
      result.errors.push("Missing animation configuration");
    }

    // Validate duration format
    if (!config.animations.duration.endsWith("s")) {
      result.warnings.push("Animation duration should end with 's'");
    }

    // Validate duration value
    const duration = parseFloat(config.animations.duration.replace("s", ""));
    if (duration > 1) {
      result.warnings.push("Animation duration over 1s may feel slow");
    }
  }

  private async testAccessibility(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    const config = themeConfigs[theme];

    // Test contrast ratios
    const contrastRatio = getContrastRatio(
      config.colors.foreground,
      config.colors.background
    );
    result.accessibility.contrastRatio = contrastRatio;
    result.accessibility.wcagCompliant = contrastRatio >= 4.5;

    if (contrastRatio < 4.5) {
      result.errors.push(
        `Insufficient contrast ratio: ${contrastRatio.toFixed(2)} (minimum 4.5)`
      );
    } else if (contrastRatio < 7) {
      result.warnings.push(
        `Contrast ratio could be improved: ${contrastRatio.toFixed(
          2
        )} (AAA standard is 7.0)`
      );
    }

    // Test primary color contrast
    const primaryContrast = getContrastRatio(
      config.colors.primary,
      config.colors.background
    );
    if (primaryContrast < 3) {
      result.warnings.push(
        `Primary color contrast may be too low: ${primaryContrast.toFixed(2)}`
      );
    }
  }

  private async testPerformance(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Test theme switch performance
      const startTime = performance.now();

      // Simulate theme application
      const root = document.documentElement;
      const originalClass = root.className;

      // Apply theme classes
      root.classList.remove("light", "dark", "theme-neon", "theme-minimal");
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "neon") {
        root.classList.add("theme-neon");
      } else if (theme === "minimal") {
        root.classList.add("theme-minimal");
      }

      // Wait for next frame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const endTime = performance.now();
      result.performance.switchTime = endTime - startTime;

      // Restore original classes
      root.className = originalClass;

      // Performance warnings
      if (result.performance.switchTime > 100) {
        result.warnings.push(
          `Theme switch time is high: ${result.performance.switchTime.toFixed(
            2
          )}ms`
        );
      }

      // Test memory usage if available
      if ("memory" in performance) {
        const memory = (performance as ExtendedPerformance).memory;
        if (memory) {
          result.performance.memoryUsage = Math.round(
            memory.usedJSHeapSize / 1024 / 1024
          );

          if (result.performance.memoryUsage > 100) {
            result.warnings.push(
              `High memory usage: ${result.performance.memoryUsage}MB`
            );
          }
        }
      }
    } catch (error) {
      result.warnings.push(`Performance test failed: ${error}`);
    }
  }

  private async testCSSProperties(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    if (typeof window === "undefined") return;

    const config = themeConfigs[theme];

    try {
      // Test if CSS custom properties are properly set
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      // Test color properties
      for (const [colorName] of Object.entries(config.colors)) {
        const cssValue = computedStyle.getPropertyValue(`--color-${colorName}`);
        if (!cssValue) {
          result.warnings.push(
            `CSS custom property not found: --color-${colorName}`
          );
        }
      }

      // Test gradient properties
      for (const [gradientName] of Object.entries(config.gradients)) {
        const cssValue = computedStyle.getPropertyValue(
          `--gradient-${gradientName}`
        );
        if (!cssValue) {
          result.warnings.push(
            `CSS custom property not found: --gradient-${gradientName}`
          );
        }
      }
    } catch (error) {
      result.warnings.push(`CSS properties test failed: ${error}`);
    }
  }

  private async testTransitions(
    theme: Theme,
    result: ThemeTestResult
  ): Promise<void> {
    const config = themeConfigs[theme];

    // Test transition duration parsing
    try {
      const duration = parseFloat(config.animations.duration.replace("s", ""));
      if (isNaN(duration)) {
        result.errors.push("Invalid animation duration format");
      }
    } catch (error) {
      result.errors.push(`Animation duration parsing failed: ${error}`);
    }

    // Test easing function format
    const easing = config.animations.easing;
    const validEasings = [
      "ease",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "linear",
      "cubic-bezier",
    ];

    const isValidEasing = validEasings.some((valid) =>
      easing.startsWith(valid)
    );
    if (!isValidEasing) {
      result.warnings.push(`Potentially invalid easing function: ${easing}`);
    }
  }

  private generateSummary(): ThemeTestSuite {
    const totalTests = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = totalTests - passed;
    const warnings = this.results.reduce(
      (sum, r) => sum + r.warnings.length,
      0
    );

    return {
      results: this.results,
      overallPassed: failed === 0,
      summary: {
        totalTests,
        passed,
        failed,
        warnings,
      },
    };
  }

  // Utility methods for specific tests
  static async testThemeSwitch(
    fromTheme: Theme,
    toTheme: Theme
  ): Promise<number> {
    if (typeof window === "undefined") return 0;

    const startTime = performance.now();

    // Simulate theme switch
    const root = document.documentElement;
    root.classList.remove("light", "dark", "theme-neon", "theme-minimal");

    if (toTheme === "dark") {
      root.classList.add("dark");
    } else if (toTheme === "neon") {
      root.classList.add("theme-neon");
    } else if (toTheme === "minimal") {
      root.classList.add("theme-minimal");
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));

    return performance.now() - startTime;
  }

  static generateTestReport(suite: ThemeTestSuite): string {
    let report = "# Theme System Test Report\n\n";

    report += `## Summary\n`;
    report += `- Total Tests: ${suite.summary.totalTests}\n`;
    report += `- Passed: ${suite.summary.passed}\n`;
    report += `- Failed: ${suite.summary.failed}\n`;
    report += `- Warnings: ${suite.summary.warnings}\n`;
    report += `- Overall Status: ${
      suite.overallPassed ? "✅ PASSED" : "❌ FAILED"
    }\n\n`;

    for (const result of suite.results) {
      report += `## Theme: ${result.theme}\n`;
      report += `Status: ${result.passed ? "✅ PASSED" : "❌ FAILED"}\n\n`;

      if (result.errors.length > 0) {
        report += `### Errors\n`;
        result.errors.forEach((error) => {
          report += `- ❌ ${error}\n`;
        });
        report += "\n";
      }

      if (result.warnings.length > 0) {
        report += `### Warnings\n`;
        result.warnings.forEach((warning) => {
          report += `- ⚠️ ${warning}\n`;
        });
        report += "\n";
      }

      if (result.performance.switchTime) {
        report += `### Performance\n`;
        report += `- Switch Time: ${result.performance.switchTime.toFixed(
          2
        )}ms\n`;
        if (result.performance.memoryUsage) {
          report += `- Memory Usage: ${result.performance.memoryUsage}MB\n`;
        }
        report += "\n";
      }

      report += `### Accessibility\n`;
      report += `- Contrast Ratio: ${result.accessibility.contrastRatio.toFixed(
        2
      )}\n`;
      report += `- WCAG Compliant: ${
        result.accessibility.wcagCompliant ? "✅" : "❌"
      }\n\n`;
    }

    return report;
  }
}

// Export convenience functions
export async function testAllThemes(): Promise<ThemeTestSuite> {
  const tester = new ThemeTester();
  return await tester.runAllTests();
}

export async function testSingleTheme(theme: Theme): Promise<ThemeTestResult> {
  const tester = new ThemeTester();
  return await tester.testTheme(theme);
}

export function generateThemeTestReport(suite: ThemeTestSuite): string {
  return ThemeTester.generateTestReport(suite);
}
