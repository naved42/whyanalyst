import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  ChevronRight, 
  Clock, 
  Star, 
  Users, 
  TrendingUp,
  LayoutGrid,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const NotebookTemplatesView = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Template Library</h2>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">Jumpstart your data science projects with pre-configured workflows and optimized models curated by top AI engineers.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {['All Templates', 'Forecasting', 'Classification', 'NLP', 'Deep Learning'].map((tag, i) => (
            <button 
              key={tag}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border uppercase tracking-widest",
                i === 0 
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:border-zinc-700" 
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 whitespace-nowrap justify-center sm:justify-start">
          <span className="text-[10px] font-black uppercase tracking-widest">Sort by:</span>
          <button className="flex items-center gap-1 font-black text-slate-900 dark:text-zinc-300 text-xs sm:text-sm uppercase tracking-widest hover:text-slate-500 transition-colors">
            Most Popular
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Feature Card */}
        <div className="md:col-span-12 group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-all duration-500">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between order-2 lg:order-1">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest border border-slate-900 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">Classification</span>
                  <span className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none">
                    <Clock className="w-3.5 h-3.5" /> 15 MIN SETUP
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">Customer Churn Prediction Workflow</h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed max-w-xl">An end-to-end pipeline for predicting subscription churn using XGBoost. Includes feature engineering, SHAP value interpretation, and automated model monitoring.</p>
                <div className="flex gap-4 items-center mb-10">
                  <div className="flex -space-x-3">
                    {[
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
                    ].map((src, i) => (
                      <div key={i} className="w-10 h-10 rounded-xl border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src={src} />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-xl border-2 border-white dark:border-zinc-900 bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-sm">+12</div>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                     <Users className="w-4 h-4" /> 2.4k Uses
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-black/10 active:scale-95 transition-all hover:bg-black dark:hover:bg-indigo-700 uppercase tracking-widest">Use Template</button>
                <button className="flex-1 px-8 py-4 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest">Live Demo</button>
              </div>
            </div>
            <div className="flex-1 relative h-64 sm:h-80 lg:h-auto order-1 lg:order-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-white/5 to-white/80 dark:via-zinc-950/5 dark:to-zinc-950/80 z-10"></div>
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
              />
            </div>
          </div>
        </div>

        {/* Secondary Cards */}
        {[
          { 
            title: 'Demand Forecasting with Prophet', 
            desc: 'Scalable time series forecasting including holiday effects and trend change points.', 
            tag: 'Forecasting', 
            img: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=400',
          },
          { 
            title: 'Sentiment Analysis via BERT', 
            desc: 'Fine-tune pre-trained transformer models for multi-label text classification.', 
            tag: 'NLP Hub', 
            img: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=400',
          },
          { 
            title: 'Collaborative Filtering Engine', 
            desc: 'Build recommendation systems for product suggestions at scale with matrix factorization.', 
            tag: 'Recommendation', 
            img: 'https://images.unsplash.com/photo-1504868584819-f8e90526354c?auto=format&fit=crop&q=80&w=400',
          },
        ].map((card) => (
          <div key={card.title} className="md:col-span-6 lg:col-span-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-all flex flex-col group cursor-pointer">
            <div className="mb-5 h-44 sm:h-52 rounded-xl bg-slate-50 dark:bg-zinc-800 overflow-hidden relative shadow-inner">
              <img className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" src={card.img} />
              <div className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-sm text-slate-300 dark:text-zinc-600 group-hover:text-amber-500 transition-colors border border-slate-100 dark:border-zinc-800">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="flex-1 px-1">
              <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest mb-3 inline-block bg-slate-900 dark:bg-zinc-800 text-white shadow-sm">{card.tag}</span>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight group-hover:text-slate-600 dark:group-hover:text-zinc-400 transition-colors">{card.title}</h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8 line-clamp-2 leading-relaxed">{card.desc}</p>
            </div>
            <button className="w-full py-4 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 group-hover:shadow-lg">Use Template</button>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="mt-20 p-8 sm:p-16 rounded-[2.5rem] bg-slate-900 dark:bg-indigo-900/20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl border dark:border-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 dark:bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-slate-500/10 dark:bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 text-center lg:text-left">
          <h3 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter">Need something custom?</h3>
          <p className="text-slate-400 dark:text-indigo-200/60 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">Describe your workflow and our AI will generate a bespoke technical playbook for your team in seconds.</p>
        </div>
        <button className="relative z-10 w-full lg:w-auto whitespace-nowrap px-12 py-5 bg-white text-slate-900 dark:bg-indigo-600 dark:text-white rounded-2xl text-lg font-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] dark:hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 shadow-xl uppercase tracking-widest">
            AI Blueprint
        </button>
      </div>
    </div>
  );
};
