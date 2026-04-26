import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  MessageSquare, 
  BarChart, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Stethoscope,
  Network,
  Zap,
  Globe,
  Shield,
  Layout,
  FileText,
  Mail,
  Linkedin,
  Twitter,
  ChevronRight,
  Zap as Sparkles, // Using Zap for Sparkles feel
  LineChart,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';
import { cn } from '@/src/lib/utils';

interface LandingPageProps {
  onAuth: () => void;
}

export const LandingPage = ({ onAuth }: LandingPageProps) => {
  const [currentView, setCurrentView] = React.useState<'home' | 'pricing' | 'resources' | 'contact'>('home');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const switchView = (view: 'home' | 'pricing' | 'resources' | 'contact') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section className="relative px-6 py-12 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 overflow-visible">
        {/* Modern Background Grid & Mesh */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 space-y-10 relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-brand-primary/20 shadow-xl shadow-brand-primary/5"
          >
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">v4.2 Neural Engine Live</span>
          </motion.div>

          <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight text-gray-900 dark:text-white">
            Meet your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-500 to-purple-600 drop-shadow-sm">AI Data Scientist.</span>
          </h1>

          <p className="text-xl text-brand-surface-variant max-w-lg leading-relaxed font-medium">
            Julius connects your data silos into a single, intelligent workspace. Ask questions, clean datasets, and build predictive models with professional-grade rigor—all in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-6">
            <button 
              onClick={onAuth} 
              className="w-full sm:w-auto bg-brand-primary text-brand-on-primary px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-brand-primary/40 hover:-translate-y-1 active:scale-95 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              Get Started Free
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('mock_user', JSON.stringify({
                  uid: 'demo-user-123',
                  email: 'demo@cognitivetech.ai',
                  displayName: 'Demo Scientist',
                  photoURL: 'https://i.pravatar.cc/150?u=demo',
                  emailVerified: true
                }));
                window.location.reload();
              }} 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-lg bg-white dark:bg-zinc-900 text-brand-primary border-2 border-brand-primary/20 shadow-xl shadow-black/5 hover:-translate-y-1 active:scale-95 transition-all"
            >
              Demo Access
            </button>
          </div>

          <div className="flex items-center gap-6 pt-12 border-t border-slate-100 dark:border-slate-800">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg">+12k</div>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Trusted by <span className="text-slate-900 dark:text-white">12,000+</span> data scientists worldwide.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:w-1/2 w-full relative"
        >
          {/* Main Dashboard Preview Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-3">
              <div className="rounded-[2rem] overflow-hidden relative">
                <img 
                  alt="Analysis Interface Preview" 
                  className="w-full object-cover aspect-[4/3] shadow-inner transform group-hover:scale-[1.02] transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZhGCM9_CIfm4TgtM_FA1tKpgjO1D--6bUtdTCuJJGKRNUshwFyftqE0Z3kbd8BHQtyyk6Rg9CfpGbbjgsRX8sh_-ujf-apq_DFo1emN5-tySrHdCn1sXYh4yaLxtjC2RkGoyVR__XUlJWvnj10_f1tS9B5sfWeov-NJwmHnpgrhD2RU4Pbo97FBaECT51rneVWrCvWN82hywqDJYCZ0pEQ9u27i98ncCSTwmlz1aWHzc9ws2l6-TL7SAPLmLe6U01Q6iMI2Dca7E"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-white/10 pointer-events-none"></div>
              </div>

              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-10 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <TrendingUp className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Growth Forecast</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">+24.5%</p>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-8 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Processing Speed</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">0.8s / epoch</p>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="bg-white dark:bg-zinc-950 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 whitespace-nowrap">Industry Leaders Powering Research</span>
              <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-24 items-center opacity-40 hover:opacity-100 transition-opacity duration-1000 grayscale hover:grayscale-0">
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">TECHCORP</div>
              <div className="text-3xl font-black text-brand-primary tracking-tighter">DATAFLOW</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">QUANTUM</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">SPHERION</div>
              <div className="text-3xl font-black text-indigo-500 tracking-tighter italic">NEXUS</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Precision Tools for Modern Teams
          </motion.h2>
          <p className="text-brand-surface-variant text-lg max-w-2xl mx-auto">
            Stop wrestling with spreadsheets. Let AI do the heavy lifting with specialized engines designed for statistical rigor.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-brand-primary/20 transition-all"
          >
            <div className="bg-brand-primary/10 text-brand-primary w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <Cloud className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Connect Anything</h3>
            <p className="text-brand-surface-variant leading-relaxed">
              Seamlessly ingest data from CSV, Excel, SQL databases, and cloud storage providers with one secure click.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-brand-primary/20 transition-all"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Natural Language</h3>
            <p className="text-brand-surface-variant leading-relaxed">
              Ask questions like "Which channel had the highest ROI?" and get instant complex data interpretations.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-brand-primary/20 transition-all"
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Automated Visuals</h3>
            <p className="text-brand-surface-variant leading-relaxed">
              Beautiful, publication-ready charts and reports generated automatically to tell your data's true story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases / Industries */}
      <section id="use-cases" className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-2/5 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Industry Solutions</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Cognitive Intelligence for Every Vertical</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Empower your enterprise with specialized AI agents tailored for high-stakes decision making across finance, healthcare, and research.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Financial Analysis</h4>
                    <p className="text-slate-500 text-sm">Real-time sentiment analysis and predictive risk modeling for global markets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Healthcare Insights</h4>
                    <p className="text-slate-500 text-sm">Bridge global clinical data to predict patient outcomes with genomic pattern recognition.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Network className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Research Acceleration</h4>
                    <p className="text-slate-500 text-sm">Synthesize complex multi-gigabyte datasets for academic or market breakthroughs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 grid grid-cols-2 gap-4 relative">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-12"
              >
                <div className="aspect-[4/5] bg-slate-800 rounded-3xl overflow-hidden relative group">
                  <img alt="Data focus" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALkg6WgzCY_BUTkivc1DWtFLV-i_gFwHJxv7GPcjS0vb3qim6GPVCxCbmkUnbQU2k1xh27q5s4-EgOL1Vu6cWD62FcwT2ztnhDXvCuOonYRyKJhUPddML4U0silZDZ1DSq4S0xzlJp4KJ4NJrrzBNfLStoYfvrBKN3dzVnNU6yZf3WOPaE0T2abgZtOVH_SMBJhOh85jMEeP5s2kd_bEwQPYAS2-Hn0WrsTV4uZuUejrc624JHR14fJjHow2cGsIeXU1KSptUUwHo" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Statistical Accuracy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="aspect-[4/5] bg-slate-800 rounded-3xl overflow-hidden relative group"
                >
                  <img alt="Lab research" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbzKgUJ_6di5x4CWta1Kw-Na9UhM0-fYE5T5jOEoJshl8k34YjWIB3mPDkudu3Y0SM8Sx5OZP7EXcQBjvQKvh32hKLgg1JTtYrQfFyIGfGukOOYXenucs7Tx6B5ikSjgZ_lqnAOso4GlZaCjJker_LWqfVc8iwfDJY0kVE8M-VTa62i03jDn25f60eLSn2F7LsZWRaNOuzlNZ5-2KdLrv5UDUnQxAfdexzF7_GCquUMlMPWXEkn2TPaS9_qe7lCvOf_HUHl4Mhnsw" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-2xl font-bold">&lt;2s</p>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Query Latency</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Decorative glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/20 blur-[120px] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderPricing = () => (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Scalable Intelligence for Every Scope</h2>
        <p className="text-brand-surface-variant text-lg max-w-2xl mx-auto">
          Transparent pricing for high-performance AI tools. Whether you're a solo researcher or an enterprise team, we have a plan that evolves with you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Free */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl flex flex-col shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
            <p className="text-brand-surface-variant text-sm">For curious individuals and enthusiasts.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium ml-2">/ forever</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {['100 queries / month', 'Standard model access', '1GB Workspace storage'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-surface-variant text-sm">
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={onAuth} className="w-full py-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-95">
            Join Community
          </button>
        </div>
        {/* Pro */}
        <div className="bg-white dark:bg-slate-900 border-2 border-brand-primary p-10 rounded-3xl flex flex-col shadow-2xl relative transform lg:-translate-y-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-brand-on-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
            <p className="text-brand-surface-variant text-sm">For power users and data professionals.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">$29</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {[
              'Unlimited AI queries', 
              'Advanced Cognitive Models', 
              '50GB Workspace storage', 
              'Priority email support',
              'API Access (Early access)'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-surface-variant text-sm font-medium">
                <CheckCircle className="w-4 h-4 text-brand-primary" fill="currentColor" fillOpacity="0.1" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={onAuth} className="w-full py-4 bg-brand-primary text-brand-on-primary rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:opacity-90 transition-all active:scale-95">
            Go Premium
          </button>
        </div>
        {/* Enterprise */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl flex flex-col shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
            <p className="text-brand-surface-variant text-sm">For large teams and high-compliance labs.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium ml-2">/ year</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {['Dedicated Instance', 'SAML/SSO Integration', 'Unlimited storage', '24/7 dedicated support'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-surface-variant text-sm">
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={onAuth} className="w-full py-4 border border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-all active:scale-95">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );

  const renderResources = () => (
    <section className="px-6 py-24 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">How can we help you today?</h2>
        <p className="text-brand-surface-variant text-lg max-w-2xl mx-auto">
          Explore our extensive documentation, detailed case studies, and community-driven guides to master the Cognitive AI platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Documentation', desc: 'Step-by-step guides for configuration.', icon: FileText },
          { title: 'API Reference', desc: 'Detailed endpoint docs for developers.', icon: Layout },
          { title: 'Case Studies', desc: 'Real-world success stories from partners.', icon: LineChart },
          { title: 'Community', desc: 'Join the discussion with other experts.', icon: MessageSquare }
        ].map((item, i) => (
          <div key={i} className="group p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:border-brand-primary/20 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-brand-surface-variant text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="px-6 py-24 max-w-7xl mx-auto min-h-[80vh]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Branding & Form */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-4">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-primary/10 rounded-full">Contact Us</span>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">Let's build the future of intelligence together.</h1>
            <p className="text-lg text-brand-surface-variant max-w-xl">Our team of experts is ready to help you integrate enterprise-grade AI into your existing data workflows.</p>
          </header>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="John Doe" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="john@company.ai" type="email"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Inquiry Type</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-slate-800 dark:text-slate-200">
                  <option>Sales Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership Proposal</option>
                  <option>Media & Press</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Message</label>
                <textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 dark:text-white resize-none h-40" placeholder="How can our technical team assist your workspace today?"></textarea>
              </div>
              <button 
                type="button"
                onClick={onAuth}
                className="w-full md:w-auto bg-brand-primary text-brand-on-primary px-10 py-4 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Info & Map */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {/* Email Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0 text-brand-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 dark:text-white">Email Our Team</h4>
                  <p className="text-brand-surface-variant text-sm">hello@cognitivetech.ai</p>
                  <p className="text-brand-surface-variant text-sm">support@cognitivetech.ai</p>
                </div>
              </div>

              {/* Social Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 dark:text-white">Stay Connected</h4>
                  <div className="flex gap-4 mt-2">
                    <Twitter className="w-5 h-5 text-slate-400 hover:text-brand-primary cursor-pointer" />
                    <Linkedin className="w-5 h-5 text-slate-400 hover:text-brand-primary cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 dark:text-white">Global HQ</h4>
                  <p className="text-brand-surface-variant text-sm">450 Science Park Way, Suite 200</p>
                  <p className="text-brand-surface-variant text-sm">Palo Alto, CA 94304</p>
                </div>
              </div>
            </div>

            {/* Decorative Map Area */}
            <div className="relative h-64 w-full rounded-3xl overflow-hidden border border-slate-100 shadow-inner group">
              <img 
                alt="Office location map" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-1000" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuk3XfP3LSXSfJM1ACPoMd8m0gd9af9yyN77_m5-SkvOWGwtn6AOkoOHPHBZpHuPS6lp1Ed9S06SBIOYF8c6vli-kRThT_aA48xxzRrRiVJ8CIXWDYvcnO0lmFEdYnlqraix4QVohh9BdmZOF591o6xqJ2--IM_t4oOvkObkU9Zwl71HDv1yKqH3wJZm95DU_02PIp6EjzhJjqWs6ARYU8rtQ7BuQadtPxWly2-ONgdkGmXjVNTPDplsZNhTRMAb0i31AebkfAaXs"
              />
              <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply"></div>
              <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-sm">
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Innovation Hub</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Operational Status</span>
            </div>
            <p className="text-blue-900/70 text-sm leading-relaxed">Technical support response time is currently under 15 minutes for Tier 1 Enterprise accounts.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-brand-background dark:bg-zinc-950 text-brand-on-surface dark:text-white selection:bg-brand-primary/20 selection:text-brand-primary transition-colors">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={cn(
            "flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500",
            isScrolled ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl shadow-black/5" : "bg-transparent"
          )}>
            <div 
              onClick={() => switchView('home')} 
              className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">C</div>
              <span className="hidden sm:block">Cognitive Tech</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Features' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'resources', label: 'Resources' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => switchView(item.id as any)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                    currentView === item.id 
                      ? "text-brand-primary bg-brand-primary/5" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={onAuth} className="hidden sm:block px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors">Sign In</button>
              <button onClick={onAuth} className="bg-brand-primary text-brand-on-primary px-6 py-2.5 rounded-xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' && renderHome()}
            {currentView === 'pricing' && renderPricing()}
            {currentView === 'resources' && renderResources()}
            {currentView === 'contact' && renderContact()}
          </motion.div>
        </AnimatePresence>

        {/* Final CTA - Common for all pages */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-brand-primary to-blue-600 p-12 lg:p-24 rounded-[3rem] text-center text-white relative overflow-hidden shadow-3xl">
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto py-8">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">Ready to unlock your data's full potential?</h2>
              <p className="text-lg opacity-80 leading-relaxed">
                Join over 50,000 analysts and data scientists using Julius AI to accelerate their research and automate decision-making.
              </p>
              <div className="pt-8">
                <button onClick={onAuth} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-900/40">
                  Start Your Journey Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 px-6 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg">C</div>
              Cognitive Tech
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
              Automating data science for enterprise teams. Unlock insights from millions of data points across any industry.
            </p>
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer shadow-sm"><Twitter className="w-5 h-5" /></div>
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer shadow-sm"><Linkedin className="w-5 h-5" /></div>
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer shadow-sm"><Mail className="w-5 h-5" /></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-black text-slate-900 dark:text-white pb-2 text-xs uppercase tracking-widest">Product</span>
            {['Features', 'Case Studies', 'Pricing', 'Documentation'].map((item) => (
              <a key={item} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm font-medium" href="#">{item}</a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-black text-slate-900 dark:text-white pb-2 text-xs uppercase tracking-widest">Company</span>
            <button onClick={() => switchView('home')} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-left text-sm font-medium">About Us</button>
            <a className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm font-medium" href="#">Careers</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm font-medium" href="#">Blog</a>
            <button onClick={() => switchView('contact')} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-left text-sm font-medium">Contact</button>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-black text-slate-900 dark:text-white pb-2 text-xs uppercase tracking-widest">Legal</span>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
              <a key={item} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm font-medium" href="#">{item}</a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 dark:border-zinc-900 mt-20">
          <span>© 2024 Cognitive Tech Platform. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
