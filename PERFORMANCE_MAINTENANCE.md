# Performance Optimization Maintenance Checklist

## ✅ Code Review Checklist

When reviewing code or adding new features, use this checklist to maintain performance:

### Component Performance
- [ ] Check if component uses `React.memo()` if it receives props that don't change often
- [ ] Use `useCallback` for event handlers passed as props
- [ ] Use `useMemo` for expensive computations
- [ ] Check for unnecessary state updates in effects
- [ ] Avoid creating objects/functions inside render

### Effects Optimization
- [ ] All `useEffect` dependencies are correct and necessary
- [ ] No infinite loops in effects
- [ ] Event listeners are cleaned up in return
- [ ] Timers are cleared in cleanup function
- [ ] API calls are debounced or throttled if needed

### Animations
- [ ] All animations use `animationConfig` settings
- [ ] No animations longer than 0.5s without reason
- [ ] `AnimatePresence` uses `mode="wait"` if needed
- [ ] No animations on scroll events (use CSS transforms instead)
- [ ] No `scale` or `rotate` without `transform: translateZ(0)`

### CSS Performance
- [ ] No `scroll-behavior: smooth` (Lenis handles it)
- [ ] Heavy effects use `backdrop-filter` with limits
- [ ] Transitions use short durations (< 300ms)
- [ ] No `box-shadow` animating (use opacity instead)
- [ ] Media queries organized at end of files

### Bundle Size
- [ ] New dependencies justified and actually needed
- [ ] Large dependencies considered for lazy loading
- [ ] Tree-shaking optimized (use ES modules)
- [ ] No duplicate dependencies in package.json
- [ ] Build warnings about chunk size reviewed

### Lists & Tables
- [ ] Lists with > 100 items consider virtual scrolling
- [ ] No re-rendering entire list for single item update
- [ ] Use `key` prop correctly (not index)
- [ ] Lazy load list items if possible
- [ ] Pagination or infinite scroll for large datasets

## 🧪 Testing Before Commit

```bash
# 1. Build the app
npm run build

# 2. Check build output
# Look for chunk sizes - should be reasonable
# Check for warnings about large chunks

# 3. Preview production build
npm run preview

# 4. Test in DevTools
# - Performance tab: record scroll session
# - Check for consistent 60 FPS
# - No jank or frame drops

# 5. Test on mobile
# - Scroll feels smooth
# - Touch interactions responsive
# - No layout shift
```

## 🚨 Red Flags to Watch For

### Performance Anti-Patterns

❌ **Avoid:**
```tsx
// Creating functions in render
<button onClick={() => handleClick()}>Click</button>

// Creating objects in render
const style = { color: 'red', fontSize: 16 };
<div style={style}>Text</div>

// Unnecessary state updates
useEffect(() => {
  setData(data); // Re-triggers itself!
}, []);

// Long animations
transition={{ duration: 1 }}

// Unmemoized expensive components
<ExpensiveComponent data={largeData} />

// All effects depend on props
useEffect(() => { /* ... */ }, [props]);
```

✅ **Instead:**
```tsx
// Use useCallback
const handleClick = useCallback(() => { /* ... */ }, []);
<button onClick={handleClick}>Click</button>

// Memoize objects with useMemo
const style = useMemo(() => ({ color: 'red', fontSize: 16 }), []);
<div style={style}>Text</div>

// Specific dependencies only
useEffect(() => {
  setData(newData);
}, [specificDependency]);

// Reasonable animation duration
transition={animationConfig.normal}

// Memoize expensive components
const MemoExpensive = memo(ExpensiveComponent);
<MemoExpensive data={largeData} />

// Only dependencies that matter
useEffect(() => { /* ... */ }, [specificProp]);
```

## 📋 Performance Metrics Tracking

### Monthly Checks

**Week 1 - Bundle Size**
- [ ] Run `npm run build`
- [ ] Check bundle sizes haven't grown
- [ ] Review any new large dependencies
- [ ] Verify code splitting working

**Week 2 - Runtime Performance**
- [ ] Test core interactions in DevTools
- [ ] Check memory usage over time
- [ ] Verify no memory leaks (heap snapshot)
- [ ] Test on slow 3G connection (DevTools throttle)

**Week 3 - Mobile Testing**
- [ ] Test on real mobile device if possible
- [ ] Check touch responsiveness
- [ ] Verify scroll performance
- [ ] Test animations on slower phone

**Week 4 - Code Review**
- [ ] Audit recent changes for performance issues
- [ ] Check for missed memoization opportunities
- [ ] Review new animations/transitions
- [ ] Check for unnecessary re-renders

## 🎯 Performance Budgets

**Set these as targets:**

| Metric | Target | Current |
|--------|--------|---------|
| Largest JS Bundle | < 500KB | - |
| Initial Load (3G) | < 3s | - |
| Scroll FPS | ≥ 60 | ✅ 60 |
| Modal Animation | ≤ 300ms | ✅ 150ms |
| Search Response | ≤ 300ms | - |
| Mobile Touch | < 100ms | ✅ Instant |

## 🔍 DevTools Audit Checklist

When reviewing performance in DevTools:

### Lighthouse Report
- [ ] Performance score: 90+
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] First Input Delay: < 100ms
- [ ] Time to Interactive: < 3.5s

### Performance Recording
- [ ] Frame rate consistent 60 FPS
- [ ] No dropped frames during interactions
- [ ] Animations complete smoothly
- [ ] No long tasks (> 50ms)
- [ ] JavaScript execution < 20% of frame

### Memory Profiler
- [ ] Heap size stable during interactions
- [ ] No memory leaks after component unmount
- [ ] Detached DOM nodes are cleaned up
- [ ] Event listeners removed on unmount

### Coverage Tab
- [ ] < 20% unused CSS
- [ ] < 30% unused JavaScript
- [ ] No dead code from old features

## 📝 Adding New Features

### Performance Checklist for New Features

**Planning Phase**
- [ ] Estimate bundle size impact
- [ ] Plan for code splitting if needed
- [ ] Consider rendering strategy (virtual scroll?)
- [ ] Design with memoization in mind

**Development Phase**
- [ ] Use `React.memo()` for pure components
- [ ] Implement debouncing for frequent updates
- [ ] Use appropriate animation durations
- [ ] Profile with React DevTools Profiler
- [ ] Test on low-end device

**Review Phase**
- [ ] Build size increase reviewed
- [ ] Performance tab shows no regressions
- [ ] Mobile devices tested
- [ ] Animations smooth on slow devices
- [ ] No console warnings

**Deployment Phase**
- [ ] Final performance audit passed
- [ ] A/B test metrics tracking
- [ ] User feedback monitored
- [ ] Performance dashboard updated

## 🔧 Performance Tools Setup

### Install Performance Monitoring
```bash
# React DevTools Profiler (Chrome/Firefox extension)
# Already available in DevTools

# Lighthouse (Built into Chrome DevTools)
# Tab: Lighthouse

# Web Vitals Measurement
npm install web-vitals

# Usage:
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
getCLS(console.log);
getFID(console.log);
// etc...
```

### Continuous Monitoring Setup
```tsx
// Add to src/main.tsx for production monitoring
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(metric => console.log('CLS:', metric));
    getFID(metric => console.log('FID:', metric));
    getFCP(metric => console.log('FCP:', metric));
    getLCP(metric => console.log('LCP:', metric));
    getTTFB(metric => console.log('TTFB:', metric));
  });
}
```

## 📚 Reference Links

### Performance Documentation
- [Web.dev Performance](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/reference/react/memo)
- [Framer Motion Performance](https://www.framer.com/motion/)
- [Lenis Documentation](https://github.com/studio-freight/lenis)

### Tools
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/rollup-plugin-visualizer)

## ✨ Tips for Maintaining Performance

1. **Profile First** - Use DevTools to identify actual bottlenecks
2. **Measure Impact** - Before and after metrics matter
3. **Document Decisions** - Why you chose this approach
4. **Review Regularly** - Performance can degrade over time
5. **Keep It Simple** - Simpler code is faster code
6. **Test on Real Devices** - DevTools simulation isn't perfect
7. **Monitor Production** - Set up web vitals tracking

---

**Remember**: Performance is a feature, not an afterthought. Keep monitoring and optimizing! 🚀
