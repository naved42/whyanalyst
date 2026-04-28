// Optimized animation configuration for better performance
export const animationConfig = {
  // Reduced easing for faster feels
  fast: {
    duration: 0.15,
    ease: [0.34, 1.56, 0.64, 1],
  },
  normal: {
    duration: 0.3,
    ease: [0.34, 1.56, 0.64, 1],
  },
  slow: {
    duration: 0.5,
    ease: [0.34, 1.56, 0.64, 1],
  },
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: animationConfig.fast,
};

// Modal animations
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: animationConfig.normal,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: animationConfig.fast,
  },
};

// Sidebar animations
export const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: animationConfig.normal,
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: animationConfig.fast,
  },
};

// List item animations
export const listItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.fast,
  },
};

// Container animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
