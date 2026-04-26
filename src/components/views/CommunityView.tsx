import React from 'react';
import { motion } from 'motion/react';
import { 
  Slack, 
  Search, 
  Bell, 
  HelpCircle, 
  Users, 
  MessageSquare, 
  Rocket, 
  Megaphone, 
  Star, 
  ArrowRight,
  Bot,
  LayoutGrid,
  Bug,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const CommunityView = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-indigo-600 text-white mb-16 p-8 sm:p-16 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 border border-white/5 shadow-sm">12,000+ AI ENGINEERS JOINED</span>
            <h2 className="text-3xl sm:text-5xl font-black mb-8 leading-tight tracking-tighter">The Hub for Intelligent Data Science</h2>
            <p className="text-base sm:text-lg text-slate-400 dark:text-indigo-100 font-medium mb-12 leading-relaxed max-w-md">
                Join our vibrant Slack community to share insights, debug complex agents, and stay updated with the latest in cognitive technology.
            </p>
            <button className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl text-sm font-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest">
              <Slack className="w-6 h-6 fill-current" />
              Join Community Slack
            </button>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl group transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-white/5"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-white/5"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-white/5"></div>
                </div>
                <span className="ml-auto text-[10px] font-black tracking-widest text-slate-500">SLACK #ANNOUNCEMENTS</span>
              </div>
              <div className="space-y-8">
                {[
                  { color: 'bg-white/10', w1: 'w-1/4', w2: 'w-3/4' },
                  { color: 'bg-white/5', w1: 'w-1/3', w2: 'w-full' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className={cn("w-12 h-12 rounded-2xl shrink-0 border border-white/5", item.color)}></div>
                    <div className="space-y-3 w-full pt-2">
                      <div className={cn("h-3 bg-white/10 rounded-full", item.w1)}></div>
                      <div className={cn("h-4 bg-white/5 rounded-full", item.w2)}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 blur-[120px] rounded-full"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Popular Channels */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest text-[16px]">Trending Channels</h3>
            <button className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">Explore All Clusters</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: '#agent-builders', members: '2.4k', desc: 'The core place for building and deploying autonomous LLM agents.', icon: Bot, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
              { name: '#data-engineering', members: '1.8k', desc: 'Pipelines, vector databases, and real-time data streaming architectures.', icon: LayoutGrid, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
              { name: '#debug-lab', members: '940', desc: 'Stuck on a prompt? Get expert help from the community and staff.', icon: Bug, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
              { name: '#showcase', members: '5.1k', desc: "Brag about what you've built. Weekly demos every Thursday.", icon: Lightbulb, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
            ].map((channel) => (
              <div key={channel.name} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("p-4 rounded-2xl border border-slate-50 dark:border-zinc-700 shadow-inner", channel.bg, channel.color)}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 tracking-widest uppercase">{channel.members} NODES</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors">{channel.name}</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed line-clamp-2">{channel.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-xl border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-sm">
                         <img src={`https://i.pravatar.cc/150?u=${channel.name}${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-black text-white dark:text-zinc-900 shadow-sm">+12</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-zinc-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest text-[16px]">Recent Pulse</h3>
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm p-8 space-y-8">
              {[
                { user: '@marcus_v', action: 'shared a new LangChain node', context: '#agents', time: '2m ago', icon: Rocket, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
                { user: 'CT Ops', action: 'Infrastructure scaling report', context: '', time: '15m ago', icon: Megaphone, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
                { user: 'Ecosystem', action: '42 active streams identified', context: '#pulse', time: '1h ago', icon: MessageSquare, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-50 dark:border-zinc-700 shadow-sm group-hover:scale-110 transition-transform", activity.bg, activity.color)}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-snug">
                      <span className="font-bold text-slate-900 dark:text-white">{activity.user}</span> {activity.action} {activity.context && <span className="text-slate-900 dark:text-indigo-400 font-black italic">{activity.context}</span>}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 tracking-widest uppercase mt-2 inline-block leading-none">{activity.time}</span>
                  </div>
                </div>
              ))}
              <div className="pt-8 mt-8 border-t border-slate-50 dark:border-zinc-800">
                <button className="w-full text-xs font-black text-slate-900 dark:text-white hover:text-slate-500 dark:hover:text-zinc-400 transition-colors uppercase tracking-[0.2em] text-center">Full Stream Monitoring</button>
              </div>
            </div>
          </div>

          {/* Promotion Card */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-inner group">
            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 block">ECOSYSTEM BROADCAST</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">CT Summit 2024</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">Register now for early access. Community members get priority seating.</p>
            <div className="w-full h-44 rounded-2xl overflow-hidden mb-8 shadow-2xl relative grayscale group-hover:grayscale-0 transition-all duration-700">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <button className="bg-slate-900 dark:bg-indigo-600 text-white w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 group/btn uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-black/10">
              Secure Pass 
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-16 border-t border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 group hover:opacity-100 transition-opacity duration-700">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase tracking-widest text-[16px]">Cognitive Tech</span>
          <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800"></div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">© 2024 Cognitive Tech Ops.</p>
        </div>
        <div className="flex gap-10">
          {['Privacy', 'Terms', 'Resources'].map(link => (
            <a key={link} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105" href="#">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};
