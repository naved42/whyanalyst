// Performance monitoring utilities
export const performanceMetrics = {
  // Log performance metrics in development
  logMetrics: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
      if (navigationTiming) {
        console.log(`[${label}] FCP: ${navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart}ms`);
      }
    }
  },

  // Measure component render time
  measureRender: (componentName: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (process.env.NODE_ENV === 'development' && duration > 16.67) {
      console.warn(`[Perf] ${componentName} took ${duration.toFixed(2)}ms to render (exceeds 60fps frame budget)`);
    }
  },

  // Throttle scroll events for better performance
  throttle: (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;

    return function executedFunction(...args: any[]) {
      const now = Date.now();
      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func(...args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          func(...args);
        }, remaining);
      }
    };
  },
};

// Enable performance API monitoring
if (process.env.NODE_ENV === 'development') {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).duration > 50) {
            console.log(`[LongTask] ${entry.name}: ${(entry as any).duration.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // LongTask API not supported
    }
  }
}
