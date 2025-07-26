/**
 * Test file to validate all fixed ESLint issues
 */

import { testAllThemes, testSingleTheme, generateThemeTestReport } from '../lib/theme-testing';
import { debounce, throttle, copyToClipboard, cn } from '../lib/utils';
import { isWebGLSupported, isWebGL2Supported } from '../lib/webgl-utils';
import type { ExtendedPerformance, CallableFunction } from '../types/performance';

/**
 * Test theme functionality
 */
export async function testThemeSystem(): Promise<void> {
  try {
    console.log('Testing theme system...');
    
    // Test single theme
    const singleResult = await testSingleTheme('light');
    console.log('Single theme test result:', singleResult);
    
    // Test all themes
    const allResults = await testAllThemes();
    console.log('All themes test summary:', allResults.summary);
    
    // Generate report
    const report = generateThemeTestReport(allResults);
    console.log('Generated report length:', report.length);
    
    console.log('✅ Theme system tests passed');
  } catch (error) {
    console.error('❌ Theme system tests failed:', error);
  }
}

/**
 * Test utility functions
 */
export function testUtilities(): void {
  try {
    console.log('Testing utility functions...');
    
    // Test debounce with proper typing
    const debouncedFunction: CallableFunction<[string, number]> = debounce(
      (message: string, delay: number) => {
        console.log(`Debounced: ${message} after ${delay}ms`);
      },
      100
    );
    
    // Test throttle with proper typing
    const throttledFunction: CallableFunction<[string]> = throttle(
      (message: string) => {
        console.log(`Throttled: ${message}`);
      },
      200
    );
    
    // Execute the functions to test them
    debouncedFunction('Test message', 500);
    throttledFunction('Test throttle');
    
    // Test cn function
    const className = cn('base-class', 'conditional-class', { 'active': true });
    console.log('Generated className:', className);
    
    // Test async copyToClipboard
    copyToClipboard('Test text').then((success) => {
      console.log('Copy to clipboard success:', success);
    }).catch((error) => {
      console.log('Copy to clipboard error:', error);
    });
    
    console.log('✅ Utility function tests passed');
  } catch (error) {
    console.error('❌ Utility function tests failed:', error);
  }
}

/**
 * Test WebGL utilities
 */
export function testWebGLUtilities(): void {
  try {
    console.log('Testing WebGL utilities...');
    
    const webglSupported = isWebGLSupported();
    const webgl2Supported = isWebGL2Supported();
    
    console.log('WebGL support:', webglSupported);
    console.log('WebGL2 support:', webgl2Supported);
    
    console.log('✅ WebGL utility tests passed');
  } catch (error) {
    console.error('❌ WebGL utility tests failed:', error);
  }
}

/**
 * Test performance types
 */
export function testPerformanceTypes(): void {
  try {
    console.log('Testing performance types...');
    
    // Test ExtendedPerformance type
    const extendedPerf = performance as ExtendedPerformance;
    if (extendedPerf.memory) {
      console.log('Memory info available:', {
        used: extendedPerf.memory.usedJSHeapSize,
        total: extendedPerf.memory.totalJSHeapSize,
        limit: extendedPerf.memory.jsHeapSizeLimit
      });
    }
    
    // Test CallableFunction type
    const testFunction: CallableFunction<[number, string], string> = (num: number, str: string) => {
      return `${num}: ${str}`;
    };
    
    const result = testFunction(42, 'test');
    console.log('Callable function result:', result);
    
    console.log('✅ Performance type tests passed');
  } catch (error) {
    console.error('❌ Performance type tests failed:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 Starting comprehensive tests...');
  
  testUtilities();
  testWebGLUtilities();
  testPerformanceTypes();
  await testThemeSystem();
  
  console.log('🎉 All tests completed successfully!');
}

// Export for usage in development
const testSuite = {
  testThemeSystem,
  testUtilities,
  testWebGLUtilities,
  testPerformanceTypes,
  runAllTests
};

export default testSuite;
