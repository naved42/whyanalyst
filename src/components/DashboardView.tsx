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
  ChevronRight,
  DollarSign,
  TrendingDown,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { cn } from '@/src/lib/utils';

interface Summary {
  totalDatasets: number;
  totalAnalyses: number;
  recentAnalyses: any[];
  storageUsed: string;
  healthScore: string;
}

const DASHBOARD_TRANSLATIONS = {
  en: {
    title: 'Workspace Overview',
    subtitle: 'Welcome back. Your intelligence engine is operating at peak capacity.',
    startBtn: 'Start New Analysis',
    datasets: 'Active Datasets',
    analyses: 'Total Analyses',
    storage: 'Cloud Storage',
    health: 'Health Score',
    recentInsights: 'Recent Insights',
    viewAll: 'View All',
    launchEngine: 'Launch Intelligence Engine',
    predictiveTitle: 'Advanced Regression Matrix is now online.',
    predictiveDesc: 'Unlock predictive forecasting and multi-variate analysis on any uploaded dataset with a single prompt.',
    revenueTitle: 'Revenue Velocity',
    mrr: 'Monthly Recurring Revenue',
    churn: 'Churn Rate',
    growth: 'Growth Trend'
  },
  ur: {
    title: 'ورک سپیس جائزہ',
    subtitle: 'خوش آمدید۔ آپ کا انٹیلی جنس انجن پوری صلاحیت سے کام کر رہا ہے۔',
    startBtn: 'نیا تجزیہ شروع کریں',
    datasets: 'فعال ڈیٹا سیٹس',
    analyses: 'کل تجزیے',
    storage: 'کلاؤڈ سٹوریج',
    health: 'صحت کا سکور',
    recentInsights: 'حالیہ بصیرتیں',
    viewAll: 'سب دیکھیں',
    launchEngine: 'انٹیلی جنس انجن شروع کریں',
    predictiveTitle: 'ایڈوانسڈ ریگریشن میٹرکس اب آن لائن ہے۔',
    predictiveDesc: 'کسی بھی اپ لوڈ کردہ ڈیٹا سیٹ پر ایک ہی پرامپٹ کے ساتھ پیش گوئی کرنے والی پیشن گوئی اور ملٹی ویریٹی تجزیہ کھولیں۔',
    revenueTitle: 'ریونیو کی رفتار',
    mrr: 'ماہانہ بار بار آنے والی آمدنی',
    churn: 'چررن ریٹ',
    growth: 'ترقی کا رجحان'
  }
};

export const DashboardView = ({ 
  onStartAnalysis, 
  language = 'en',
  onNavigate 
}: { 
  onStartAnalysis: () => void;
  language?: 'en' | 'ur';
  onNavigate?: (view: string) => void;
}) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const t = DASHBOARD_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  useEffect(() => {
    // Mock data for now if API fails
    setSummary({
      totalDatasets: 12,
      totalAnalyses: 48,
      storageUsed: '2.4 GB',
      healthScore: '98%',
      recentAnalyses: [
        { query: 'Quarterly Sales Forecast', datasetName: 'sales_2025.csv' },
        { query: 'Customer Retention Pattern', datasetName: 'churn_data.json' },
        { query: 'Inventory Optimization', datasetName: 'inventory_db' }
      ]
    });
    
    // Attempt real fetch
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  if (!summary) return null;

  const stats = [
    { label: t.datasets, value: summary.totalDatasets, icon: Database, color: 'bg-blue-500' },
    { label: t.analyses, value: summary.totalAnalyses, icon: Activity, color: 'bg-indigo-500' },
    { label: t.storage, value: summary.storageUsed, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: t.health, value: summary.healthScore, icon: Sparkles, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#050505] p-4 sm:p-6 lg:p-10 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-12 pb-20">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">{t.subtitle}</p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={onStartAnalysis} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                <Sparkles className="w-4 h-4" />
                {t.startBtn}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Open the AI Analyst interface</TooltipContent>
          </Tooltip>
        </header>

        {/* Core Stats */}
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
                {stat.label} context info...
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Revenue Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <DollarSign className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{t.revenueTitle}</h2>
                    <p className="text-xs text-zinc-500 font-medium">Real-time financial velocity tracking.</p>
                 </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-1 md:w-40">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{t.mrr}</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">$142,500</p>
                 </div>
                 <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-1 md:w-40">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{t.churn}</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">1.2%</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Mock Chart */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{t.growth}</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                       <TrendingUp className="w-3.5 h-3.5" /> +24% YoY
                    </span>
                 </div>
                 <div className="h-48 w-full flex items-end gap-1 px-2">
                    {[35, 45, 30, 60, 50, 75, 80, 65, 90, 85, 100].map((h, i) => (
                       <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className={cn(
                             "flex-1 rounded-t-lg transition-all hover:opacity-80 cursor-help",
                             i === 10 ? "bg-indigo-500" : "bg-indigo-200 dark:bg-zinc-800"
                          )}
                          title={`Value: ${h * 1000}`}
                       />
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-500/10">
                    <div className="flex items-center gap-3 mb-3">
                       <Zap className="w-5 h-5 text-indigo-500" />
                       <h4 className="font-bold text-zinc-900 dark:text-white">Optimization Insight</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                       {isRTL 
                         ? "آپ کا چررن ریٹ گزشتہ ماہ کے مقابلے میں 0.4 فیصد کم ہوا ہے۔ کسٹمر برقرار رکھنے کے ایجنٹس کو فعال کرنے پر غور کریں۔" 
                         : "Your churn rate is down 0.4% compared to last month. Consider activating the customer retention agents for high-value cohorts."}
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 font-bold text-xs border-zinc-200 dark:border-zinc-800">
                       Download Report
                    </Button>
                    <Button className="bg-zinc-900 dark:bg-indigo-600 text-white rounded-2xl h-12 font-bold text-xs shadow-lg active:scale-95 transition-transform">
                       Optimize Funnel
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="space-y-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                {t.recentInsights}
              </h2>
              <Button variant="ghost" className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{t.viewAll}</Button>
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
                  <ChevronRight className={cn("w-4 h-4 text-zinc-300 group-hover:text-indigo-500 transition-all shrink-0", isRTL && "rotate-180")} />
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 bg-indigo-600 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between text-white overflow-hidden relative group min-h-[300px]">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                 System Update v4.2
               </div>
               <h2 className="text-3xl font-black leading-tight">{t.predictiveTitle}</h2>
               <p className="text-indigo-100 text-sm leading-relaxed max-w-[300px]">
                 {t.predictiveDesc}
               </p>
            </div>
            <Button 
              onClick={() => onNavigate?.('home')}
              className="w-fit bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl relative z-10 px-8 py-6 active:scale-95 transition-transform"
            >
              {t.launchEngine}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};
