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
  AtSign,
  Instagram,
  Mail,
  Linkedin,
  Twitter,
  Github,
  ChevronRight,
  Zap as Sparkles, // Using Zap for Sparkles feel
  LineChart,
} from 'lucide-react';
import { Button } from './ui/button';



interface LandingPageProps {
  onAuth: () => void;
}

export const LandingPage = ({ onAuth }: LandingPageProps) => {
  const [currentView, setCurrentView] = React.useState<'home' | 'pricing' | 'resources' | 'contact'>('home');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const aiWorkforceCards: Array<{
    name: string;
    role: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { name: 'Market Analyst AI', role: 'Trend Intelligence', Icon: TrendingUp },
    { name: 'Finance Copilot', role: 'Revenue Forecasting', Icon: LineChart },
    { name: 'Security Sentinel', role: 'Threat Monitoring', Icon: Shield },
    { name: 'Growth Intelligence', role: 'Acquisition Insights', Icon: Sparkles },
    { name: 'Research Agent', role: 'Knowledge Discovery', Icon: Network },
    { name: 'Operations AI', role: 'Workflow Optimization', Icon: Layout },
    { name: 'Forecast Engine', role: 'Predictive Modeling', Icon: Zap },
    { name: 'Data Scientist AI', role: 'Advanced Analytics', Icon: BarChart },
  ];

  // Instagram tech influencers to feature in a separate marquee
  const instagramInfluencers: Array<{
    name: string;
    handle: string;
    url: string;
  }> = [
    { name: 'Lex Fridman', handle: '@lexfridman', url: 'https://www.instagram.com/lexfridman/' },
    { name: 'Andrej Karpathy', handle: '@andrejkarpathy', url: 'https://www.instagram.com/karpathy/' },
    { name: 'Rachel Thomas', handle: '@math_rachel', url: 'https://www.instagram.com/math_rachel/' },
    { name: 'Sebastian Raschka', handle: '@rasbt', url: 'https://www.instagram.com/rasbt/' },
    { name: 'Yann LeCun', handle: '@yann.lecun', url: 'https://www.instagram.com/yann.lecun/' },
  ];


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
      {/* Hero Section - Desktop Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 xl:py-32 w-full flex items-center justify-center relative max-w-7xl mx-auto">
        <div className="w-full max-w-3xl space-y-6 sm:space-y-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-xs font-bold uppercase tracking-wider">The Future of Data Science</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[1.05] tracking-tight text-brand-on-surface">
            <span className="text-brand-on-surface">WhyAnalyst.ai</span>
          </h1>
          <p className="hero-text text-base sm:text-lg lg:text-xl text-brand-surface-variant max-w-2xl mx-auto leading-relaxed">
            Chat with CSV and Excel files using AI. Ask questions in plain English and get charts, insights, and reports in seconds.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 w-full">
            <button 
              type="button"
              aria-label="Start analyzing free"
              onClick={onAuth} 
              className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-brand-primary px-4 sm:px-8 py-2 sm:py-4 min-h-[40px] sm:min-h-[56px] text-sm sm:text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Analyzing Free
            </button>
            <button
              type="button"
              aria-label="View live demo"
              onClick={onAuth}
              className="w-full sm:w-auto mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-brand-primary/20 bg-brand-background px-4 sm:px-8 py-2 sm:py-4 min-h-[40px] sm:min-h-[56px] text-sm sm:text-lg font-bold text-brand-primary shadow-sm transition-all hover:border-brand-primary/30 hover:bg-brand-primary/10 active:scale-95 group"
            >
              View Live Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* What We Do - Feature Boxes Section */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-on-surface"
            >
              What WhyAnalyst Does
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-brand-surface-variant text-base sm:text-lg max-w-3xl mx-auto"
            >
              Transform your data into actionable insights with AI-powered analysis
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1: Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all"
            >
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-on-surface mb-2">
                Upload Data
              </h3>
              <p className="text-sm sm:text-base text-brand-surface-variant">
                Drop CSV, Excel files or connect databases. Your data stays secure.
              </p>
            </motion.div>

            {/* Box 2: Ask Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all"
            >
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-on-surface mb-2">
                Ask in Plain English
              </h3>
              <p className="text-sm sm:text-base text-brand-surface-variant">
                "What was our best performing product?" AI understands natural questions.
              </p>
            </motion.div>

            {/* Box 3: Get Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all"
            >
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-on-surface mb-2">
                Get Instant Insights
              </h3>
              <p className="text-sm sm:text-base text-brand-surface-variant">
                AI analyzes patterns, trends, and anomalies in seconds, not hours.
              </p>
            </motion.div>

            {/* Box 4: Export Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all"
            >
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-on-surface mb-2">
                Export & Share
              </h3>
              <p className="text-sm sm:text-base text-brand-surface-variant">
                Download beautiful charts, reports, and visualizations ready to present.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Workforce Marquee */}
      <section className="px-0 sm:px-2 lg:px-4 -mt-3 sm:-mt-5">
        <div className="relative overflow-hidden border-y border-slate-200/80 bg-brand-background py-8 sm:py-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-brand-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-brand-background to-transparent" />

          {/* Desktop Marquee (animated) */}
          <div className="hidden sm:block ai-marquee group overflow-hidden">
            <div className="ai-marquee-track flex w-max items-center gap-4 sm:gap-6 px-4 sm:px-6">
              {[...aiWorkforceCards, ...aiWorkforceCards].map((card, index) => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=E9D5FF&color=7C3AED`;
                const shortName = card.name.split(' ')[0];
                const shortHandle = `@${shortName.toLowerCase().replace(/\W+/g, '')}`;
                return (
                  <article key={`${card.name}-${index}`} className="ai-marquee-card rounded-2xl bg-transparent p-3 sm:p-4 flex flex-col items-center text-center transition-transform">
                    <img src={avatarUrl} alt={card.name} loading="lazy" className="w-12 h-12 rounded-full object-cover mb-3" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shortName)}&background=6366f1&color=fff`; }} />
                    <div className="text-sm sm:text-base font-bold text-brand-on-surface">{shortName}</div>
                    <div className="text-xs sm:text-sm text-slate-500">{shortHandle}</div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Mobile auto-scrolling marquee */}
          <div className="sm:hidden ai-marquee group overflow-hidden">
            <div className="ai-marquee-track flex w-max items-center gap-4 px-4">
              {[...aiWorkforceCards, ...aiWorkforceCards].map((card, index) => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=E9D5FF&color=7C3AED`;
                const handle = `@${card.name.split(' ')[0].toLowerCase().replace(/\W+/g, '')}`;
                return (
                  <article key={`${card.name}-${index}`} className="flex-shrink-0 rounded-2xl bg-transparent p-2 text-center">
                    <img src={avatarUrl} alt={card.name} loading="lazy" className="w-10 h-10 rounded-full object-cover mb-2" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=6366f1&color=fff`; }} />
                    <p className="text-sm font-semibold text-brand-on-surface">{card.name}</p>
                    <p className="text-xs text-brand-surface-variant">{handle}</p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Instagram Influencers Marquee */}
          <div className="mt-6">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <h3 className="text-center text-lg font-bold text-brand-on-surface mb-4">Tech influencers on Instagram</h3>
              <div className="ai-marquee group overflow-hidden">
                <div className="ai-marquee-track flex w-max items-center gap-4 px-4 sm:px-6">
                  {[...instagramInfluencers, ...instagramInfluencers].map((inf, i) => {
                    const shortName = inf.name.split(' ')[0];
                    const handlePart = inf.handle.replace('@','').split(/\.|_|-|\s/)[0];
                    const shortHandle = `@${handlePart}`;
                    return (
                    <a
                      key={`${inf.handle}-${i}`}
                      href={inf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ai-marquee-card rounded-2xl bg-transparent p-3 sm:p-4 flex flex-col items-center text-center transition-transform"
                    >
                      <img
                        src={`https://unavatar.io/instagram/${inf.handle.replace('@','')}`}
                        alt={inf.name}
                        loading="lazy"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mb-3"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shortName)}&background=6366f1&color=fff`; }}
                      />

                      <div className="text-sm sm:text-base font-bold text-brand-on-surface">{shortName}</div>
                      <div className="text-xs sm:text-sm text-slate-500">{shortHandle}</div>
                    </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Desktop Optimized */}
      <section className="bg-brand-background border-y border-slate-100 py-8 sm:py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col items-center justify-center gap-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Trusted by teams at</span>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center w-full max-w-5xl">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-on-surface tracking-tighter">TECHCORP</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-primary tracking-tighter">DATAFLOW</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-on-surface tracking-tighter">QUANTUM</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-on-surface tracking-tighter">SPHERION</div>
          </div>
        </div>
      </section>

      {/* Features Grid - Desktop Optimized */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 xl:py-32 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-on-surface"
            >
              Precision Tools for Modern Teams
            </motion.h2>
            <p className="text-brand-surface-variant text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
              Stop wrestling with spreadsheets. Let AI do the heavy lifting with specialized engines designed for statistical rigor.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-brand-background border border-slate-100 p-8 sm:p-10 lg:p-12 rounded-2xl hover:shadow-xl hover:border-brand-primary/20 transition-all h-full"
          >
            <div className="bg-brand-primary/10 text-brand-primary w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <Cloud className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-on-surface mb-3">Connect Anything</h3>
            <p className="text-sm sm:text-base text-brand-surface-variant leading-relaxed">
              Seamlessly ingest data from CSV, Excel, SQL databases, and cloud storage providers with one secure click.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-brand-background border border-slate-100 p-8 sm:p-10 lg:p-12 rounded-2xl hover:shadow-xl hover:border-brand-primary/20 transition-all h-full"
          >
            <div className="bg-blue-50 text-blue-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-on-surface mb-3">Natural Language</h3>
            <p className="text-sm sm:text-base text-brand-surface-variant leading-relaxed">
              Ask questions like "Which channel had the highest ROI?" and get instant complex data interpretations.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-brand-background border border-slate-100 p-8 sm:p-10 lg:p-12 rounded-2xl hover:shadow-xl hover:border-brand-primary/20 transition-all h-full"
          >
            <div className="bg-emerald-50 text-emerald-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-on-surface mb-3">Automated Visuals</h3>
            <p className="text-sm sm:text-base text-brand-surface-variant leading-relaxed">
              Beautiful, publication-ready charts and reports generated automatically to tell your data's true story.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Use Cases / Industries - Desktop Optimized */}
      <section id="use-cases" className="bg-brand-background border-y border-slate-100 py-12 sm:py-16 lg:py-24 xl:py-32 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">
            <div className="lg:w-2/5 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Industry Solutions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-brand-on-surface">Cognitive Intelligence for Every Vertical</h2>
              <p className="text-brand-surface-variant text-base sm:text-lg lg:text-xl leading-relaxed">
                Empower your enterprise with specialized AI agents tailored for high-stakes decision making across finance, healthcare, and research.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg lg:text-xl text-brand-on-surface">Financial Analysis</h4>
                    <p className="text-brand-surface-variant text-sm">Real-time sentiment analysis and predictive risk modeling for global markets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg lg:text-xl text-brand-on-surface">Healthcare Insights</h4>
                    <p className="text-brand-surface-variant text-sm">Bridge global clinical data to predict patient outcomes with genomic pattern recognition.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Network className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg lg:text-xl text-brand-on-surface">Research Acceleration</h4>
                    <p className="text-brand-surface-variant text-sm">Synthesize complex multi-gigabyte datasets for academic or market breakthroughs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 relative">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-12"
              >
                <div className="aspect-[4/5] bg-brand-background rounded-3xl overflow-hidden relative group">
                  <img 
                    alt="Data focus" 
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALkg6WgzCY_BUTkivc1DWtFLV-i_gFwHJxv7GPcjS0vb3qim6GPVCxCbmkUnbQU2k1xh27q5s4-EgOL1Vu6cWD62FcwT2ztnhDXvCuOonYRyKJhUPddML4U0silZDZ1DSq4S0xzlJp4KJ4NJrrzBNfLStoYfvrBKN3dzVnNU6yZf3WOPaE0T2abgZtOVH_SMBJhOh85jMEeP5s2kd_bEwQPYAS2-Hn0WrsTV4uZuUejrc624JHR14fJjHow2cGsIeXU1KSptUUwHo" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-brand-background/80 backdrop-blur-md rounded-2xl border border-slate-200/60">
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-widest">Statistical Accuracy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="aspect-[4/5] bg-brand-background rounded-3xl overflow-hidden relative group"
                >
                  <img 
                    alt="Lab research" 
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbzKgUJ_6di5x4CWta1Kw-Na9UhM0-fYE5T5jOEoJshl8k34YjWIB3mPDkudu3Y0SM8Sx5OZP7EXcQBjvQKvh32hKLgg1JTtYrQfFyIGfGukOOYXenucs7Tx6B5ikSjgZ_lqnAOso4GlZaCjJker_LWqfVc8iwfDJY0kVE8M-VTa62i03jDn25f60eLSn2F7LsZWRaNOuzlNZ5-2KdLrv5UDUnQxAfdexzF7_GCquUMlMPWXEkn2TPaS9_qe7lCvOf_HUHl4Mhnsw" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 bg-brand-background/80 backdrop-blur-md rounded-2xl border border-slate-200/60">
                      <p className="text-2xl font-bold">&lt;2s</p>
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-widest">Query Latency</p>
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
    <section className="px-6 py-24 w-full bg-brand-background">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-brand-on-surface tracking-tight">Scalable Intelligence for Every Scope</h2>
        <p className="text-brand-surface-variant text-lg max-w-2xl mx-auto">
          Transparent pricing for high-performance AI tools. Whether you're a solo researcher or an enterprise team, we have a plan that evolves with you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Free */}
        <div className="bg-brand-background border border-slate-100 p-10 rounded-3xl flex flex-col shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-brand-on-surface mb-2">Free</h3>
            <p className="text-brand-surface-variant text-sm">For curious individuals and enthusiasts.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold text-brand-on-surface">$0</span>
            <span className="text-brand-surface-variant/70 font-medium ml-2">/ forever</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {['100 queries / month', 'Standard model access', '1GB Workspace storage'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-surface-variant text-sm">
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={onAuth}           className="w-full py-4 border-2 border-brand-primary bg-brand-background text-brand-primary hover:bg-brand-primary/10 rounded-xl font-bold transition-all active:scale-95">
            Join Community
          </button>
        </div>
        {/* Pro */}
        <div className="bg-brand-background border-2 border-brand-primary p-10 rounded-3xl flex flex-col shadow-2xl relative transform lg:-translate-y-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-brand-on-surface mb-2">Pro</h3>
            <p className="text-brand-surface-variant text-sm">For power users and data professionals.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold text-brand-on-surface">$29</span>
            <span className="text-brand-surface-variant/70 font-medium ml-2">/ month</span>
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
          <button onClick={onAuth} className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:opacity-90 transition-all active:scale-95">
            Go Premium
          </button>
        </div>
        {/* Enterprise */}
        <div className="bg-brand-background border border-slate-100 p-10 rounded-3xl flex flex-col shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-brand-on-surface mb-2">Enterprise</h3>
            <p className="text-brand-surface-variant text-sm">For large teams and high-compliance labs.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold text-brand-on-surface">Custom</span>
            <span className="text-brand-surface-variant/70 font-medium ml-2">/ year</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {['Dedicated Instance', 'SAML/SSO Integration', 'Unlimited storage', '24/7 dedicated support'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-surface-variant text-sm">
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={onAuth} className="w-full py-4 border-2 border-brand-primary bg-brand-background text-brand-primary rounded-xl font-bold hover:bg-brand-primary/10 transition-all active:scale-95">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );

  const renderResources = () => (
    <section className="px-6 py-24 w-full space-y-16 bg-brand-background">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-brand-on-surface tracking-tight">How can we help you today?</h2>
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
          <div key={i} className="group p-8 bg-brand-background border border-slate-100 rounded-3xl shadow-sm hover:border-brand-primary/20 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-brand-on-surface mb-2">{item.title}</h3>
            <p className="text-brand-surface-variant text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="px-6 py-24 w-full min-h-[80vh]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Branding & Form */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-4">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-primary/10 rounded-full">Contact Us</span>
            <h1 className="text-5xl font-bold tracking-tight text-brand-on-surface leading-[1.1]">Let's build the future of intelligence together.</h1>
            <p className="text-lg text-brand-surface-variant max-w-xl">Our team of experts is ready to help you integrate enterprise-grade AI into your existing data workflows.</p>
          </header>

          <div className="bg-brand-background border border-slate-100 rounded-3xl p-8 shadow-sm">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-surface-variant/70 uppercase tracking-wider ml-1">Full Name</label>
                  <input className="w-full bg-brand-background border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-brand-surface-variant/50" placeholder="John Doe" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-surface-variant/70 uppercase tracking-wider ml-1">Email Address</label>
                  <input className="w-full bg-brand-background border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-brand-surface-variant/50" placeholder="john@company.ai" type="email"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-surface-variant/70 uppercase tracking-wider ml-1">Inquiry Type</label>
                <select className="w-full bg-brand-background border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-brand-on-surface">
                  <option>Sales Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership Proposal</option>
                  <option>Media & Press</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-surface-variant/70 uppercase tracking-wider ml-1">Message</label>
                <textarea className="w-full bg-brand-background border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-brand-surface-variant/50 resize-none h-40" placeholder="How can our technical team assist your workspace today?"></textarea>
              </div>
              <button 
                type="button"
                onClick={onAuth}
                className="w-full md:w-auto bg-brand-primary text-white px-10 py-4 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
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
              <div className="bg-brand-background border border-slate-100 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0 text-brand-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-on-surface mb-1">Email Our Team</h4>
                  <p className="text-brand-surface-variant text-sm">naved.jatt.42@gmail.com</p>
                  <p className="text-brand-surface-variant text-sm">support@cognitivetech.ai</p>
                </div>
              </div>

              {/* Social Card */}
              <div className="bg-brand-background border border-slate-100 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-blue-50/50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-on-surface mb-1">Stay Connected</h4>
                  <div className="flex gap-4 mt-2">
                    <Twitter className="w-5 h-5 text-brand-surface-variant/70 hover:text-brand-primary cursor-pointer" />
                    <Linkedin className="w-5 h-5 text-brand-surface-variant/70 hover:text-brand-primary cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-brand-background border border-slate-100 p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-on-surface mb-1">Global HQ</h4>
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
              <div className="absolute bottom-6 right-6 bg-brand-background/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/60 shadow-sm">
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Innovation Hub</p>
              </div>
            </div>
          </div>

            <div className="bg-brand-background border border-brand-primary/20 p-8 rounded-3xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Operational Status</span>
            </div>
            <p className="text-brand-on-surface/70 text-sm leading-relaxed">Technical support response time is currently under 15 minutes for Tier 1 Enterprise accounts.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="light min-h-screen bg-brand-background text-brand-on-surface selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-background/80 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div 
            onClick={() => switchView('home')} 
            className="text-xl font-bold tracking-tight text-brand-on-surface flex items-center gap-2 cursor-pointer"
          >
           <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-[10px]">AI</div>
            WhyAnalyst.ai
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => switchView('home')}
              className={currentView === 'home' ? "text-brand-primary font-semibold border-b-2 border-brand-primary pb-1" : "text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"}
            >
              Features
            </button>
            <button 
              onClick={() => switchView('pricing')}
              className={currentView === 'pricing' ? "text-brand-primary font-semibold border-b-2 border-brand-primary pb-1" : "text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"}
            >
              Pricing
            </button>
            <button 
              onClick={() => switchView('resources')}
              className={currentView === 'resources' ? "text-brand-primary font-semibold border-b-2 border-brand-primary pb-1" : "text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"}
            >
              Resources
            </button>
            <a 
              href="/about"
              className="text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"
            >
              About
            </a>
            <button 
              onClick={() => switchView('contact')}
              className={currentView === 'contact' ? "text-brand-primary font-semibold border-b-2 border-brand-primary pb-1" : "text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onAuth} 
              className="text-slate-600 font-medium hover:text-brand-primary px-4 py-2 transition-colors duration-200"
            >
              Sign In
            </button>
            <button 
              onClick={onAuth} 
              className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
            >
              Get Started
            </button>
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
        <section className="px-6 py-24 w-full bg-brand-background">
          <div className="bg-brand-background border border-slate-200 p-12 lg:p-24 rounded-[3rem] text-center text-brand-on-surface relative overflow-hidden shadow-3xl">
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto py-8">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">Ready to unlock your data's full potential?</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                Join over 50,000 analysts using Whyanalyst to accelerate their research and automate decision-making.
              </p>
              <div className="pt-8">
                <button 
                  onClick={onAuth} 
                  className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-primary/20"
                >
                  Start Your Journey Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 px-6 bg-brand-background border-t border-slate-200">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-[10px]">AI</div>
              WhyAnalyst.ai
            </div>
            <p className="text-slate-600 max-w-xs leading-relaxed">
              Automating data analysis for enterprise teams. Unlock insights from millions of data points across any industry.
            </p>

            <div className="mt-2">
              <p className="font-bold text-sm">Contact</p>
              <p className="text-sm">Muhammad Naveed</p>
              <a href="mailto:naved.jatt.42@gmail.com" className="block text-slate-600 hover:text-brand-primary transition-colors">naved.jatt.42@gmail.com</a>
              <div className="flex gap-4 mt-3">
                <a href="https://www.linkedin.com/in/naveedjat/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                </a>
                <a href="https://www.instagram.com/muhammadnaveedjat/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                </a>
                <a href="https://github.com/naved42" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                </a>
                <a href="https://www.threads.com/@muhammadnaveedjat/media" target="_blank" rel="noopener noreferrer" aria-label="Threads">
                  <AtSign className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-slate-900 pb-2">Product</span>
            {['Features', 'Case Studies', 'Pricing', 'Documentation'].map((item) => (
              <a key={item} className="text-slate-500 hover:text-brand-primary transition-colors" href="#">{item}</a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-slate-900 pb-2">Company</span>
            <a href="/about" className="text-slate-500 hover:text-brand-primary transition-colors">About Us</a>
            <a className="text-slate-500 hover:text-brand-primary transition-colors" href="#">Careers</a>
            <a className="text-slate-500 hover:text-brand-primary transition-colors" href="#">Blog</a>
            <button onClick={() => switchView('contact')} className="text-slate-500 hover:text-brand-primary transition-colors text-left">Contact</button>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-slate-900 pb-2">Legal</span>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
              <a key={item} className="text-slate-600 hover:text-brand-primary transition-colors" href="#">{item}</a>
            ))}
          </div>
        </div>
        <div className="w-full pt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-xs font-medium border-t border-slate-100 mt-20">
          <span>© 2026 Whyanalyst – Developed by Muhammad Naveed</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
