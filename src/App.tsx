import React, { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { useTheme } from './hooks/useTheme';
import { Workspace } from './components/Workspace';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, isAdmin, signOut } = useAuth();
  
  // Navigation & UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSearch, setShowSearch] = useState(false);
  
  // Data State
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [audit, setAudit] = useState<any | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  // Role-based auto-navigation for administrators on login
  useEffect(() => {
    if (user && isAdmin && activeTab === 'dashboard') {
      setActiveTab('admin');
    }
  }, [isAdmin, !!user]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect: When active dataset changes, update context
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

  if (!user) {
    return (
      <>
        <LandingPage onAuth={() => setShowAuthOverlay(true)} />
        <AnimatePresence>
          {showAuthOverlay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAuthOverlay(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md relative"
              >
                <div className="absolute -top-12 right-0">
                  <button 
                    onClick={() => setShowAuthOverlay(false)}
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
      </>
    );
  }


  return (
    <TooltipProvider>
      <div className="flex h-screen bg-brand-background overflow-hidden selection:bg-brand-primary/10 transition-colors">
        <Toaster position="top-right" richColors />
        <Workspace 
          user={user} 
          onLogout={signOut} 
        />
      </div>
    </TooltipProvider>
  );
}
