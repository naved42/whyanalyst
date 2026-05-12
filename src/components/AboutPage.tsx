import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight,
  Zap as Sparkles,
  MessageSquare,
  BarChart,
  Globe,
  Mail,
  Linkedin,
  Instagram,
  Twitter,
  ChevronRight,
  AtSign,
  FileText
} from 'lucide-react';
import { Button } from './ui/button';

interface AboutPageProps {
  onAuth: () => void;
}

export const AboutPage = ({ onAuth }: AboutPageProps) => {
  return (
    <div className="light min-h-screen bg-brand-background text-brand-on-surface">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brand-surface/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div 
            onClick={() => window.location.href = '/'}
            className="text-xl font-bold tracking-tight text-brand-on-surface flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-[10px]">AI</div>
            whyanalyst.ai
          </div>
          <div className="hidden md:flex space-x-8">
            <a 
              href="/"
              className="text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="/"
              className="text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"
            >
              Pricing
            </a>
            <a 
              href="/"
              className="text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"
            >
              Resources
            </a>
            <a 
              href="/about"
              className="text-brand-primary font-semibold border-b-2 border-brand-primary pb-1"
            >
              About
            </a>
            <a 
              href="/"
              className="text-brand-surface-variant hover:text-brand-primary transition-colors duration-200"
            >
              Contact
            </a>
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

      <main className="pt-32 pb-20">
        {/* About Header */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 max-w-6xl mx-auto">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs sm:text-xs font-bold uppercase tracking-wider">About Whyanalyst</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-brand-on-surface">
                Whyanalyst: <span className="text-gradient">AI-Powered Analytics</span>
              </h1>
              <p className="text-lg text-brand-surface-variant max-w-2xl leading-relaxed">
                Whyanalyst is an AI‑powered analytics webapp developed by Muhammad Naveed to help users unlock insights from their data through natural language conversations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-on-surface">Our Mission</h2>
              <p className="text-base text-brand-surface-variant leading-relaxed">
                To democratize data analytics by making advanced AI-powered analysis accessible to everyone. We believe that data-driven decision-making shouldn't require advanced technical skills.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <BarChart className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Transform raw data into actionable insights instantly</p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Ask questions in plain English, get intelligent answers</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Accessible from anywhere, for teams of any size</p>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-on-surface">Our Vision</h2>
              <p className="text-base text-brand-surface-variant leading-relaxed">
                To build the world's most intuitive AI analytics platform that empowers every organization to make faster, smarter decisions backed by data.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Cutting-edge AI models for precise analysis</p>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Beautiful, publication-ready visualizations</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                  <p className="text-brand-surface-variant">Enterprise-grade security and reliability</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 max-w-6xl mx-auto">
          <div className="bg-brand-surface border border-slate-100 rounded-3xl p-8 sm:p-12 lg:p-16 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-on-surface">About the Founder</h2>
              <div className="space-y-4">
                <p className="text-base text-brand-surface-variant leading-relaxed">
                  <strong className="text-brand-on-surface">Muhammad Naveed</strong> is a full-stack developer and AI enthusiast with a passion for building intuitive, user-centric applications that solve real-world problems.
                </p>
                <p className="text-base text-brand-surface-variant leading-relaxed">
                  With a background in software engineering and machine learning, Muhammad created Whyanalyst to bridge the gap between powerful AI capabilities and everyday business users who need to extract insights from their data without learning complex tools.
                </p>
                <p className="text-base text-brand-surface-variant leading-relaxed">
                  His vision is to make advanced analytics accessible to everyone, regardless of their technical expertise. Whyanalyst represents years of dedication to combining natural language processing with enterprise-grade data analysis.
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-6">
                <p className="text-sm font-semibold text-brand-on-surface">Connect with Muhammad Naveed:</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.threads.com/@muhammadnaveedjat/media"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Threads profile"
                    title="Threads"
                    className="p-3 bg-brand-surface-container rounded-lg text-brand-primary hover:bg-slate-200 transition-colors"
                  >
                    <AtSign className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/naveedjat/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    title="LinkedIn"
                    className="p-3 bg-brand-surface-container rounded-lg text-brand-primary hover:bg-slate-200 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/muhammadnaveedjat/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram profile"
                    title="Instagram"
                    className="p-3 bg-brand-surface-container rounded-lg text-brand-primary hover:bg-slate-200 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:naved.jatt.42@gmail.com"
                    title="Email"
                    className="p-3 bg-brand-surface-container rounded-lg text-brand-primary hover:bg-slate-200 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-brand-primary to-blue-600 p-12 lg:p-16 rounded-3xl text-center text-white space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Ready to Try Whyanalyst?</h2>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
              Start analyzing your data with AI today. No credit card required.
            </p>
            <button 
              onClick={onAuth}
              className="bg-white text-brand-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-xs font-medium">
            <span>© 2026 Whyanalyst – Developed by Muhammad Naveed</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Meta Tags for SEO - These should be added to index.html or head */}
      {typeof window !== 'undefined' && (
        <>
          {document.title !== 'About Whyanalyst – Developed by Muhammad Naveed' && (
            (() => {
              document.title = 'About Whyanalyst – Developed by Muhammad Naveed';
              // Update meta description
              let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
              if (!metaDescription) {
                metaDescription = document.createElement('meta') as HTMLMetaElement;
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
              }
              metaDescription.content = 'Whyanalyst is an AI‑powered analytics tool developed by Muhammad Naveed to help users extract insights from their data through natural language conversations.';
            })()
          )}
        </>
      )}
    </div>
  );
};
