/**
 * WebGL Detection and Utilities
 * Provides WebGL capability detection and fallback strategies
 */

export interface WebGLCapabilities {
  webgl: boolean;
  webgl2: boolean;
  extensions: {
    floatTextures: boolean;
    depthTexture: boolean;
    textureFilterAnisotropic: boolean;
    vertexArrayObject: boolean;
    instancedArrays: boolean;
  };
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  maxVaryingVectors: number;
  maxVertexAttribs: number;
  maxTextureImageUnits: number;
  maxCombinedTextureImageUnits: number;
  maxVertexTextureImageUnits: number;
  maxRenderbufferSize: number;
  maxViewportDims: [number, number];
  aliasedLineWidthRange: [number, number];
  aliasedPointSizeRange: [number, number];
}

/**
 * Detects WebGL support and capabilities
 */
export function detectWebGLCapabilities(): WebGLCapabilities {
  const canvas = document.createElement("canvas");
  const gl = (canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext | null;

  const capabilities: WebGLCapabilities = {
    webgl: !!gl,
    webgl2: !!gl2,
    extensions: {
      floatTextures: false,
      depthTexture: false,
      textureFilterAnisotropic: false,
      vertexArrayObject: false,
      instancedArrays: false,
    },
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    maxFragmentUniforms: 0,
    maxVaryingVectors: 0,
    maxVertexAttribs: 0,
    maxTextureImageUnits: 0,
    maxCombinedTextureImageUnits: 0,
    maxVertexTextureImageUnits: 0,
    maxRenderbufferSize: 0,
    maxViewportDims: [0, 0],
    aliasedLineWidthRange: [0, 0],
    aliasedPointSizeRange: [0, 0],
  };

  if (!gl) {
    return capabilities;
  }

  // Check extensions
  capabilities.extensions.floatTextures = !!(
    gl.getExtension("OES_texture_float") ||
    gl.getExtension("OES_texture_half_float")
  );

  capabilities.extensions.depthTexture = !!gl.getExtension(
    "WEBGL_depth_texture"
  );

  capabilities.extensions.textureFilterAnisotropic = !!(
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
  );

  capabilities.extensions.vertexArrayObject = !!(
    gl.getExtension("OES_vertex_array_object") || gl2
  );

  capabilities.extensions.instancedArrays = !!(
    gl.getExtension("ANGLE_instanced_arrays") || gl2
  );

  // Get WebGL parameters
  try {
    capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    capabilities.maxVertexUniforms = gl.getParameter(
      gl.MAX_VERTEX_UNIFORM_VECTORS
    );
    capabilities.maxFragmentUniforms = gl.getParameter(
      gl.MAX_FRAGMENT_UNIFORM_VECTORS
    );
    capabilities.maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
    capabilities.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    capabilities.maxTextureImageUnits = gl.getParameter(
      gl.MAX_TEXTURE_IMAGE_UNITS
    );
    capabilities.maxCombinedTextureImageUnits = gl.getParameter(
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    );
    capabilities.maxVertexTextureImageUnits = gl.getParameter(
      gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
    );
    capabilities.maxRenderbufferSize = gl.getParameter(
      gl.MAX_RENDERBUFFER_SIZE
    );
    capabilities.maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    capabilities.aliasedLineWidthRange = gl.getParameter(
      gl.ALIASED_LINE_WIDTH_RANGE
    );
    capabilities.aliasedPointSizeRange = gl.getParameter(
      gl.ALIASED_POINT_SIZE_RANGE
    );
  } catch (error) {
    console.warn("Error getting WebGL parameters:", error);
  }

  return capabilities;
}

/**
 * Simple WebGL support detection
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    return !!gl;
  } catch (error) {
    return false;
  }
}

/**
 * WebGL2 support detection
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    return !!gl2;
  } catch (error) {
    return false;
  }
}

/**
 * Performance tier detection based on WebGL capabilities
 */
export function getPerformanceTier(): "low" | "medium" | "high" {
  if (!isWebGLSupported()) {
    return "low";
  }

  const capabilities = detectWebGLCapabilities();

  // High performance indicators
  if (
    capabilities.webgl2 &&
    capabilities.maxTextureSize >= 4096 &&
    capabilities.extensions.floatTextures &&
    capabilities.extensions.instancedArrays
  ) {
    return "high";
  }

  // Medium performance indicators
  if (
    capabilities.maxTextureSize >= 2048 &&
    capabilities.extensions.floatTextures
  ) {
    return "medium";
  }

  return "low";
}

/**
 * Device-specific optimizations
 */
export function getDeviceOptimizations() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  const isIOS = /ipad|iphone|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isTablet =
    /ipad/.test(userAgent) || (isAndroid && !/mobile/.test(userAgent));

  const performanceTier = getPerformanceTier();

  return {
    isMobile,
    isIOS,
    isAndroid,
    isTablet,
    performanceTier,
    // Recommended settings based on device
    particleCount:
      performanceTier === "high"
        ? 1000
        : performanceTier === "medium"
        ? 500
        : 200,
    shadowQuality:
      performanceTier === "high"
        ? "high"
        : performanceTier === "medium"
        ? "medium"
        : "low",
    antialiasing: performanceTier !== "low",
    postProcessing: performanceTier === "high",
    maxLights:
      performanceTier === "high" ? 8 : performanceTier === "medium" ? 4 : 2,
    textureQuality:
      performanceTier === "high"
        ? 1.0
        : performanceTier === "medium"
        ? 0.75
        : 0.5,
  };
}

/**
 * Memory usage estimation
 */
export function estimateMemoryUsage(
  particleCount: number,
  textureSize: number,
  geometryComplexity: "low" | "medium" | "high"
): number {
  // Rough estimation in MB
  const particleMemory = (particleCount * 32) / (1024 * 1024); // 32 bytes per particle
  const textureMemory = (textureSize * textureSize * 4) / (1024 * 1024); // RGBA

  const geometryMultiplier = {
    low: 1,
    medium: 2,
    high: 4,
  };

  const geometryMemory = 5 * geometryMultiplier[geometryComplexity]; // Base 5MB

  return particleMemory + textureMemory + geometryMemory;
}

/**
 * Adaptive quality settings based on performance monitoring
 */
export class AdaptiveQuality {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private targetFPS = 60;
  private qualityLevel = 1.0;
  private adjustmentCooldown = 0;

  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS;
  }

  update(currentTime: number): number {
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Adjust quality based on performance
      if (this.adjustmentCooldown <= 0) {
        if (this.fps < this.targetFPS * 0.8) {
          // Performance is poor, reduce quality
          this.qualityLevel = Math.max(0.3, this.qualityLevel - 0.1);
          this.adjustmentCooldown = 60; // Wait 60 frames before next adjustment
        } else if (
          this.fps > this.targetFPS * 0.95 &&
          this.qualityLevel < 1.0
        ) {
          // Performance is good, increase quality
          this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
          this.adjustmentCooldown = 120; // Wait longer before increasing
        }
      } else {
        this.adjustmentCooldown--;
      }
    }

    return this.qualityLevel;
  }

  getQualityLevel(): number {
    return this.qualityLevel;
  }

  getFPS(): number {
    return this.fps;
  }

  reset(): void {
    this.qualityLevel = 1.0;
    this.fps = 60;
    this.frameCount = 0;
    this.adjustmentCooldown = 0;
  }
}

/**
 * WebGL context loss handling
 */
export function setupWebGLContextLossHandling(
  canvas: HTMLCanvasElement,
  onContextLost: () => void,
  onContextRestored: () => void
): () => void {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn("WebGL context lost");
    onContextLost();
  };

  const handleContextRestored = () => {
    console.log("WebGL context restored");
    onContextRestored();
  };

  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);

  // Return cleanup function
  return () => {
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);
  };
}

/**
 * Fallback CSS animation styles for non-WebGL devices
 */
export const fallbackAnimations = {
  floatingParticles: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(10px) rotate(240deg); }
    }
    
    .particle-fallback {
      animation: float 6s ease-in-out infinite;
      opacity: 0.6;
    }
    
    .particle-fallback:nth-child(2n) {
      animation-delay: -2s;
      animation-duration: 8s;
    }
    
    .particle-fallback:nth-child(3n) {
      animation-delay: -4s;
      animation-duration: 10s;
    }
  `,

  geometricShapes: `
    @keyframes rotate3d {
      0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
    }
    
    .shape-fallback {
      animation: rotate3d 20s linear infinite;
      transform-style: preserve-3d;
    }
    
    .shape-fallback:nth-child(2n) {
      animation-direction: reverse;
      animation-duration: 15s;
    }
  `,

  mouseInteraction: `
    .interactive-fallback {
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .interactive-fallback:hover {
      transform: scale(1.1) translateZ(20px);
    }
  `,
};

/**
 * Inject fallback CSS animations
 */
export function injectFallbackStyles(): void {
  const styleId = "webgl-fallback-styles";

  // Remove existing styles
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create and inject new styles
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = Object.values(fallbackAnimations).join("\n");
  document.head.appendChild(style);
}
