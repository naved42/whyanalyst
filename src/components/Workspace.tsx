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
  History as HistoryIcon
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

interface WorkspaceProps {
  user: any;
  onLogout: () => void;
  activeDatasetId?: string | null;
}

export type ViewType = 'home' | 'files' | 'databases' | 'agents' | 'connect' | 'notebooks' | 'notebookTemplates' | 'community' | 'settings' | 'help' | 'contact' | 'history';

export const Workspace = ({ user, onLogout }: WorkspaceProps) => {
  const [activeView, setActiveView] = React.useState<ViewType>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = React.useState(false);
  const [initialPrompt, setInitialPrompt] = React.useState('');

  const handleReRun = (record: any) => {
    setInitialPrompt(record.query);
    setActiveView('home');
  };

  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: LayoutGrid, dropdown: [
      { id: 'home', label: 'Chat', icon: Home },
      { id: 'notebooks', label: 'Notebook', icon: FileText },
    ]},
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'databases', label: 'Databases', icon: Database },
    { id: 'history', label: 'History', icon: HistoryIcon },
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
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex w-full h-screen bg-brand-background dark:bg-zinc-950 overflow-hidden relative">
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
          <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
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
          "flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-slate-50 dark:bg-zinc-950 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
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
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition-colors group"
            >
              <div className="w-7 h-7 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-black/5 group-hover:scale-110 transition-transform">C</div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">Cognitive Tech</span>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group relative"
                title="Workspace Settings"
              >
                <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 rounded-lg scale-0 group-hover:scale-100 transition-transform origin-center"></div>
                <User className="w-5 h-5 relative z-10" />
              </button>
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
      </main>
    </div>
  );
};
