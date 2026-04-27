import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowRight, ChevronDown } from 'lucide-react';

export const ContactView = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
      <div className="text-center mb-16 sm:mb-24">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">How can we help?</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Get in touch with our team of data scientists and engineers or explore our help resources to master your analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
        {/* Contact Info & FAQ */}
        <div className="lg:col-span-5 space-y-12">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm transition-hover hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-widest text-[14px]">Direct Channels</h3>
            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email Support', value: 'support@julius.ai', desc: 'Average response: 2 hours' },
                { icon: Phone, label: 'Enterprise Line', value: '+1 (555) JULIUS-AI', desc: 'Mon-Fri, 9am - 5pm EST' },
                { icon: MessageSquare, label: 'Community Slack', value: 'slack.julius.ai', desc: 'Get live help from peers' }
              ].map((item) => (
                <div key={item.label} className="flex gap-5 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-100 dark:border-zinc-700 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 leading-none">{item.label}</p>
                    <p className="text-slate-900 dark:text-white font-bold mb-1 tracking-tight">{item.value}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white px-4 uppercase tracking-widest text-[14px]">Fast Solutions</h3>
             <div className="space-y-4">
                {[
                  { q: 'How do I export my analysis?', a: 'You can export analysis to CSV, PDF or Python notebooks via the export button in the top bar.' },
                  { q: 'Can I connect my private SQL server?', a: 'Yes, go to settings > data sources to set up a secure SSH tunnel for your database.' },
                  { q: 'What AI models are available?', a: 'We support Gemini 1.5 Pro, GPT-4o, and specialized open-source models for data engineering.' }
                ].map((faq, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800/50 transition-all group">
                    <p className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors">{faq.q}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <Send className="w-24 h-24 text-slate-900 dark:text-white" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Identity</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-white transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email Endpoint</label>
                  <input 
                    type="email" 
                    placeholder="jane@company.com"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-white transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Subject Matter</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-white transition-all appearance-none cursor-pointer dark:text-white">
                    <option>Strategic Partnership</option>
                    <option>Technical Implementation</option>
                    <option>Architectural Support</option>
                    <option>Billing & Scale</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Message Body</label>
                <textarea 
                  rows={5}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-white transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-zinc-600 dark:text-white"
                ></textarea>
              </div>

              <button className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
                <Send className="w-4 h-4" />
                Initialize Secure Dispatch
              </button>

              <div className="flex items-center justify-center gap-2 pt-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[9px] text-center text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                   Encrypted via end-to-end TLS 1.3
                 </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Locations Banner */}
      <div className="mt-24 bg-slate-900 dark:bg-zinc-950 rounded-[3rem] p-10 sm:p-20 text-white relative overflow-hidden group shadow-2xl border border-transparent dark:border-zinc-800">
         <Globe className="absolute -left-20 -top-20 w-80 h-80 opacity-5 group-hover:scale-110 transition-transform duration-[2000ms]" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
               <h3 className="text-3xl sm:text-4xl font-black mb-6 tracking-tighter">Global Presence</h3>
               <p className="text-slate-400 dark:text-zinc-500 text-lg max-w-xl font-medium leading-relaxed">
                 We operate across 12 countries with distributed engineering hubs. No matter where you are, we're building the future of intelligence with you.
               </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               {['SF', 'NY', 'LN', 'TK', 'BL'].map(loc => (
                 <div key={loc} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl hover:bg-white hover:text-slate-900 dark:hover:text-indigo-500 transition-all cursor-crosshair">
                   {loc}
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
