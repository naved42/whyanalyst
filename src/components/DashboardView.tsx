import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Database, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { cn } from '@/lib/utils';

interface Summary {
  totalDatasets: number;
  totalAnalyses: number;
  recentAnalyses: any[];
  storageUsed: string;
  healthScore: string;
}

export const DashboardView = ({ onStartAnalysis }: { onStartAnalysis: () => void }) => {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(setSummary);
  }, []);

  if (!summary) return null;

  const stats = [
    { label: 'Active Datasets', value: summary.totalDatasets, icon: Database, color: 'bg-blue-500' },
    { label: 'Total Analyses', value: summary.totalAnalyses, icon: Activity, color: 'bg-indigo-500' },
    { label: 'Cloud Storage', value: summary.storageUsed, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Health Score', value: summary.healthScore, icon: Sparkles, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#050505] p-4 sm:p-6 lg:p-10 overflow-y-auto">
      <div className="w-full space-y-8 sm:space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Workspace Overview</h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">Welcome back. Your intelligence engine is operating at peak capacity.</p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={onStartAnalysis} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
                Start New Analysis
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Open the AI Analyst interface</TooltipContent>
          </Tooltip>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Tooltip key={stat.label}>
              <TooltipTrigger>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group cursor-help"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg", stat.color)}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" />
                        +12%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] text-center">
                {stat.label === 'Active Datasets' && 'Total unique data files in your workspace inventory.'}
                {stat.label === 'Total Analyses' && 'Number of successful queries processed by the AI engine.'}
                {stat.label === 'Cloud Storage' && 'Persistent storage used by your datasets in Google Cloud.'}
                {stat.label === 'Health Score' && 'System reliability and data integrity assessment.'}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="space-y-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Recent Insights
              </h2>
              <Button variant="ghost" className="text-xs text-indigo-500 font-bold uppercase tracking-widest">View All</Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {summary.recentAnalyses.map((item, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.query}</h4>
                      <p className="text-[10px] text-zinc-500 font-medium truncate">Dataset: {item.datasetName}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-500 transition-all shrink-0" />
                </div>
              ))}
              {summary.recentAnalyses.length === 0 && (
                <div className="p-8 sm:p-10 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
                  <p className="text-sm text-zinc-400 italic">Generate your first analysis to see history here.</p>
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-2 bg-indigo-600 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between text-white overflow-hidden relative group min-h-[300px]">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                 System Update v4.2
               </div>
               <h2 className="text-3xl font-black leading-tight">Advanced Regression Matrix is now online.</h2>
               <p className="text-indigo-100 text-sm leading-relaxed max-w-[300px]">
                 Unlock predictive forecasting and multi-variate analysis on any uploaded dataset with a single prompt.
               </p>
            </div>
            <Button className="w-fit bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl relative z-10 px-8 py-6">
              Launch Intelligence Engine
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};
