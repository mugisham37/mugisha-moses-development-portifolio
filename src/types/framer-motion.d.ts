// Framer Motion TypeScript compatibility for Next.js
declare module "framer-motion" {
  import * as React from "react";

  export type Easing = 
    | "linear"
    | "easeIn"
    | "easeOut" 
    | "easeInOut"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "backIn"
    | "backOut"
    | "backInOut"
    | number[]
    | ((t: number) => number);

  export interface Transition {
    type?: "spring" | "keyframes" | "tween" | "inertia" | "just";
    duration?: number;
    delay?: number;
    ease?: Easing;
    repeat?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    repeatDelay?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
    velocity?: number;
    restSpeed?: number;
    restDelta?: number;
    when?: false | "beforeChildren" | "afterChildren" | string;
    delayChildren?: number;
    staggerChildren?: number;
    staggerDirection?: 1 | -1;
    times?: number[];
  }

  export interface MotionValue<T = unknown> {
    get(): T;
    set(value: T): void;
    on(eventName: string, callback: (value: T) => void): () => void;
    onChange(callback: (value: T) => void): () => void;
    onRenderRequest(callback: () => void): () => void;
    stop(): void;
    destroy(): void;
  }

  export interface DragInfo {
    point: { x: number; y: number };
    delta: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
  }

  export interface ViewportOptions {
    root?: React.RefObject<Element>;
    once?: boolean;
    margin?: string;
    amount?: "some" | "all" | number;
  }

  export interface TargetAndTransition {
    x?: string | number | MotionValue<number> | (string | number)[];
    y?: string | number | MotionValue<number> | (string | number)[];
    z?: string | number | MotionValue<number> | (string | number)[];
    scale?: number | MotionValue<number> | number[];
    scaleX?: number | MotionValue<number> | number[];
    scaleY?: number | MotionValue<number> | number[];
    rotate?: string | number | MotionValue<number> | (string | number)[];
    rotateX?: string | number | MotionValue<number> | (string | number)[];
    rotateY?: string | number | MotionValue<number> | (string | number)[];
    rotateZ?: string | number | MotionValue<number> | (string | number)[];
    skew?: string | number | MotionValue<number> | (string | number)[];
    skewX?: string | number | MotionValue<number> | (string | number)[];
    skewY?: string | number | MotionValue<number> | (string | number)[];
    opacity?: number | MotionValue<number> | number[];
    backgroundColor?: string | MotionValue<string> | string[];
    color?: string | MotionValue<string> | string[];
    borderRadius?: string | number | MotionValue<string | number> | (string | number)[];
    borderTopLeftRadius?: string | number | MotionValue<string | number> | (string | number)[];
    borderTopRightRadius?: string | number | MotionValue<string | number> | (string | number)[];
    borderBottomLeftRadius?: string | number | MotionValue<string | number> | (string | number)[];
    borderBottomRightRadius?: string | number | MotionValue<string | number> | (string | number)[];
    width?: string | number | MotionValue<string | number> | (string | number)[];
    height?: string | number | MotionValue<string | number> | (string | number)[];
    top?: string | number | MotionValue<string | number> | (string | number)[];
    left?: string | number | MotionValue<string | number> | (string | number)[];
    bottom?: string | number | MotionValue<string | number> | (string | number)[];
    right?: string | number | MotionValue<string | number> | (string | number)[];
    transition?: Transition;
    transitionEnd?: Partial<Record<string, string | number>>;
    [key: string]: unknown;
  }

  export interface Variants {
    [key: string]: TargetAndTransition;
  }

  export interface AnimationControls {
    start: (definition?: string | TargetAndTransition) => Promise<void>;
    stop: () => void;
    set: (definition: TargetAndTransition) => void;
    mount: () => () => void;
  }

  export interface MotionProps extends Omit<React.HTMLAttributes<Element>, "onDrag" | "onDragStart" | "onDragEnd"> {
    initial?: boolean | string | TargetAndTransition;
    animate?: string | TargetAndTransition | AnimationControls;
    exit?: string | TargetAndTransition;
    variants?: Variants;
    transition?: Transition;
    whileHover?: string | TargetAndTransition;
    whileTap?: string | TargetAndTransition;
    whileFocus?: string | TargetAndTransition;
    whileDrag?: string | TargetAndTransition;
    whileInView?: string | TargetAndTransition;
    drag?: boolean | "x" | "y";
    dragConstraints?: false | { top?: number; left?: number; right?: number; bottom?: number } | React.RefObject<Element>;
    dragElastic?: boolean | number;
    dragMomentum?: boolean;
    dragPropagation?: boolean;
    dragTransition?: Transition;
    layout?: boolean | "position" | "size";
    layoutId?: string;
    layoutDependency?: React.DependencyList;
    onDragStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => void;
    onDrag?: (event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => void;
    onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => void;
    onAnimationStart?: (definition: string | TargetAndTransition) => void;
    onAnimationComplete?: (definition: string | TargetAndTransition) => void;
    onUpdate?: (latest: TargetAndTransition) => void;
    onViewportEnter?: (entry?: IntersectionObserverEntry) => void;
    onViewportLeave?: (entry?: IntersectionObserverEntry) => void;
    viewport?: ViewportOptions;
    style?: React.CSSProperties;
  }

  export interface HTMLMotionProps<T extends keyof React.ReactHTML>
    extends Omit<React.ComponentPropsWithoutRef<T>, keyof MotionProps>, MotionProps {
    disabled?: boolean;
  }

  export interface SVGMotionProps<T extends keyof React.ReactSVG>
    extends Omit<React.ComponentPropsWithoutRef<T>, keyof MotionProps>, MotionProps {
    strokeWidth?: string | number;
    strokeLinecap?: "butt" | "round" | "square";
    fill?: string;
    d?: string;
  }

  export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;

  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    mode?: "wait" | "sync" | "popLayout";
    onExitComplete?: () => void;
    custom?: string | number | object;
    presenceAffectsLayout?: boolean;
  }

  // Motion components with proper typing
  export const motion: {
    div: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<"div">>;
    button: ForwardRefComponent<HTMLButtonElement, HTMLMotionProps<"button">>;
    span: ForwardRefComponent<HTMLSpanElement, HTMLMotionProps<"span">>;
    p: ForwardRefComponent<HTMLParagraphElement, HTMLMotionProps<"p">>;
    h1: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h1">>;
    h2: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h2">>;
    h3: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h3">>;
    h4: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h4">>;
    h5: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h5">>;
    h6: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<"h6">>;
    a: ForwardRefComponent<HTMLAnchorElement, HTMLMotionProps<"a">>;
    img: ForwardRefComponent<HTMLImageElement, HTMLMotionProps<"img">>;
    section: ForwardRefComponent<HTMLElement, HTMLMotionProps<"section">>;
    article: ForwardRefComponent<HTMLElement, HTMLMotionProps<"article">>;
    header: ForwardRefComponent<HTMLElement, HTMLMotionProps<"header">>;
    footer: ForwardRefComponent<HTMLElement, HTMLMotionProps<"footer">>;
    nav: ForwardRefComponent<HTMLElement, HTMLMotionProps<"nav">>;
    main: ForwardRefComponent<HTMLElement, HTMLMotionProps<"main">>;
    aside: ForwardRefComponent<HTMLElement, HTMLMotionProps<"aside">>;
    ul: ForwardRefComponent<HTMLUListElement, HTMLMotionProps<"ul">>;
    ol: ForwardRefComponent<HTMLOListElement, HTMLMotionProps<"ol">>;
    li: ForwardRefComponent<HTMLLIElement, HTMLMotionProps<"li">>;
    form: ForwardRefComponent<HTMLFormElement, HTMLMotionProps<"form">>;
    input: ForwardRefComponent<HTMLInputElement, HTMLMotionProps<"input">>;
    textarea: ForwardRefComponent<HTMLTextAreaElement, HTMLMotionProps<"textarea">>;
    select: ForwardRefComponent<HTMLSelectElement, HTMLMotionProps<"select">>;
    path: ForwardRefComponent<SVGPathElement, SVGMotionProps<"path">>;
    svg: ForwardRefComponent<SVGSVGElement, SVGMotionProps<"svg">>;
    circle: ForwardRefComponent<SVGCircleElement, SVGMotionProps<"circle">>;
    rect: ForwardRefComponent<SVGRectElement, SVGMotionProps<"rect">>;
    line: ForwardRefComponent<SVGLineElement, SVGMotionProps<"line">>;
    polyline: ForwardRefComponent<SVGPolylineElement, SVGMotionProps<"polyline">>;
    polygon: ForwardRefComponent<SVGPolygonElement, SVGMotionProps<"polygon">>;
    ellipse: ForwardRefComponent<SVGEllipseElement, SVGMotionProps<"ellipse">>;
    g: ForwardRefComponent<SVGGElement, SVGMotionProps<"g">>;
  };

  export const AnimatePresence: React.FC<AnimatePresenceProps>;

  // Hook and function exports
  export function useAnimation(): AnimationControls;
  export function useAnimationControls(): AnimationControls;
  export function useCycle<T>(...items: T[]): [T, () => void];
  export function useMotionValue<T>(initial: T): MotionValue<T>;
  export function useScroll(options?: { container?: React.RefObject<Element>; target?: React.RefObject<Element>; offset?: string[] }): { scrollX: MotionValue<number>; scrollY: MotionValue<number>; scrollXProgress: MotionValue<number>; scrollYProgress: MotionValue<number> };
  export function useSpring(source: MotionValue<number> | number, config?: { stiffness?: number; damping?: number; mass?: number }): MotionValue<number>;
  export function useTransform<T>(input: MotionValue<number> | MotionValue<number>[], inputRange: number[], outputRange: T[]): MotionValue<T>;
  export function useInView(options?: ViewportOptions): boolean;
  export function useDragControls(): { start: (event: React.PointerEvent, options?: { snapToCursor?: boolean }) => void };
  export function useAnimate(): [React.RefObject<Element>, (target: TargetAndTransition, options?: Transition) => Promise<void>];
  export function usePresence(): [boolean, () => void];
  export function useIsPresent(): boolean;

  export function animate(from: TargetAndTransition, to: TargetAndTransition, options?: Transition): void;
  export function stagger(duration: number, options?: { startDelay?: number; from?: number | "first" | "last" | "center" }): number;

  export const MotionConfig: React.FC<{
    children: React.ReactNode;
    transition?: Transition;
    reducedMotion?: "always" | "never" | "user";
    transformPagePoint?: (point: { x: number; y: number }) => { x: number; y: number };
  }>;

  export const LazyMotion: React.FC<{
    children: React.ReactNode;
    features: () => Promise<{ default: object }>;
    strict?: boolean;
  }>;

  export const LayoutGroup: React.FC<{
    children: React.ReactNode;
    id?: string;
  }>;

  export const domAnimation: () => Promise<{ default: object }>;
  export const domMax: () => Promise<{ default: object }>;
}
