"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useTheme } from "@/lib/theme";
import {
  isWebGLSupported,
  getDeviceOptimizations,
  AdaptiveQuality,
  setupWebGLContextLossHandling,
  injectFallbackStyles,
} from "@/lib/webgl-utils";
import { ParticleSystem } from "./ParticleSystem";
import * as THREE from "three";

interface HeroSceneProps {
  className?: string;
  theme?: "dark" | "light" | "neon" | "minimal";
  mousePosition?: { x: number; y: number };
  isLoaded?: boolean;
}

interface MousePosition {
  x: number;
  y: number;
}

// Camera controller component for smooth mouse interaction
function CameraController({ mousePosition }: { mousePosition: MousePosition }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Smooth camera movement based on mouse position
    const { x, y } = mousePosition;

    // Convert mouse position to camera offset
    targetPosition.current.set(
      (x - 0.5) * 2, // X movement range: -1 to 1
      (y - 0.5) * 1, // Y movement range: -0.5 to 0.5
      0
    );

    // Smooth interpolation
    currentPosition.current.lerp(targetPosition.current, delta * 2);

    // Apply to camera position
    camera.position.x = currentPosition.current.x;
    camera.position.y = currentPosition.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Fallback component for non-WebGL devices
function FallbackHero({
  theme,
  className,
}: {
  theme: string;
  className?: string;
}) {
  useEffect(() => {
    injectFallbackStyles();
  }, []);

  const themeGradients = {
    light: "from-blue-400/20 via-purple-400/20 to-pink-400/20",
    dark: "from-blue-600/30 via-purple-600/30 to-pink-600/30",
    neon: "from-pink-500/40 via-purple-500/40 to-cyan-500/40",
    minimal: "from-gray-300/20 via-gray-400/20 to-gray-500/20",
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          themeGradients[theme as keyof typeof themeGradients] ||
          themeGradients.light
        }`}
      >
        {/* Animated geometric shapes fallback */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute shape-fallback opacity-20 ${
                i % 2 === 0 ? "bg-primary/30" : "bg-secondary/30"
              }`}
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
                borderRadius: i % 3 === 0 ? "50%" : "10%",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating particles fallback */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute particle-fallback bg-accent/40 rounded-full"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground/80 mb-2">
            Interactive 3D Experience
          </div>
          <div className="text-sm text-muted-foreground">
            Enhanced for your device
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component
function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <div className="text-sm text-muted-foreground">Loading 3D Scene...</div>
      </div>
    </div>
  );
}

// Main 3D Scene component
function Scene({
  theme,
  mousePosition,
}: {
  theme: string;
  mousePosition: MousePosition;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const adaptiveQuality = useRef(new AdaptiveQuality(60));

  // Theme-based colors
  const themeColors = {
    light: {
      primary: new THREE.Color(0x667eea),
      secondary: new THREE.Color(0x764ba2),
      accent: new THREE.Color(0xf093fb),
    },
    dark: {
      primary: new THREE.Color(0x667eea),
      secondary: new THREE.Color(0x764ba2),
      accent: new THREE.Color(0xf093fb),
    },
    neon: {
      primary: new THREE.Color(0xff006e),
      secondary: new THREE.Color(0x8338ec),
      accent: new THREE.Color(0x3a86ff),
    },
    minimal: {
      primary: new THREE.Color(0x495057),
      secondary: new THREE.Color(0x343a40),
      accent: new THREE.Color(0x6c757d),
    },
  };

  const colors =
    themeColors[theme as keyof typeof themeColors] || themeColors.light;

  useFrame((state, delta) => {
    // Adaptive quality monitoring
    const quality = adaptiveQuality.current.update(
      state.clock.elapsedTime * 1000
    );

    // Basic rotation animation
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * quality;
      meshRef.current.rotation.y += delta * 0.3 * quality;

      // Mouse interaction effect
      const mouseInfluence = 0.1;
      meshRef.current.rotation.x +=
        (mousePosition.y - 0.5) * mouseInfluence * delta;
      meshRef.current.rotation.y +=
        (mousePosition.x - 0.5) * mouseInfluence * delta;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />

      {/* Directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={colors.primary}
      />

      {/* Point light for accent */}
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.6}
        color={colors.accent}
      />

      {/* Particle System with floating geometry */}
      <ParticleSystem
        count={adaptiveQuality.current.getQualityLevel() * 1000}
        theme={theme}
        mousePosition={mousePosition}
        interactive={true}
      />

      {/* Camera controller */}
      <CameraController mousePosition={mousePosition} />
    </>
  );
}

export function HeroScene({
  className,
  theme: propTheme,
  mousePosition: propMousePosition,
  isLoaded,
}: HeroSceneProps) {
  const { theme: contextTheme } = useTheme();
  const theme = propTheme || contextTheme;

  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
  });
  const [isSceneReady, setIsSceneReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Use provided mouse position or track internally
  const finalMousePosition = propMousePosition || mousePosition;

  // WebGL detection
  useEffect(() => {
    const supported = isWebGLSupported();
    setWebglSupported(supported);

    if (!supported) {
      console.warn("WebGL not supported, falling back to CSS animations");
    }
  }, []);

  // Mouse tracking
  useEffect(() => {
    if (!containerRef.current || propMousePosition) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      setMousePosition({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, [propMousePosition]);

  // WebGL context loss handling
  useEffect(() => {
    if (!canvasRef.current || !webglSupported) return;

    const cleanup = setupWebGLContextLossHandling(
      canvasRef.current,
      () => {
        console.warn("WebGL context lost - switching to fallback");
        setWebglSupported(false);
      },
      () => {
        console.log("WebGL context restored");
        setWebglSupported(true);
        setIsSceneReady(false);
      }
    );

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [webglSupported]);

  // Scene ready handler
  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  // Get device optimizations
  const deviceOptimizations = getDeviceOptimizations();

  // Canvas configuration based on device capabilities
  const canvasConfig = {
    antialias: deviceOptimizations.antialiasing,
    alpha: true,
    powerPreference:
      deviceOptimizations.performanceTier === "high"
        ? "high-performance"
        : "default",
    stencil: false,
    depth: true,
  } as const;

  // Loading state
  if (webglSupported === null) {
    return (
      <div ref={containerRef} className={className}>
        <SceneLoader />
      </div>
    );
  }

  // Fallback for non-WebGL devices
  if (!webglSupported) {
    return (
      <div ref={containerRef} className={className}>
        <FallbackHero theme={theme} className="h-full" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Canvas
        ref={canvasRef}
        {...canvasConfig}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={handleSceneReady}
        className="w-full h-full"
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene theme={theme} mousePosition={finalMousePosition} />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <SceneLoader />
        </div>
      )}
    </div>
  );
}
