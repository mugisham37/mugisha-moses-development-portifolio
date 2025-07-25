/**
 * Webpack configuration types for Next.js
 */

// Simple plugin interface for webpack
export interface WebpackPlugin {
  apply: (compiler: unknown) => void;
}

export interface NextWebpackConfig {
  plugins: WebpackPlugin[];
  resolve?: {
    alias?: Record<string, string>;
    fallback?: Record<string, string | false>;
  };
  module?: {
    rules?: unknown[];
  };
  optimization?: Record<string, unknown>;
  entry?: string | string[] | Record<string, string>;
  output?: Record<string, unknown>;
}

export interface BundleAnalyzerOptions {
  enabled: boolean;
  analyzerMode?: 'server' | 'static' | 'json' | 'disabled';
  analyzerPort?: number;
  openAnalyzer?: boolean;
  generateStatsFile?: boolean;
  statsFilename?: string;
  logLevel?: 'info' | 'warn' | 'error' | 'silent';
}

export interface NextBundleAnalyzer {
  new (options: BundleAnalyzerOptions): WebpackPlugin;
}
