import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  FolderOpen, 
  Database, 
  Bot, 
  LayoutGrid, 
  FileText, 
  Slack, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  Menu, 
  X,
  Sparkles,
  Terminal,
  LogOut,
  ChevronRight,
  MoreVertical,
  Plus,
  Home,
  ChevronDown,
  Share2,
  Download,
  User,
  Link as LinkIcon,
  HelpCircle as HelpIcon,
  PlusCircle,
  History as HistoryIcon,
  Sun,
  Moon,
  Clock,
  CloudUpload,
  ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { apiGet } from '../lib/apiClient';
import { toast } from 'sonner';
import { FilesView } from './views/FilesView';
import { DatabasesView } from './views/DatabasesView';
import { CustomAgentsView } from './views/CustomAgentsView';
import { ConnectDataView } from './views/ConnectDataView';
import { NotebooksView } from './views/NotebooksView';
import { NotebookTemplatesView } from './views/NotebookTemplatesView';
import { CommunityView } from './views/CommunityView';
import { HomeView } from './views/HomeView';
import { ContactView } from './views/ContactView';
import { TodoView } from './views/TodoView';

import { SettingsView } from './SettingsView';
import { HistoryView } from './views/HistoryView';
import { ReactLenis } from 'lenis/react';
import { InteractiveRobot } from './InteractiveRobot';

interface WorkspaceProps {
  user: any;
  onLogout: () => void;
  activeDatasetId?: string | null;
}

export type ViewType = 'home' | 'files' | 'databases' | 'agents' | 'connect' | 'notebooks' | 'notebookTemplates' | 'community' | 'settings' | 'help' | 'contact' | 'history' | 'tasks';

export const Workspace = ({ user, onLogout }: WorkspaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const { getToken } = useAuth();
  const [activeView, setActiveView] = React.useState<ViewType>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = React.useState(false);
  const [initialPrompt, setInitialPrompt] = React.useState('');
  const [isDraggingFile, setIsDraggingFile] = React.useState(false);
  const roboConstraintsRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ datasets: any[], history: any[] }>({ datasets: [], history: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };

    const handleNavigate = (e: any) => {
      if (e.detail) setActiveView(e.detail);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('ct-navigate' as any, handleNavigate);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('ct-navigate' as any, handleNavigate);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({ datasets: [], history: [] });
      return;
    }

    const performSearch = async () => {
      try {
        const [datasetsRes, historyRes] = await Promise.all([
          apiGet('/api/datasets', getToken),
          apiGet('/api/history', getToken)
        ]);

        if (datasetsRes.ok && historyRes.ok) {
          setSearchResults({
            datasets: (datasetsRes.data || []).filter((d: any) => d.name.toLowerCase().includes(searchQuery.toLowerCase())),
            history: (historyRes.data || []).filter((h: any) => h.query.toLowerCase().includes(searchQuery.toLowerCase()))
          });
        } else {
          console.error("Search failed:", datasetsRes.error || historyRes.error);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, getToken]);

  const handleReRun = (record: any) => {
    setInitialPrompt(record.query);
    setActiveView('home');
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUserMenuOpen(false);
    const loadingToast = toast.loading("Uploading profile signature...");

    try {
      // In a real app with Firebase enabled, we would use updateProfile(auth.currentUser)
      // For this session, we'll simulate the update with a local storage or state if possible
      // but since user is from hook, we'll just show success and update UI if we had a setter.
      // I'll add a local state for the custom avatar in Workspace for immediate feedback.
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        toast.success("Identity updated successfully", { id: loadingToast });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Handshake failed during upload", { id: loadingToast });
    }
  };

  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  // Global File Drop Handling
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDraggingFile(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        const loadingToast = toast.loading(`Uploading ${file.name}...`);
        
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
          });

          if (!response.ok) throw new Error('Upload failed');
          
          const dataset = await response.json();
          toast.success(`${file.name} integrated successfully`, { id: loadingToast });
          
          // Switch to files view to show the new dataset
          setActiveView('files');
        } catch (error) {
          toast.error("Handshake failed during upload", { id: loadingToast });
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [getToken]);

  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: LayoutGrid, dropdown: [
      { id: 'home', label: 'Chat', icon: Home },
      { id: 'notebooks', label: 'Notebook', icon: FileText },
    ]},
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'databases', label: 'Databases', icon: Database },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'tasks', label: 'Mission Log', icon: ListTodo },
    { id: 'agents', label: 'Custom Agents', icon: Bot },
    { id: 'notebookTemplates', label: 'Notebook Templates', icon: Sparkles },
    { id: 'connect', label: 'Connect Data', icon: LinkIcon },
  ];

  const footerActions = [
    { id: 'community', label: 'Community Slack', icon: Slack },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'home': return <HomeView initialPrompt={initialPrompt} onClearPrompt={() => setInitialPrompt('')} />;
      case 'files': return <FilesView />;
      case 'databases': return <DatabasesView onNavigate={(view) => setActiveView(view)} />;
      case 'agents': return <CustomAgentsView onLaunch={(prompt) => { setInitialPrompt(prompt); setActiveView('home'); }} />;
      case 'connect': return <ConnectDataView />;
      case 'notebooks': return <NotebooksView />;
      case 'notebookTemplates': return <NotebookTemplatesView onLaunch={(prompt) => { setInitialPrompt(prompt); setActiveView('home'); }} />;
      case 'community': return <CommunityView />;
      case 'history': return <HistoryView onReRun={handleReRun} />;
      case 'tasks': return <TodoView />;
      case 'contact': return <ContactView />;
      case 'help': return <ContactView />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-background dark:bg-zinc-950 overflow-hidden relative">
      {/* Global File Drop Overlay */}
      <AnimatePresence>
        {isDraggingFile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-indigo-600/20 backdrop-blur-md flex items-center justify-center border-4 border-dashed border-indigo-500 m-4 rounded-[2rem] pointer-events-none"
          >
            <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 scale-110">
              <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce">
                <CloudUpload className="w-12 h-12" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Drop to Analyze</h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm">Release to instantly integrate your data source.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SideNavBar */}
      <aside 
        onClick={() => isSidebarCollapsed && setIsSidebarCollapsed(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 transform lg:translate-x-0 cursor-default",
          !isMobileMenuOpen && "-translate-x-full",
          isSidebarCollapsed ? "w-20 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-zinc-800/80" : "w-64"
        )}
      >
        <div className={cn("flex flex-col h-full py-6", isSidebarCollapsed ? "px-2" : "px-4")}>
          {/* User Profile & Brand */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className={cn("flex items-center gap-3 overflow-hidden", isSidebarCollapsed ? "justify-center" : "justify-start")}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">W</div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight truncate">WhyAnalyst</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSidebarCollapsed(true);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Main CTA */}
          <button 
            onClick={() => setActiveView('databases')}
            className={cn(
              "mb-6 flex items-center justify-center bg-slate-900 dark:bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 dark:shadow-indigo-500/10",
              isSidebarCollapsed ? "w-10 h-10 mx-auto p-0" : "w-full gap-2 px-4"
            )}
          >
            <Plus className="w-4 h-4" />
            {!isSidebarCollapsed && <span>New Analysis</span>}
          </button>

          {/* Navigation Scroll Area */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-1" data-lenis-prevent>
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.dropdown) {
                      setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
                      if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                    } else {
                      setActiveView(item.id as ViewType);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group active:scale-[0.98] text-sm",
                    isSidebarCollapsed ? "justify-center px-0" : "",
                    (activeView === item.id || (item.dropdown && item.dropdown.some(d => d.id === activeView)))
                      ? "text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 font-bold border-r-2 border-slate-900 dark:border-indigo-500" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium"
                  )}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.dropdown && (
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isWorkspaceDropdownOpen ? "rotate-180" : "rotate-0")} />
                  )}
                </button>

                {item.dropdown && isWorkspaceDropdownOpen && !isSidebarCollapsed && (
                  <div className="pl-9 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveView(subItem.id as ViewType);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all",
                          activeView === subItem.id
                            ? "text-slate-900 dark:text-white bg-slate-100/50 dark:bg-zinc-800/50 font-bold"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
                        )}
                      >
                        <subItem.icon className="w-3.5 h-3.5" />
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Actions & Footer */}
          <div className="mt-auto space-y-4 pt-4 border-t border-slate-50">
            <div className="space-y-1">
              {footerActions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as ViewType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-1.5 transition-all text-sm font-medium rounded-lg",
                    isSidebarCollapsed ? "justify-center" : "",
                    activeView === item.id 
                      ? "text-slate-900 bg-slate-50 font-bold" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            {/* Upgrade Card */}
            {!isSidebarCollapsed ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mx-2">
                <p className="font-bold text-slate-900 text-sm mb-1">Upgrade Plan</p>
                <p className="text-[10px] text-slate-500 mb-3 font-medium">Get advanced reasoning & higher limits.</p>
                <button className="w-full bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg active:scale-[0.95] transition-transform">Upgrade now</button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-1">
            <button 
                onClick={() => setActiveView('help')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 transition-all text-sm font-medium rounded-lg",
                  isSidebarCollapsed ? "justify-center" : "",
                  activeView === 'help' ? "text-slate-900 bg-slate-50 font-bold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
                title={isSidebarCollapsed ? "Help" : ""}
              >
                <HelpCircle className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>Help</span>}
              </button>
              <button 
                onClick={onLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium rounded-lg",
                  isSidebarCollapsed ? "justify-center" : ""
                )}
                title={isSidebarCollapsed ? "Logout" : ""}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 w-full flex flex-col min-h-0 overflow-hidden relative bg-slate-50 dark:bg-zinc-950 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top App Bar - Desktop Optimized */}
        <header className="h-16 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
            >
              <LayoutGrid className={cn("w-5 h-5 transition-transform", isSidebarCollapsed ? "rotate-90" : "rotate-0")} />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 flex-1 justify-end">
            <div className="hidden md:block relative max-w-md lg:max-w-xl w-full mx-2 lg:mx-4" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Global search (datasets, history...)"
                  className="w-full bg-slate-100 dark:bg-zinc-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-0 outline-none transition-all dark:text-white"
                />
              </div>

              {showSearchResults && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 max-h-[400px] overflow-y-auto overflow-x-hidden p-2 animate-in fade-in slide-in-from-top-2" data-lenis-prevent>
                  {searchResults.datasets.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        Datasets
                      </p>
                      {searchResults.datasets.map(ds => (
                        <button 
                          key={ds.id}
                          onClick={() => {
                            setActiveView('files');
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 group"
                        >
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{ds.name}</p>
                            <p className="text-[10px] text-slate-400">{ds.rows} rows • {ds.columns} cols</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.history.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        History
                      </p>
                      {searchResults.history.map(h => (
                        <button 
                          key={h.id}
                          onClick={() => {
                            handleReRun(h);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 group"
                        >
                          <HistoryIcon className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{h.query}</p>
                            <p className="text-[10px] text-slate-400">{h.datasetName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.datasets.length === 0 && searchResults.history.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-xs text-slate-400 italic">No matches found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 relative" ref={userMenuRef}>
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "p-1.5 rounded-xl transition-all flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 border-2",
                  isUserMenuOpen ? "border-indigo-600 dark:border-indigo-500 bg-slate-50 dark:bg-zinc-800" : "border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
                title="User Profile"
              >
                {customAvatar || user?.photoURL ? (
                  <img src={customAvatar || user?.photoURL} alt="Profile" className="w-6 h-6 rounded-lg object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                  </div>
                )}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800 mb-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.displayName || 'Authorized User'}</p>
                        {localStorage.getItem('ct_user_tier') === 'pro' && (
                          <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">PRO</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <button 
                      onClick={() => { setActiveView('settings'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Account Settings
                    </button>

                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Upload Avatar
                    </button>

                    <div className="h-px bg-slate-50 dark:bg-zinc-800 my-1"></div>

                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>

                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Canvas Body - Desktop Responsive */}
        <ReactLenis className="flex-1 overflow-y-auto overflow-x-hidden">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeView}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="min-h-full w-full"
             >
                {renderActiveView()}
             </motion.div>
           </AnimatePresence>
        </ReactLenis>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden"
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating Robot Assistant with Screen Constraints */}
      <div ref={roboConstraintsRef} className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
        <div className="absolute bottom-24 right-8 pointer-events-auto hidden md:block">
          <InteractiveRobot dragConstraints={roboConstraintsRef} />
        </div>
      </div>
    </div>
  );
};
