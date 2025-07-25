import { useEffect, useState, useRef, RefObject } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export interface UseMousePositionOptions {
  normalize?: boolean; // Normalize to 0-1 range
  smooth?: boolean; // Apply smoothing
  smoothingFactor?: number; // Smoothing factor (0-1)
  resetOnLeave?: boolean; // Reset to center when mouse leaves
  resetPosition?: MousePosition; // Position to reset to
}

export function useMousePosition(
  elementRef?: RefObject<HTMLElement>,
  options: UseMousePositionOptions = {}
) {
  const {
    normalize = true,
    smooth = false,
    smoothingFactor = 0.1,
    resetOnLeave = true,
    resetPosition = { x: 0.5, y: 0.5 },
  } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>(
    normalize ? resetPosition : { x: 0, y: 0 }
  );

  const smoothPositionRef = useRef<MousePosition>(mousePosition);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const element = elementRef?.current || document;
    const isDocument = element === document;

    const updateSmoothPosition = () => {
      setMousePosition((current) => {
        const target = smoothPositionRef.current;
        const newX = current.x + (target.x - current.x) * smoothingFactor;
        const newY = current.y + (target.y - current.y) * smoothingFactor;

        return { x: newX, y: newY };
      });

      if (smooth) {
        animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      let x: number, y: number;

      if (isDocument) {
        x = event.clientX;
        y = event.clientY;

        if (normalize) {
          x = x / window.innerWidth;
          y = y / window.innerHeight;
        }
      } else {
        const rect = (element as HTMLElement).getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;

        if (normalize) {
          x = x / rect.width;
          y = y / rect.height;
          // Clamp to 0-1 range
          x = Math.max(0, Math.min(1, x));
          y = Math.max(0, Math.min(1, y));
        }
      }

      const newPosition = { x, y };

      if (smooth) {
        smoothPositionRef.current = newPosition;
        if (!animationFrameRef.current) {
          updateSmoothPosition();
        }
      } else {
        setMousePosition(newPosition);
      }
    };

    const handleMouseLeave = () => {
      if (resetOnLeave) {
        const targetPosition = normalize ? resetPosition : { x: 0, y: 0 };

        if (smooth) {
          smoothPositionRef.current = targetPosition;
        } else {
          setMousePosition(targetPosition);
        }
      }
    };

    // Add event listeners
    element.addEventListener("mousemove", handleMouseMove as EventListener);

    if (!isDocument) {
      (element as HTMLElement).addEventListener("mouseleave", handleMouseLeave);
    }

    // Start smooth animation if enabled
    if (smooth) {
      updateSmoothPosition();
    }

    return () => {
      // Remove event listeners
      element.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );

      if (!isDocument) {
        (element as HTMLElement).removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    elementRef,
    normalize,
    smooth,
    smoothingFactor,
    resetOnLeave,
    resetPosition,
  ]);

  return mousePosition;
}

// Specialized hook for 3D scenes
export function use3DMousePosition(elementRef?: RefObject<HTMLElement>) {
  return useMousePosition(elementRef, {
    normalize: true,
    smooth: true,
    smoothingFactor: 0.05,
    resetOnLeave: true,
    resetPosition: { x: 0.5, y: 0.5 },
  });
}

// Hook for getting mouse velocity
export function useMouseVelocity(elementRef?: RefObject<HTMLElement>) {
  const mousePosition = useMousePosition(elementRef);
  const [velocity, setVelocity] = useState<MousePosition>({ x: 0, y: 0 });
  const previousPosition = useRef<MousePosition>(mousePosition);
  const previousTime = useRef<number>(Date.now());

  useEffect(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - previousTime.current;

    if (deltaTime > 0) {
      const deltaX = mousePosition.x - previousPosition.current.x;
      const deltaY = mousePosition.y - previousPosition.current.y;

      setVelocity({
        x: deltaX / deltaTime,
        y: deltaY / deltaTime,
      });
    }

    previousPosition.current = mousePosition;
    previousTime.current = currentTime;
  }, [mousePosition]);

  return velocity;
}
