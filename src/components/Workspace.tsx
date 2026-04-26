import React from 'react';
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
  Globe,
  TrendingUp,
  Languages
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { FilesView } from './views/FilesView';
import { DatabasesView } from './views/DatabasesView';
import { CustomAgentsView } from './views/CustomAgentsView';
import { ConnectDataView } from './views/ConnectDataView';
import { NotebooksView } from './views/NotebooksView';
import { NotebookTemplatesView } from './views/NotebookTemplatesView';
import { CommunityView } from './views/CommunityView';
import { HomeView } from './views/HomeView';
import { ContactView } from './views/ContactView';

import { SettingsView } from './SettingsView';
import { HistoryView } from './views/HistoryView';
import { DashboardView } from './DashboardView';

interface WorkspaceProps {
  user: any;
  onLogout: () => void;
  activeDatasetId?: string | null;
}

export type ViewType = 'home' | 'files' | 'databases' | 'agents' | 'connect' | 'notebooks' | 'notebookTemplates' | 'community' | 'settings' | 'help' | 'contact' | 'history' | 'dashboard';

const TRANSLATIONS = {
  en: {
    chat: 'Chat',
    notebook: 'Notebook',
    files: 'Files',
    databases: 'Databases',
    history: 'History',
    agents: 'Custom Agents',
    templates: 'Notebook Templates',
    connect: 'Connect Data',
    community: 'Community Slack',
    settings: 'Settings',
    upgrade: 'Upgrade Plan',
    newAnalysis: 'New Analysis',
    workspace: 'Workspace',
    help: 'Help',
    logout: 'Logout',
    notifications: 'Notifications',
    profile: 'Profile'
  },
  ur: {
    chat: 'چیٹ',
    notebook: 'نوٹ بک',
    files: 'فائلیں',
    databases: 'ڈیٹا بیس',
    history: 'تاریخ',
    agents: 'کسٹم ایجنٹس',
    templates: 'ٹیمپلیٹس',
    connect: 'ڈیٹا جوڑیں',
    community: 'کمیونٹی سلیک',
    settings: 'ترتیبات',
    upgrade: 'اپ گریڈ پلان',
    newAnalysis: 'نیا تجزیہ',
    workspace: 'ورک سپیس',
    help: 'مدد',
    logout: 'لاگ آؤٹ',
    notifications: 'اطلاعات',
    profile: 'پروفائل'
  }
};

export const Workspace = ({ user, onLogout }: WorkspaceProps) => {
  const [activeView, setActiveView] = React.useState<ViewType>('dashboard');
  const [language, setLanguage] = React.useState<'en' | 'ur'>('en');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = React.useState(false);
  const [initialPrompt, setInitialPrompt] = React.useState('');
  
  const t = TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // New UI states
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = React.useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);

  const handleReRun = (record: any) => {
    setInitialPrompt(record.query);
    setActiveView('home');
  };

  const handleUpgradeTrigger = () => {
    setIsUpgradeModalOpen(true);
  };

  const navItems = [
    { id: 'dashboard', label: t.workspace, icon: LayoutGrid },
    { id: 'home', label: t.chat, icon: Home },
    { id: 'notebooks', label: t.notebook, icon: FileText },
    { id: 'files', label: t.files, icon: FolderOpen },
    { id: 'databases', label: t.databases, icon: Database },
    { id: 'history', label: t.history, icon: HistoryIcon },
    { id: 'agents', label: t.agents, icon: Bot },
    { id: 'notebookTemplates', label: t.templates, icon: Sparkles },
    { id: 'connect', label: t.connect, icon: LinkIcon },
  ];

  const footerActions = [
    { id: 'community', label: t.community, icon: Slack },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView onStartAnalysis={() => setIsNewAnalysisModalOpen(true)} language={language} onNavigate={(view: any) => setActiveView(view)} />;
      case 'home': return <HomeView initialPrompt={initialPrompt} onClearPrompt={() => setInitialPrompt('')} onUpgrade={handleUpgradeTrigger} onNavigate={(view: ViewType) => setActiveView(view)} />;
      case 'files': return <FilesView />;
      case 'databases': return <DatabasesView />;
      case 'agents': return <CustomAgentsView />;
      case 'connect': return <ConnectDataView />;
      case 'notebooks': return <NotebooksView />;
      case 'notebookTemplates': return <NotebookTemplatesView />;
      case 'community': return <CommunityView />;
      case 'history': return <HistoryView onReRun={handleReRun} />;
      case 'contact': return <ContactView />;
      case 'help': return <ContactView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView onStartAnalysis={() => setIsNewAnalysisModalOpen(true)} language={language} onNavigate={(view: any) => setActiveView(view)} />;
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={cn("flex w-full h-screen bg-brand-background dark:bg-zinc-950 overflow-hidden relative", isRTL && "font-urdu")}>
      {/* SideNavBar */}
      <aside 
        onClick={() => isSidebarCollapsed && setIsSidebarCollapsed(false)}
        className={cn(
          "fixed inset-y-0 z-50 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 transition-all duration-300 transform lg:translate-x-0 cursor-default",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          !isMobileMenuOpen && (isRTL ? "translate-x-full" : "-translate-x-full"),
          isSidebarCollapsed ? "w-20 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-zinc-800/80" : "w-64"
        )}
      >
        <div className={cn("flex flex-col h-full py-6", isSidebarCollapsed ? "px-2" : "px-4")}>
          {/* User Profile & Brand */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className={cn("flex items-center gap-3 overflow-hidden", isSidebarCollapsed ? "justify-center" : "justify-start")}>
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">J</div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight truncate">Cognitive Tech</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium truncate">AI Data Scientist</span>
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
            onClick={() => setIsNewAnalysisModalOpen(true)}
            className={cn(
              "mb-6 flex items-center justify-center bg-slate-900 dark:bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 dark:shadow-indigo-500/10",
              isSidebarCollapsed ? "w-10 h-10 mx-auto p-0" : "w-full gap-2 px-4"
            )}
          >
            <Plus className={cn("w-4 h-4", isRTL && "ml-1")} />
            {!isSidebarCollapsed && <span>{t.newAnalysis}</span>}
          </button>

          {/* Navigation Scroll Area */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'community') {
                      window.open('https://slack.com', '_blank');
                    } else {
                      setActiveView(item.id as ViewType);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group active:scale-[0.98] text-sm",
                    isSidebarCollapsed ? "justify-center px-0" : "",
                    activeView === item.id 
                      ? "text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 font-bold" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium",
                    activeView === item.id && (isRTL ? "border-l-2 border-indigo-500" : "border-r-2 border-slate-900 dark:border-indigo-500")
                  )}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                </button>
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
                    if (item.id === 'community') {
                      window.open('https://slack.com', '_blank');
                    } else {
                      setActiveView(item.id as ViewType);
                      setIsMobileMenuOpen(false);
                    }
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
              <div className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-4 mx-2">
                <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t.upgrade}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mb-3 font-medium">Get advanced reasoning & higher limits.</p>
                <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-bold py-2 rounded-lg active:scale-[0.95] transition-transform"
                >
                  {isRTL ? "ابھی اپ گریڈ کریں" : "Upgrade now"}
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                >
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
                title={isSidebarCollapsed ? t.help : ""}
              >
                <HelpCircle className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>{t.help}</span>}
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium rounded-lg",
                  isSidebarCollapsed ? "justify-center" : ""
                )}
                title={isSidebarCollapsed ? t.logout : ""}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>{t.logout}</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-slate-50 dark:bg-zinc-950 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? (isRTL ? "lg:mr-20 ml-0" : "lg:ml-20 mr-0") : (isRTL ? "lg:mr-64 ml-0" : "lg:ml-64 mr-0")
        )}
      >
        {/* Top App Bar */}
        <header className="h-16 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
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
            <div 
              onClick={() => setIsWorkspaceSwitcherOpen(!isWorkspaceSwitcherOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition-colors group relative"
            >
              <div className="w-7 h-7 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-black/5 group-hover:scale-110 transition-transform">C</div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">Cognitive Tech</span>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 hidden sm:block transition-transform", isWorkspaceSwitcherOpen ? "rotate-180" : "rotate-0")} />

              {/* Workspace Switcher Dropdown */}
              <AnimatePresence>
                {isWorkspaceSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 overflow-hidden",
                      isRTL ? "right-0" : "left-0"
                    )}
                  >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Switch Workspace</div>
                    {['Marketing Team', 'Product Analytics', 'Engineering Hub'].map((ws) => (
                      <button 
                        key={ws}
                        onClick={(e) => { e.stopPropagation(); setIsWorkspaceSwitcherOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {ws}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className={cn(
                    "p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl flex items-center gap-2",
                    isLanguageMenuOpen && "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white"
                  )}
                  title="Change Language"
                >
                  <Languages className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{language}</span>
                </button>
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={cn(
                        "absolute top-full mt-2 w-32 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 overflow-hidden",
                        isRTL ? "left-0" : "right-0"
                      )}
                    >
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'ur', label: 'اردو' },
                      ].map((lang) => (
                        <button 
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code as any); setIsLanguageMenuOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors",
                            language === lang.code ? "text-indigo-600 font-bold bg-indigo-50/50 dark:bg-indigo-900/20" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                          )}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className={cn(
                  "p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative rounded-xl",
                  isNotificationsOpen && "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white"
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group relative rounded-xl",
                    isProfileOpen && "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white"
                  )}
                  title={t.profile}
                >
                  <User className="w-5 h-5 relative z-10" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={cn(
                        "absolute top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 overflow-hidden",
                        isRTL ? "left-0" : "right-0"
                      )}
                    >
                      <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800 mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">John Doe</p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium truncate">john@example.com</p>
                      </div>
                      {[
                        { label: t.profile, icon: User, action: () => setActiveView('settings') },
                        { label: t.settings, icon: Settings, action: () => setActiveView('settings') },
                        { label: t.logout, icon: LogOut, action: () => setIsLogoutModalOpen(true), color: 'text-red-500' },
                      ].map((item) => (
                        <button 
                          key={item.label}
                          onClick={() => { item.action(); setIsProfileOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors",
                            item.color || "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Canvas Body */}
        <div className="flex-1 overflow-y-auto px-0 sm:px-4 lg:px-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeView}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="min-h-full w-full max-w-[1920px] mx-auto"
             >
                {renderActiveView()}
             </motion.div>
           </AnimatePresence>
        </div>

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

        {/* Notifications Sliding Panel */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotificationsOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl z-[70] border-l border-slate-200 dark:border-zinc-800"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <button onClick={() => setIsNotificationsOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {[
                      { title: 'System Update', desc: 'New advanced reasoning model deployed.', time: '2m ago' },
                      { title: 'New Dataset', desc: 'Marketing_Data.csv successfully indexed.', time: '1h ago' },
                      { title: 'Security Alert', desc: 'New login detected from Karachi, PK.', time: '4h ago' },
                    ].map((n, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">{n.desc}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black mt-2 tracking-widest">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {isUpgradeModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsUpgradeModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
              >
                <div className="p-8 sm:p-12">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Upgrade Your Power</h2>
                      <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Join 10,000+ data scientists using Cognitive Tech Pro.</p>
                    </div>
                    <button onClick={() => setIsUpgradeModalOpen(false)} className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl hover:scale-110 transition-transform">
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <div className="p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Free Starter</h3>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">$0<span className="text-sm font-medium text-slate-400">/mo</span></div>
                      <ul className="space-y-4 mb-8">
                        {['3 Analysis Tokens / day', 'Basic CSV processing', 'Standard Reasoning'].map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-zinc-400">
                            <PlusCircle className="w-4 h-4 text-slate-300" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button disabled className="w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-zinc-800 text-slate-400 font-black uppercase tracking-widest text-xs">Current Plan</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-[2rem] border-2 border-slate-900 dark:border-indigo-600 bg-white dark:bg-zinc-900 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
                      <div className="absolute top-6 right-6 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">MOST POPULAR</div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pro Scientist</h3>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">$29<span className="text-sm font-medium text-slate-400">/mo</span></div>
                      <ul className="space-y-4 mb-8">
                        {['Unlimited Tokens', 'Full SQL & Cloud Integrations', 'Advanced Reasoning Engine', 'Priority Support'].map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                            <Sparkles className="w-4 h-4 text-indigo-500" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Upgrade Now</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* New Analysis Modal */}
        <AnimatePresence>
          {isNewAnalysisModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
              >
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">New Analysis</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => { setActiveView('files'); setIsNewAnalysisModalOpen(false); }}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FolderOpen className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Upload Dataset</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">CSV, Excel, or JSON files</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => { setActiveView('connect'); setIsNewAnalysisModalOpen(false); }}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Connect Database</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">PostgreSQL, Snowflake, BigQuery</p>
                    </div>
                  </button>
                </div>
                <button onClick={() => setIsNewAnalysisModalOpen(false)} className="w-full mt-6 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Cancel</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {isLogoutModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800 text-center"
              >
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LogOut className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">End Session?</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8">Are you sure you want to log out of your workspace?</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={onLogout} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-transform">Logout</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
