/**
 * Performance API memory interface
 */
export interface PerformanceMemory {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

/**
 * Extended Performance interface with memory property
 */
export interface ExtendedPerformance extends Performance {
  readonly memory?: PerformanceMemory;
}

/**
 * Function with specific arguments and return type constraints
 */
export type CallableFunction<
  Args extends readonly unknown[] = readonly unknown[],
  Return = unknown
> = (...args: Args) => Return;

/**
 * Error with possible unknown type
 */
export type ErrorLike = Error | unknown;

/**
 * Document execCommand return type
 */
export interface DocumentWithExecCommand extends Document {
  execCommand(commandId: string): boolean;
}

/**
 * Theme testing types
 */
export interface ThemeTestMetrics {
  switchTime?: number;
  renderTime?: number;
  memoryUsage?: number;
}

export interface AccessibilityMetrics {
  contrastRatio: number;
  wcagCompliant: boolean;
}
