import React from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Search, 
  Bell, 
  HelpCircle, 
  BarChart2, 
  Bolt, 
  Play, 
  MoreHorizontal, 
  Plus, 
  CheckCircle2, 
  Brain,
  Info,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomAgentsViewProps {
  onLaunch?: (prompt: string) => void;
}

export const CustomAgentsView = ({ onLaunch }: CustomAgentsViewProps) => {
  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
      {/* Header Section */}
      <section className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Custom AI Agents</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl font-medium leading-relaxed">Deploy specialized intelligence for complex workflows. These agents are pre-trained on industry-specific data architectures.</p>
      </section>

      {/* Bento Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Agent */}
        <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all duration-300">
          <div className="md:w-1/2 relative h-64 sm:h-80 md:h-auto overflow-hidden">
            <img 
              alt="Financial Analyst" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1611974714024-462002cdad1c?auto=format&fit=crop&q=80&w=800" 
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm">Featured</span>
              <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm">99.2% Accuracy</span>
            </div>
          </div>
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-zinc-500">
                <BarChart2 className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Intelligence Hub</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Senior Financial Analyst</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 font-medium">Specialized in real-time volatility tracking and cross-market correlation analysis. Capable of processing 10k+ SEC filings in seconds.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Risk Modeling', 'SEC Compliance', 'Predictive ROI'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-lg text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-tight">{tag}</span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onLaunch?.("I want you to act as my Senior Financial Analyst. Please analyze my current datasets for risk modeling and SEC compliance.")}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-black dark:hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              <span>Quick Launch</span>
              <Bolt className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Card */}
        <div className="md:col-span-12 lg:col-span-4 bg-slate-900 dark:bg-zinc-950 p-8 rounded-2xl text-white flex flex-col justify-between shadow-xl relative overflow-hidden group border border-transparent dark:border-zinc-800">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Zap className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h4 className="text-lg font-bold mb-1">Fleet Performance</h4>
            <p className="text-slate-400 dark:text-zinc-500 text-xs sm:text-sm font-medium leading-relaxed">Collective intelligence throughput across all active neural clusters.</p>
          </div>
          <div className="relative z-10 mt-12 sm:mt-16">
            <div className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter">4.8k <span className="text-lg font-medium opacity-50 tracking-normal ml-1">tasks/hr</span></div>
            <div className="w-full bg-white/10 dark:bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-white dark:bg-indigo-500 h-full rounded-full w-[84%] shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
            </div>
            <p className="text-[10px] font-black mt-4 text-slate-400 dark:text-zinc-500 tracking-widest uppercase">UP 12% FROM LAST SESSION</p>
          </div>
        </div>

        {/* Smaller Agent Cards */}
        {[
          { 
            name: 'Marketing Researcher', 
            desc: 'Performs deep-web sentiment analysis and competitor landscape mapping for B2B enterprises.', 
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', 
            rate: '97.8% Success', 
          },
          { 
            name: 'Data Sanitizer v4', 
            desc: 'Automated PII detection, outlier removal, and schema normalization for messy CSV/JSON datasets.', 
            img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600', 
            rate: '100% Reliable', 
          },
          { 
            name: 'Technical Copywriter', 
            desc: 'Drafts complex technical documentation, API guides, and whitepapers from architectural diagrams.', 
            img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600', 
            rate: '94.5% Engagement', 
          },
        ].map((agent) => (
          <div key={agent.name} className="md:col-span-6 lg:col-span-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col shadow-sm hover:shadow-md transition-all group">
            <div className="h-44 sm:h-52 rounded-xl overflow-hidden mb-4 relative shadow-inner">
              <img 
                alt={agent.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src={agent.img} 
              />
              <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-slate-100 dark:border-zinc-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-800 dark:text-zinc-300 tracking-widest leading-none uppercase">{agent.rate}</span>
              </div>
            </div>
            <div className="px-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{agent.name}</h4>
                <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8 line-clamp-2 leading-relaxed">{agent.desc}</p>
              
              <button 
                onClick={() => onLaunch?.(`Deploying ${agent.name}: ${agent.desc}`)}
                className="mt-auto py-3 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700 transition-all flex items-center justify-center gap-2 group/btn"
              >
                Launch Agent
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {/* Custom Builder Card */}
        <div className="md:col-span-12 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 p-8 sm:p-16 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-slate-900 dark:hover:border-white hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-sm group-hover:bg-slate-900 dark:group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100 dark:border-zinc-700 group-hover:rotate-12">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create Custom Agent</h3>
          <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-sm mb-6 leading-relaxed text-sm sm:text-base">Can't find what you need? Combine multiple models and data sources to build a bespoke specialist.</p>
          <button className="text-slate-900 dark:text-indigo-400 font-bold text-sm hover:underline underline-offset-8 decoration-2 uppercase tracking-widest">Open Agent Builder</button>
        </div>
      </div>
    </div>
  );
};
