"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointsMaterial } from "three";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";
import { getDeviceOptimizations } from "@/lib/webgl-utils";

interface EnhancedParticleSystemProps {
  count?: number;
  theme?: "dark" | "light" | "neon" | "minimal";
  mousePosition?: { x: number; y: number };
  interactive?: boolean;
}

export function EnhancedParticleSystem({
  count = 1000,
  theme = "light",
  mousePosition = { x: 0.5, y: 0.5 },
  interactive = true,
}: EnhancedParticleSystemProps) {
  const pointsRef = useRef<THREE.Group>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);

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

  // Generate particle attributes
  const particleAttributes = useMemo(() => {
    const positions = new Float32Array(optimizedCount * 3);
    const colors = new Float32Array(optimizedCount * 3);
    const velocities = new Float32Array(optimizedCount * 3);
    const originalPositions = new Float32Array(optimizedCount * 3);

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

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Random colors from theme palette
      const color = themeColors[
        Math.floor(Math.random() * themeColors.length)
      ] || { r: 1, g: 1, b: 1 };
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return {
      positions,
      colors,
      velocities,
      originalPositions,
    };
  }, [optimizedCount, themeColors]);

  // Store references for animation
  useEffect(() => {
    velocitiesRef.current = particleAttributes.velocities;
    originalPositionsRef.current = particleAttributes.originalPositions;
  }, [particleAttributes]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current.children[0] as THREE.Points;
    if (!points || !points.geometry) return;

    const positionAttribute = points.geometry.attributes.position;
    if (!positionAttribute) return;
    const positions = positionAttribute.array as Float32Array;
    const time = state.clock.elapsedTime;

    // Update particle positions
    if (velocitiesRef.current && originalPositionsRef.current) {
      for (let i = 0; i < optimizedCount; i++) {
        const i3 = i * 3;

        const originalX = originalPositionsRef.current[i3] || 0;
        const originalY = originalPositionsRef.current[i3 + 1] || 0;
        const originalZ = originalPositionsRef.current[i3 + 2] || 0;

        const velX = velocitiesRef.current[i3] || 0;
        const velY = velocitiesRef.current[i3 + 1] || 0;
        const velZ = velocitiesRef.current[i3 + 2] || 0;

        // Floating animation
        const floatX = Math.sin(time * 0.5 + i * 0.1) * 0.5;
        const floatY = Math.cos(time * 0.3 + i * 0.15) * 0.3;
        const floatZ = Math.sin(time * 0.4 + i * 0.2) * 0.4;

        // Mouse interaction
        const mouseX = (mousePosition.x - 0.5) * 20;
        const mouseY = (mousePosition.y - 0.5) * 20;
        const mouseZ = 0;

        let newX = originalX + floatX + velX * time;
        let newY = originalY + floatY + velY * time;
        let newZ = originalZ + floatZ + velZ * time;

        if (interactive) {
          const distanceToMouse = Math.sqrt(
            Math.pow(newX - mouseX, 2) +
              Math.pow(newY - mouseY, 2) +
              Math.pow(newZ - mouseZ, 2)
          );

          if (distanceToMouse < 8) {
            const force = (8 - distanceToMouse) / 8;
            const dirX = (newX - mouseX) / distanceToMouse;
            const dirY = (newY - mouseY) / distanceToMouse;
            const dirZ = (newZ - mouseZ) / distanceToMouse;

            newX += dirX * force * 2;
            newY += dirY * force * 2;
            newZ += dirZ * force * 2;
          }
        }

        // Update positions
        positions[i3] = newX;
        positions[i3 + 1] = newY;
        positions[i3 + 2] = newZ;
      }

      if (points.geometry.attributes.position) {
        points.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Rotate the entire system
    pointsRef.current.rotation.y += delta * 0.1;
    pointsRef.current.rotation.x += delta * 0.05;
  });

  // Material properties based on theme
  const materialProps = useMemo(() => {
    const baseProps = {
      size: deviceOptimizations.performanceTier === "high" ? 4 : 3,
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
    <group ref={pointsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={optimizedCount}
            array={particleAttributes.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={optimizedCount}
            array={particleAttributes.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial {...materialProps} />
      </points>
    </group>
  );
}
