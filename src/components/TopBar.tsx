import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  ChevronDown, 
  User,
  Bell,
  Search,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  UserCircle,
  BarChart2,
  CheckCircle,
  CreditCard,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  fileName?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
  activeModel: string;
  onModelChange: (model: string) => void;
  isPremium?: boolean;
  isAdmin?: boolean;
  onTabChange?: (tab: string) => void;
}

const MODELS = [
  { id: 'gemini-1.5-flash', name: 'Model 1.1 Lite', description: 'Fast, efficient for quick insights' },
  { id: 'gemini-1.5-pro', name: 'Model 2.0 Pro', description: 'Deep reasoning and complex math' },
  { id: 'legacy-analyst', name: 'Legacy Analyst', description: 'Optimized for spreadsheet logic' },
];

export const TopBar = ({ 
  fileName, 
  onUpload, 
  onExport, 
  theme, 
  onToggleTheme, 
  onOpenSearch,
  activeModel, 
  onModelChange,
  isPremium = false,
  isAdmin,
  onTabChange
}: TopBarProps) => {
  const { user, signOut: authSignOut } = useAuth();
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) setShowModelMenu(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    toast.info("Logging out...");
    try {
      if (authSignOut) await authSignOut();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleUpgrade = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Redirecting to Stripe...',
        success: 'Welcome to Pro!',
        error: 'Payment failed'
      }
    );
  };

  return (
    <header className="h-14 lg:h-16 border-b border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-[#050505] flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 sticky top-0 z-40 transition-colors">
      {/* Model Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 relative" ref={modelMenuRef}>
        <Tooltip>
          <TooltipTrigger>
            <button 
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group border border-transparent hover:border-gray-100 dark:hover:border-zinc-800"
            >
              <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 leading-none truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none">
                {MODELS.find(m => m.id === activeModel)?.name || activeModel}
              </span>
              <ChevronDown className={cn("w-3.5 h-3.5 sm:w-4 h-4 text-gray-400 transition-transform", showModelMenu && "rotate-180")} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            AI Model Selector: Different models offer varying levels of reasoning speed and complexity.
          </TooltipContent>
        </Tooltip>

        {showModelMenu && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-1">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setShowModelMenu(false);
                  toast.success(`Switched to ${model.name}`);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 flex flex-col gap-0.5",
                  activeModel === model.id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                )}
              >
                <span className={cn("text-xs font-bold", activeModel === model.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100")}>
                  {model.name}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{model.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center Badge - Responsive Visibility */}
      <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          isPremium ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
        )}>
          {isPremium ? 'Pro Plan' : 'Free plan'}
        </span>
        {!isPremium && (
          <>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button 
              onClick={handleUpgrade}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Upgrade
            </button>
          </>
        )}
      </div>

      {/* Right Actions - Desktop Responsive */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleTheme}
                className="h-9 w-9 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100 rounded-lg"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Toggle Theme</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenSearch}
                className="hidden md:flex h-9 w-9 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100 rounded-lg"
              >
                <Search className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Search (⌘K)</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 mx-1"></div>

        <div className="relative" ref={userMenuRef}>
          <Tooltip>
            <TooltipTrigger>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 group"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-all">
                   {user?.photoURL ? (
                     <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                   )}
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", showUserMenu && "rotate-180")} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">User Profile & Account Settings</TooltipContent>
          </Tooltip>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-gray-100 dark:border-zinc-800 mb-1">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{user?.displayName || 'Analyst Session'}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              
              <button 
                onClick={() => {
                  onTabChange?.('account');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
              >
                <UserCircle className="w-4 h-4" />
                Account Settings
              </button>
              {isAdmin && (
                <button 
                  onClick={() => {
                    onTabChange?.('admin');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all font-semibold"
                >
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Admin Panel
                </button>
              )}
              <button 
                onClick={() => {
                  onTabChange?.('usage');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
              >
                <BarChart2 className="w-4 h-4" />
                Usage Statistics
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Verification Status
              </button>
              
              <div className="my-1 h-px bg-gray-100 dark:border-zinc-800" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
