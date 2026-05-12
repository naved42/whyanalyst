import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { TooltipProvider } from './components/ui/tooltip';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'motion/react';

// Toaster — deferred, not needed until a notification fires
const LazyToaster = React.lazy(() => import('sonner').then(m => ({ default: m.Toaster })));

// LAZY LOADING COMPONENTS
const Workspace = React.lazy(() => import('./components/Workspace').then(m => ({ default: m.Workspace })));
const LandingPage = React.lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const AboutPage = React.lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const AuthModal = React.lazy(() => import('./components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]">
    <div className="space-y-4 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Loading Module...</p>
    </div>
  </div>
);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, isAdmin, isEmailVerified, signOut, status } = useAuth();
  
  // Navigation & UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'about'>('landing');
  
  // Data State
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [audit, setAudit] = useState<any | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  // URL-based routing for public pages
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/about') {
        setCurrentPage('about');
      } else {
        setCurrentPage('landing');
      }
    };
    
    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Force light mode on the public landing page; use saved theme inside workspace
  useEffect(() => {
    const root = window.document.documentElement;
    if (!user) {
      root.classList.remove('dark');
      root.classList.add('light');
      return;
    }
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [user, theme]);

  // Lazy load Umami analytics
  useEffect(() => {
    const loadUmami = () => {
      if (document.querySelector('script[src*="umami.is"]')) return;
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = "https://cloud.umami.is/script.js";
      script.setAttribute('data-website-id', "ed2e8d56-5170-404d-8f30-ecb3c07da500");
      document.head.appendChild(script);
    };

    if (window.status === 'complete') {
      loadUmami();
    } else {
      window.addEventListener('load', loadUmami);
      return () => window.removeEventListener('load', loadUmami);
    }
  }, []);

  // Role-based auto-navigation for administrators on login
  useEffect(() => {
    if (user && isAdmin && activeTab === 'dashboard') {
      setActiveTab('admin');
    }
  }, [isAdmin, !!user, activeTab]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowSearch(prev => !prev);
    }
  }, []);

  const handleNavigate = useCallback((page: 'landing' | 'about') => {
    const path = page === 'about' ? '/about' : '/';
    window.history.pushState({}, '', path);
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (activeDatasetId) {
      fetch('/api/datasets')
        .then(res => res.json())
        .then(datasets => {
          const ds = datasets.find((d: any) => d.id === activeDatasetId);
          if (ds) {
            setAudit(ds);
            setPreview(ds.preview);
            setFileName(ds.name);
            setSelectedCol(ds.schema[0]?.name || null);
          }
        });
    }
  }, [activeDatasetId]);

  const handleAuthOverlayClose = useCallback(() => {
    setShowAuthOverlay(false);
  }, []);

  const handleAuthOverlayOpen = useCallback(() => {
    setShowAuthOverlay(true);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="space-y-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Syncing Intelligence...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) {
      return (
        <div className="light">
          <React.Suspense fallback={<LoadingFallback />}>
            {currentPage === 'about' ? (
              <AboutPage onAuth={handleAuthOverlayOpen} />
            ) : (
              <LandingPage onAuth={handleAuthOverlayOpen} />
            )}
            <AnimatePresence mode="wait">
              {showAuthOverlay && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                  onClick={handleAuthOverlayClose}
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md relative"
                  >
                    <div className="absolute -top-12 right-0">
                      <button 
                        onClick={handleAuthOverlayClose}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                      <AuthModal />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Suspense>
          <React.Suspense fallback={null}><LazyToaster /></React.Suspense>
        </div>
      );
    }

    if (!isEmailVerified) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]">
          <div className="space-y-4 text-center max-w-md p-4">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Verify Your Email</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Check your email for a verification link. Once verified, you'll have full access.
            </p>
            <button
              onClick={() => signOut()}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    return (
      <TooltipProvider>
        <div className="flex h-screen w-full bg-brand-background overflow-hidden selection:bg-brand-primary/10 transition-colors">
          <React.Suspense fallback={null}><LazyToaster position="top-right" richColors /></React.Suspense>
          <React.Suspense fallback={<LoadingFallback />}>
            <Workspace 
              user={user} 
              onLogout={signOut} 
            />
          </React.Suspense>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <LazyMotion features={domAnimation} strict>
      {renderContent()}
    </LazyMotion>
  );
}
