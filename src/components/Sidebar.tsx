import React from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Files, 
  Link2, 
  UserCircle2, 
  ChevronDown, 
  Plus,
  Sparkles,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  History,
  Settings,
  HelpCircle,
  LucideIcon,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  isPlaceholder?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
}

export const Sidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab }: SidebarProps) => {
  const { user, isAdmin, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      if (signOut) await signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const navSections: NavSection[] = [
    {
      title: 'Analyze',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
        { id: 'analysis', icon: MessageSquare, label: 'Chat Assistant' },
      ]
    },
    {
      title: 'Data Connectors',
      items: [
        { id: 'connectors', icon: Link2, label: 'External Sources' },
      ]
    },
    {
      title: 'Compute',
      items: [
        { id: 'sources', icon: Files, label: 'Data Sources' },
        { id: 'history', icon: History, label: 'Recent Work' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', icon: Settings, label: 'Workspace Settings' },
        ...(isAdmin ? [{ id: 'admin', icon: Shield, label: 'Control Center' }] : []),
        { id: 'agents', icon: UserCircle2, label: 'Custom Agents', isPlaceholder: true },
      ]
    }
  ];

  const isSettingsActive = activeTab === 'settings' || activeTab === 'account' || activeTab === 'usage';

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className={cn(
        "h-screen bg-[#F9FAFB] dark:bg-[#080808] border-r border-[#E5E7EB] dark:border-zinc-800 transition-colors flex flex-col z-50 relative",
      )}
    >
      {/* Workspace Switcher */}
      <div className="p-4">
        {!collapsed ? (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">W</div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Workspace</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </motion.button>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 mx-auto rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                W
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right">Workspace</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* New Button - Standalone Primary Action */}
      <div className="px-4 py-2">
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              onClick={() => setActiveTab('analysis')}
              className="w-full h-11 rounded-full bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </motion.div>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="ghost" onClick={() => setActiveTab('analysis')} className="mx-auto rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <Plus className="w-5 h-5 text-indigo-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && section.title && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2"
              >
                {section.title}
              </motion.p>
            )}
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.id || (item.id === 'settings' && isSettingsActive);
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger>
                      <motion.button
                        whileHover={collapsed ? { scale: 1.1 } : { x: 4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !item.isPlaceholder && setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center rounded-xl transition-all group relative",
                          collapsed ? "justify-center px-0 py-3" : "px-3 py-3 gap-3",
                          isActive 
                            ? "bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm" 
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-zinc-900/50",
                          item.isPlaceholder && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <item.icon className={cn(
                          "shrink-0 transition-colors",
                          collapsed ? "w-5 h-5" : "w-4 h-4",
                          isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        )} />
                        
                        {!collapsed && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between flex-1 min-w-0"
                          >
                            <span className="truncate">{item.label}</span>
                            {item.isPlaceholder && (
                              <span className="text-[8px] bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase tracking-tighter ml-2">Soon</span>
                            )}
                          </motion.div>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    {collapsed ? (
                      <TooltipContent side="right" sideOffset={12}>{item.label}</TooltipContent>
                    ) : (
                      item.isPlaceholder ? <TooltipContent side="right">Coming Soon</TooltipContent> : null
                    )}
                  </Tooltip>
                );
              })}
            </nav>
            {idx < navSections.length - 1 && (
              <div className="mx-3 mt-4 h-px bg-gray-200/50 dark:bg-zinc-800/50" />
            )}
          </div>
        ))}
      </div>

      {/* Upgrade Card - Cleaned up to remove duplicate Zap icon */}
      <div className="p-4 bg-transparent">
        {!collapsed ? (
          <div className="p-4 bg-white dark:bg-zinc-950/50 border border-[#E5E7EB] dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100">
               <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
               Go Premium
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Get deeper insights and faster reasoning.</p>
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-8 text-xs font-bold">
              Upgrade
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <button className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Premium Features</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-2">
        {!collapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-lg shadow-indigo-500/20">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
                ) : (
                  user?.displayName?.[0] || user?.email?.[0] || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user?.displayName || 'Analyst'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-10 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-medium rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <Tooltip>
              <TooltipTrigger>
                <div className="w-9 h-9 mx-auto rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-lg shadow-indigo-500/20">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
                  ) : (
                    user?.displayName?.[0] || user?.email?.[0] || 'U'
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <p className="font-bold">{user?.displayName || 'Analyst'}</p>
                  <p className="text-[10px] opacity-70">{user?.email}</p>
                </div>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 mx-auto flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <Tooltip>
        <TooltipTrigger>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute bottom-6 -right-3 w-6 h-6 bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm z-50 hover:scale-110 transition-all"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        </TooltipContent>
      </Tooltip>
    </motion.aside>
  );
};
