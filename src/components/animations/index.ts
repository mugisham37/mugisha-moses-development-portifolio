// Animation Components Barrel Export
export {
  default as ScrollAnimation,
  useScrollAnimation,
  ParallaxScroll,
  RevealText,
  StaggerWrapper,
} from "./ScrollAnimations";
export {
  default as PageTransition,
  RouteTransition,
  LoadingTransition,
  ModalTransition,
  DrawerTransition,
  AccordionTransition,
} from "./PageTransitions";
export {
  default as MicroInteractions,
  Magnetic,
  Tilt,
  Ripple,
  Floating,
  Pulse,
  Shake,
  Glow,
  Morph,
  Typewriter,
  ParallaxMouse,
} from "./MicroInteractions";

// Animation utilities and configurations
export * from "@/lib/animations";
export * from "@/lib/animation-config";
