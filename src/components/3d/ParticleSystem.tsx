"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, BufferGeometry } from "three";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";
import { getDeviceOptimizations } from "@/lib/webgl-utils";
import { EnhancedParticleSystem } from "./EnhancedParticleSystem";

interface ParticleSystemProps {
  count?: number;
  theme?: "dark" | "light" | "neon" | "minimal";
  mousePosition?: { x: number; y: number };
  interactive?: boolean;
  className?: string;
}

interface FloatingGeometryProps {
  theme?: "dark" | "light" | "neon" | "minimal";
  mousePosition?: { x: number; y: number };
}

// GPU-accelerated particle system component
function GPUParticleSystem({
  count = 1000,
  theme,
  mousePosition = { x: 0.5, y: 0.5 },
  interactive = true,
}: Omit<ParticleSystemProps, "className">) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointMaterial>(null);
  const velocitiesRef = useRef<Float32Array>();
  const originalPositionsRef = useRef<Float32Array>();
  const mouseInfluenceRef = useRef<Float32Array>();

  const { size } = useThree();
  const deviceOptimizations = getDeviceOptimizations();

  // Adjust particle count based on device performance
  const optimizedCount = Math.min(count, deviceOptimizations.particleCount);

  // Theme-based colors
  const themeColors = useMemo(() => {
    const colorSets = {
      light: [
        new THREE.Color(0x667eea), // Blue
        new THREE.Color(0x764ba2), // Purple
        new THREE.Color(0xf093fb), // Pink
        new THREE.Color(0x4facfe), // Light blue
      ],
      dark: [
        new THREE.Color(0x667eea), // Blue
        new THREE.Color(0x764ba2), // Purple
        new THREE.Color(0xf093fb), // Pink
        new THREE.Color(0x4facfe), // Light blue
      ],
      neon: [
        new THREE.Color(0xff006e), // Hot pink
        new THREE.Color(0x8338ec), // Purple
        new THREE.Color(0x3a86ff), // Blue
        new THREE.Color(0x06ffa5), // Cyan
        new THREE.Color(0xffbe0b), // Yellow
      ],
      minimal: [
        new THREE.Color(0x495057), // Dark gray
        new THREE.Color(0x6c757d), // Medium gray
        new THREE.Color(0x868e96), // Light gray
        new THREE.Color(0xadb5bd), // Lighter gray
      ],
    };
    return colorSets[theme as keyof typeof colorSets] || colorSets.light;
  }, [theme]);

  // Generate particle positions, velocities, and colors
  const { positions, colors, velocities, originalPositions, mouseInfluence } =
    useMemo(() => {
      const positions = new Float32Array(optimizedCount * 3);
      const colors = new Float32Array(optimizedCount * 3);
      const velocities = new Float32Array(optimizedCount * 3);
      const originalPositions = new Float32Array(optimizedCount * 3);
      const mouseInfluence = new Float32Array(optimizedCount);

      for (let i = 0; i < optimizedCount; i++) {
        const i3 = i * 3;

        // Random positions in a sphere
        const radius = Math.random() * 15 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Store original positions for mouse interaction
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;

        // Random velocities
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

        // Random mouse influence strength
        mouseInfluence[i] = Math.random() * 0.5 + 0.5;

        // Random colors from theme palette
        const color =
          themeColors[Math.floor(Math.random() * themeColors.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      return {
        positions,
        colors,
        velocities,
        originalPositions,
        mouseInfluence,
      };
    }, [optimizedCount, themeColors]);

  // Store references for animation
  useEffect(() => {
    velocitiesRef.current = velocities;
    originalPositionsRef.current = originalPositions;
    mouseInfluenceRef.current = mouseInfluence;
  }, [velocities, originalPositions, mouseInfluence]);

  // Animation loop
  useFrame((state, delta) => {
    if (
      !pointsRef.current ||
      !velocitiesRef.current ||
      !originalPositionsRef.current
    )
      return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = state.clock.elapsedTime;

    // Mouse position in 3D space
    const mouseX = (mousePosition.x - 0.5) * 20;
    const mouseY = (mousePosition.y - 0.5) * 20;
    const mouseZ = 0;

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;

      // Get original position and velocity
      const originalX = originalPositionsRef.current[i3];
      const originalY = originalPositionsRef.current[i3 + 1];
      const originalZ = originalPositionsRef.current[i3 + 2];

      const velX = velocitiesRef.current[i3];
      const velY = velocitiesRef.current[i3 + 1];
      const velZ = velocitiesRef.current[i3 + 2];

      // Base floating animation
      const floatX = Math.sin(time * 0.5 + i * 0.1) * 0.5;
      const floatY = Math.cos(time * 0.3 + i * 0.15) * 0.3;
      const floatZ = Math.sin(time * 0.4 + i * 0.2) * 0.4;

      // Calculate new position with floating motion
      let newX = originalX + floatX + velX * time;
      let newY = originalY + floatY + velY * time;
      let newZ = originalZ + floatZ + velZ * time;

      // Mouse interaction
      if (interactive && mouseInfluenceRef.current) {
        const influence = mouseInfluenceRef.current[i];
        const distanceToMouse = Math.sqrt(
          Math.pow(newX - mouseX, 2) +
            Math.pow(newY - mouseY, 2) +
            Math.pow(newZ - mouseZ, 2)
        );

        // Apply mouse repulsion/attraction
        if (distanceToMouse < 8) {
          const force = (8 - distanceToMouse) / 8;
          const dirX = (newX - mouseX) / distanceToMouse;
          const dirY = (newY - mouseY) / distanceToMouse;
          const dirZ = (newZ - mouseZ) / distanceToMouse;

          // Repulsion effect
          newX += dirX * force * influence * 2;
          newY += dirY * force * influence * 2;
          newZ += dirZ * force * influence * 2;
        }
      }

      // Update positions
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = newZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate the entire particle system slowly
    pointsRef.current.rotation.y += delta * 0.1;
    pointsRef.current.rotation.x += delta * 0.05;
  });

  // Material properties based on theme
  const materialProps = useMemo(() => {
    const baseProps = {
      size: deviceOptimizations.performanceTier === "high" ? 3 : 2,
      sizeAttenuation: true,
      transparent: true,
      alphaTest: 0.001,
      vertexColors: true,
    };

    switch (theme) {
      case "neon":
        return {
          ...baseProps,
          opacity: 0.9,
          size: baseProps.size * 1.2,
        };
      case "minimal":
        return {
          ...baseProps,
          opacity: 0.6,
          size: baseProps.size * 0.8,
        };
      case "dark":
        return {
          ...baseProps,
          opacity: 0.8,
        };
      default:
        return {
          ...baseProps,
          opacity: 0.7,
        };
    }
  }, [theme, deviceOptimizations.performanceTier]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={optimizedCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={optimizedCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} {...materialProps} />
    </points>
  );
}

// Floating geometric shapes representing code concepts
function FloatingGeometry({
  theme,
  mousePosition = { x: 0.5, y: 0.5 },
}: FloatingGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<THREE.Mesh[]>([]);

  // Theme-based colors
  const themeColors = useMemo(() => {
    const colorSets = {
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
        secondary: new THREE.Color(0x6c757d),
        accent: new THREE.Color(0x868e96),
      },
    };
    return colorSets[theme as keyof typeof colorSets] || colorSets.light;
  }, [theme]);

  // Create geometric shapes representing code concepts
  const shapes = useMemo(() => {
    const shapeConfigs = [
      // Cube - representing structured data
      {
        geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5),
        position: [3, 2, -2],
        rotation: [0, 0, 0],
        color: themeColors.primary,
        concept: "data-structure",
      },
      // Octahedron - representing algorithms
      {
        geometry: new THREE.OctahedronGeometry(1.2),
        position: [-4, 1, 3],
        rotation: [0, 0, 0],
        color: themeColors.secondary,
        concept: "algorithm",
      },
      // Torus - representing loops and cycles
      {
        geometry: new THREE.TorusGeometry(1, 0.4, 8, 16),
        position: [2, -3, 4],
        rotation: [0, 0, 0],
        color: themeColors.accent,
        concept: "iteration",
      },
      // Icosahedron - representing complexity
      {
        geometry: new THREE.IcosahedronGeometry(1.3),
        position: [-3, -2, -1],
        rotation: [0, 0, 0],
        color: themeColors.primary,
        concept: "complexity",
      },
      // Tetrahedron - representing functions
      {
        geometry: new THREE.TetrahedronGeometry(1.4),
        position: [4, -1, 2],
        rotation: [0, 0, 0],
        color: themeColors.secondary,
        concept: "function",
      },
      // Dodecahedron - representing modules
      {
        geometry: new THREE.DodecahedronGeometry(1.1),
        position: [-2, 3, -3],
        rotation: [0, 0, 0],
        color: themeColors.accent,
        concept: "module",
      },
    ];

    return shapeConfigs;
  }, [themeColors]);

  // Animation loop for floating shapes
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const mouseX = (mousePosition.x - 0.5) * 10;
    const mouseY = (mousePosition.y - 0.5) * 10;

    shapesRef.current.forEach((shape, index) => {
      if (!shape) return;

      const config = shapes[index];
      const [baseX, baseY, baseZ] = config.position;

      // Floating animation
      const floatX = Math.sin(time * 0.3 + index * 0.5) * 0.5;
      const floatY = Math.cos(time * 0.4 + index * 0.7) * 0.3;
      const floatZ = Math.sin(time * 0.2 + index * 0.3) * 0.4;

      // Mouse interaction
      const distanceToMouse = Math.sqrt(
        Math.pow(baseX - mouseX, 2) + Math.pow(baseY - mouseY, 2)
      );

      let mouseInfluenceX = 0;
      let mouseInfluenceY = 0;

      if (distanceToMouse < 6) {
        const influence = (6 - distanceToMouse) / 6;
        const dirX = (baseX - mouseX) / distanceToMouse;
        const dirY = (baseY - mouseY) / distanceToMouse;

        mouseInfluenceX = dirX * influence * 1.5;
        mouseInfluenceY = dirY * influence * 1.5;
      }

      // Update position
      shape.position.set(
        baseX + floatX + mouseInfluenceX,
        baseY + floatY + mouseInfluenceY,
        baseZ + floatZ
      );

      // Rotation animation
      shape.rotation.x += delta * (0.2 + index * 0.1);
      shape.rotation.y += delta * (0.3 + index * 0.05);
      shape.rotation.z += delta * (0.1 + index * 0.08);
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((config, index) => (
        <mesh
          key={index}
          ref={(ref) => {
            if (ref) shapesRef.current[index] = ref;
          }}
          position={config.position as [number, number, number]}
          geometry={config.geometry}
        >
          <meshStandardMaterial
            color={config.color}
            metalness={theme === "neon" ? 0.9 : 0.7}
            roughness={theme === "minimal" ? 0.8 : 0.3}
            transparent
            opacity={theme === "minimal" ? 0.6 : 0.8}
            emissive={
              theme === "neon"
                ? config.color.clone().multiplyScalar(0.2)
                : new THREE.Color(0x000000)
            }
          />
        </mesh>
      ))}
    </group>
  );
}

// Main ParticleSystem component
export function ParticleSystem({
  count = 1000,
  theme,
  mousePosition,
  interactive = true,
  className,
}: ParticleSystemProps) {
  const { theme: contextTheme } = useTheme();
  const finalTheme = theme || contextTheme;
  const deviceOptimizations = getDeviceOptimizations();

  // Use enhanced particle system for high-performance devices
  const useEnhancedSystem = deviceOptimizations.performanceTier === "high";

  return (
    <group>
      {useEnhancedSystem ? (
        <EnhancedParticleSystem
          count={count}
          theme={finalTheme}
          mousePosition={mousePosition}
          interactive={interactive}
        />
      ) : (
        <GPUParticleSystem
          count={Math.min(count, 500)} // Limit particles for lower-end devices
          theme={finalTheme}
          mousePosition={mousePosition}
          interactive={interactive}
        />
      )}
      <FloatingGeometry theme={finalTheme} mousePosition={mousePosition} />
    </group>
  );
}
