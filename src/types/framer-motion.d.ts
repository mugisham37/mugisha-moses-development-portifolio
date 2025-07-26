// Fix for framer-motion TypeScript compatibility
declare module "framer-motion" {
  import * as React from "react";

  export interface Transition {
    type?: "spring" | "keyframes" | "tween" | "inertia";
    duration?: number;
    delay?: number;
    ease?: string | number[] | "linear" | "easeIn" | "easeOut" | "easeInOut";
    repeat?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    repeatDelay?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
    when?: false | "beforeChildren" | "afterChildren" | string;
    delayChildren?: number;
    staggerChildren?: number;
    staggerDirection?: 1 | -1;
  }

  export interface Variants {
    [key: string]: {
      x?: string | number | number[];
      y?: string | number | number[];
      scale?: number | number[];
      scaleX?: number | number[];
      scaleY?: number | number[];
      rotate?: string | number | number[];
      rotateX?: string | number | number[];
      rotateY?: string | number | number[];
      rotateZ?: string | number | number[];
      opacity?: number | number[];
      backgroundColor?: string | string[];
      color?: string | string[];
      borderRadius?: string | number | number[];
      width?: string | number | number[];
      height?: string | number | number[];
      transition?: Transition;
      [key: string]: unknown;
    };
  }

  export interface MotionProps {
    initial?: string | boolean | object;
    animate?: string | object;
    exit?: string | object;
    variants?: Variants;
    transition?: Transition;
    whileHover?: string | object;
    whileTap?: string | object;
    whileFocus?: string | object;
    whileDrag?: string | object;
    whileInView?: string | object;
    drag?: boolean | "x" | "y";
    layout?: boolean | "position" | "size";
    layoutId?: string;
    style?: React.CSSProperties;
  }

  export interface HTMLMotionProps<T extends keyof React.ReactHTML>
    extends React.ComponentPropsWithoutRef<T> {
    children?: React.ReactNode;
    initial?: string | boolean | object;
    animate?: string | object;
    exit?: string | object;
    variants?: Variants;
    transition?: Transition;
    whileHover?: string | object;
    whileTap?: string | object;
    whileFocus?: string | object;
    whileDrag?: string | object;
    whileInView?: string | object;
    drag?: boolean | "x" | "y";
    layout?: boolean | "position" | "size";
    layoutId?: string;
  }

  export interface MotionComponent<T extends keyof React.ReactHTML> {
    (props: HTMLMotionProps<T>): JSX.Element;
  }

  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    mode?: "wait" | "sync" | "popLayout";
    onExitComplete?: () => void;
  }

  export const motion: {
    [K in keyof React.ReactHTML]: MotionComponent<K>;
  };

  export const AnimatePresence: React.FC<AnimatePresenceProps>;

  // Export other commonly used functions with minimal typing
  export function useAnimation(): unknown;
  export function useAnimationControls(): unknown;
  export function useCycle<T>(...items: T[]): [T, () => void];
  export function useMotionValue(initial: unknown): unknown;
  export function useScroll(options?: object): unknown;
  export function useSpring(source: unknown, config?: object): unknown;
  export function useTransform(input: unknown, inputRange: unknown, outputRange: unknown): unknown;
  export function useInView(options?: object): unknown;
  export function useDragControls(): unknown;
  export function useAnimate(): unknown[];

  export function animate(from: unknown, to: unknown, options?: Transition): unknown;
  export function stagger(duration: number, options?: { startDelay?: number }): unknown;

  export const MotionConfig: React.FC<{
    children: React.ReactNode;
    transition?: Transition;
    reducedMotion?: "always" | "never" | "user";
  }>;

  export const LazyMotion: React.FC<{
    children: React.ReactNode;
    features: unknown;
    strict?: boolean;
  }>;

  export const LayoutGroup: React.FC<{
    children: React.ReactNode;
    id?: string;
  }>;
}
