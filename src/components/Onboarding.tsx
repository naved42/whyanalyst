import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  LayoutDashboard,
  BrainCircuit,
  PieChart,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface Step {
  title: string;
  description: string;
  targetId: string;
  icon: any;
  position: 'right' | 'left' | 'top' | 'bottom' | 'center';
}

const STEPS: Step[] = [
  {
    title: "Welcome to CleanSlate AI",
    description: "Your personalized AI workspace for high-speed data analysis and strategic reporting. Let's take a quick tour.",
    targetId: "onboarding-center",
    icon: Sparkles,
    position: 'center'
  },
  {
    title: "The Intelligence Sidebar",
    description: "Navigate between your Dashboard, Data Sources, and full Analysis history. Collapse this for more workspace.",
    targetId: "sidebar-nav",
    icon: LayoutDashboard,
    position: 'right'
  },
  {
    title: "Data Control Center",
    description: "Upload your CSV or Excel files here. You can also export your cleaned results at any time.",
    targetId: "top-bar-actions",
    icon: MousePointer2,
    position: 'bottom'
  },
  {
    title: "AI Analysis Workspace",
    description: "Ask complex questions in plain english. I'll provide deep insights, generated code, and reasoning.",
    targetId: "chat-interface",
    icon: BrainCircuit,
    position: 'right'
  },
  {
    title: "Visualization Hub",
    description: "Interactive Plotly charts and key metrics automatically appear here as we process your data.",
    targetId: "analysis-panel",
    icon: PieChart,
    position: 'left'
  }
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding-v4');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep === null) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep === null || currentStep === 0) return;
    setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding-v4', 'true');
    setCurrentStep(null);
    setShow(false);
  };

  if (!show) return null;

  const step = currentStep !== null ? STEPS[currentStep] : null;

  return (
    <AnimatePresence>
      {(show || currentStep !== null) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Backdrop for current step focus */}
          {currentStep !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
              onClick={handleComplete}
            />
          )}

          <AnimatePresence mode="wait">
            {currentStep === null ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm text-center pointer-events-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Ready to excel?</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
                  Welcome to the future of data engineering. Let me show you how to dominate your datasets.
                </p>
                <div className="space-y-3">
                  <Button onClick={handleStart} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-sm font-semibold rounded-xl">
                    Begin Experience
                  </Button>
                  <Button variant="ghost" onClick={handleComplete} className="w-full text-zinc-500 text-xs">
                    Skip Tutorial
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={cn(
                  "absolute p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-indigo-500/20 shadow-2xl max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-auto z-[110]",
                  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // Default mobile/centered
                  step?.position === 'center' ? "" : "sm:translate-x-0 sm:translate-y-0 sm:top-auto sm:left-auto sm:right-auto sm:bottom-auto", // Reset for desktop
                  step?.position === 'right' && "sm:left-[260px] sm:top-[20%]",
                  step?.position === 'bottom' && "sm:top-[100px] sm:right-[20%]",
                  step?.position === 'left' && "sm:right-[420px] sm:bottom-[30%]"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    {step && <step.icon className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <button onClick={handleComplete} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{step?.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  {step?.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          i === currentStep ? "bg-indigo-500 w-4" : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleBack} className="text-xs h-8">
                        Back
                      </Button>
                    )}
                    <Button onClick={handleNext} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8 gap-1 pl-3 pr-2">
                       {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                       <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Animated pointer arrow - only visible on desktop where positioning is fixed */}
                {step?.position !== 'center' && (
                  <motion.div 
                    animate={{ x: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={cn(
                      "hidden sm:block absolute w-4 h-4 bg-white dark:bg-zinc-950 border-l border-t border-indigo-500/20 rotate-[135deg] -translate-y-1/2",
                      step?.position === 'right' && "-left-2 top-10 rotate-[-45deg]",
                      step?.position === 'bottom' && "top-[-8px] right-20 rotate-[45deg]",
                      step?.position === 'left' && "-right-2 bottom-10 rotate-[135deg]"
                    )}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};
