import React, { useEffect, useState } from 'react';
import { 
  Settings2, 
  Moon, 
  Sun, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Save,
  ChevronRight,
  User as UserIcon,
  Bell,
  Globe,
  HardDrive,
  Activity,
  Zap,
  Mail,
  Shield,
  Plus,
  Trash2,
  Copy,
  Share,
  Smartphone
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { ProfileImageUpload } from './ProfileImageUpload';

interface SettingsViewProps {
  initialTab?: 'preferences' | 'account' | 'usage' | 'security' | 'api' | 'admin';
  onNavigate?: (tab: string) => void;
}

export const SettingsView = ({ initialTab = 'preferences', onNavigate }: SettingsViewProps) => {
  const { theme, setTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsViewProps['initialTab']>(initialTab as any);
  const [settings, setSettings] = useState<any>(null);
  const [userTier, setUserTier] = useState(localStorage.getItem('ct_user_tier') || 'free');

  const handleUpgradeClick = () => {
    const newTier = userTier === 'free' ? 'pro' : 'free';
    setUserTier(newTier);
    localStorage.setItem('ct_user_tier', newTier);
    toast.success(`Account switched to ${newTier.toUpperCase()} tier`);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(() => setSettings({ model: 'gemini-1.5-flash', emailNotifications: true }));
  }, []);

  const handleUpdate = async (update: any) => {
    try {
      if (update.theme) {
        setTheme(update.theme);
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      const data = await res.json();
      setSettings(data);
      toast.success("Preferences updated");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  if (!settings) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#050505] overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="w-full space-y-8">
          <header className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-wider">Workspace Control</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Configure your engine persona, identity, and system resources.</p>
            </div>

            <div className="flex gap-1 bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-fit overflow-x-auto no-scrollbar max-w-full">
              {[
                { id: 'preferences', label: 'Preferences', icon: Settings2 },
                { id: 'account', label: 'Account', icon: UserIcon },
                ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : []),
                { id: 'security', label: 'Security', icon: ShieldCheck },
                { id: 'api', label: 'API Keys', icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          <main className="max-w-5xl">
            {activeTab === 'preferences' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Model Configuration</h2>
                      <p className="text-xs text-zinc-500 font-medium">Select your primary reasoning engine.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Enterprise reasoning & deep analysis' },
                      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'High-speed processing & real-time' },
                      { id: 'gpt-4o', name: 'GPT-4o Integration', desc: 'Versatile multimodal capability' }
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleUpdate({ model: model.id })}
                        className={cn(
                          "w-full p-5 rounded-2xl border text-left transition-all group",
                          settings.model === model.id 
                            ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500" 
                            : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-600"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{model.name}</h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{model.desc}</p>
                          </div>
                          {settings.model === model.id && (
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Appearance</h2>
                      <p className="text-xs text-zinc-500 font-medium">Personalize your workspace aesthetics.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleUpdate({ theme: 'light' })}
                      className={cn(
                        "p-6 rounded-2xl border flex flex-col items-center gap-4 transition-all",
                        theme === 'light' ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                      )}
                    >
                      <Sun className="w-6 h-6 text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Solar Light</span>
                    </button>
                    <button 
                      onClick={() => handleUpdate({ theme: 'dark' })}
                      className={cn(
                        "p-6 rounded-2xl border flex flex-col items-center gap-4 transition-all",
                        theme === 'dark' ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                      )}
                    >
                      <Moon className="w-6 h-6 text-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Deep Dark</span>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden">
                  <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
                    <ProfileImageUpload currentPhotoURL={user?.photoURL} />
                  </div>
                  
                  <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            type="text" 
                            defaultValue={user?.displayName || ''} 
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Contact Email</label>
                          <div className="relative">
                             <input 
                               type="email" 
                               value={user?.email || ''} 
                               disabled 
                               className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-zinc-400 outline-none"
                             />
                             <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          </div>
                       </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-6">
                          <div className={cn("w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white", 
                            userTier === 'pro' ? "text-amber-300" : "text-white"
                          )}>
                             <Zap className="w-8 h-8 fill-current" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black uppercase tracking-tight">{userTier === 'pro' ? 'Pro Member' : 'Free Analyst'}</h3>
                             <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest">{userTier === 'pro' ? 'Enterprise Shield Active' : 'Limited Neural Capacity'}</p>
                          </div>
                       </div>
                       <Button 
                         onClick={handleUpgradeClick}
                         className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                       >
                          {userTier === 'pro' ? 'Revert to Free' : 'Instant Upgrade to PRO'}
                       </Button>
                    </div>
                 </div>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center gap-4 pb-6 border-b border-zinc-50 dark:border-zinc-800">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Security Hardening</h2>
                          <p className="text-xs text-zinc-500 font-medium">Protect your intellectual property and data integrity.</p>
                       </div>
                    </div>

                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                       <div className="py-6 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                             <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Two-Factor Authentication</h3>
                             <p className="text-[11px] text-zinc-500 max-w-sm">Add an extra layer of security to your workspace using biometric or TOTP verification.</p>
                          </div>
                          <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest h-10 px-6">Configure</Button>
                       </div>

                       <div className="py-6 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                             <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Audit Logs</h3>
                             <p className="text-[11px] text-zinc-500 max-w-sm">Review all sensitive operations performed in your environment over the last 90 days.</p>
                          </div>
                          <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest h-10 px-6">View Logs</Button>
                       </div>

                       <div className="py-6 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                             <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Active Sessions</h3>
                             <p className="text-[11px] text-zinc-500 max-w-sm">You are currently logged in on 3 devices. Terminate all other sessions if you suspect unauthorized access.</p>
                          </div>
                          <Button variant="outline" className="rounded-xl border-red-100 dark:border-red-900/30 text-red-500 text-[10px] font-black uppercase tracking-widest h-10 px-6 hover:bg-red-50 dark:hover:bg-red-500/10">Purge Others</Button>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-50 dark:border-zinc-800">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                             <Zap className="w-6 h-6" />
                          </div>
                          <div>
                             <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">API Infrastructure</h2>
                             <p className="text-xs text-zinc-500 font-medium">Manage programatic access keys for integration pipelines.</p>
                          </div>
                       </div>
                       <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2">
                          <Plus className="w-4 h-4" /> Generate New Key
                       </Button>
                    </div>

                    <div className="space-y-4">
                       {[
                         { name: 'Production Pipeline', key: 'pk_live_••••••••••••••••••••3a2f', created: '2024-03-12', lastUsed: '5 mins ago' },
                         { name: 'Staging Environment', key: 'pk_test_••••••••••••••••••••9c1e', created: '2024-04-01', lastUsed: 'Yesterday' }
                       ].map((key, i) => (
                         <div key={i} className="group p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 flex items-center justify-between hover:border-indigo-500/20 transition-all">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black uppercase tracking-wide text-zinc-900 dark:text-white">{key.name}</h4>
                                  <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter", 
                                    key.name.includes('Production') ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                                  )}>
                                     {key.name.includes('Production') ? 'Active' : 'Staging'}
                                  </span>
                               </div>
                               <code className="text-[10px] font-mono text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">{key.key}</code>
                               <div className="flex gap-3 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-2">
                                  <span>Created: {key.created}</span>
                                  <span>Last Used: {key.lastUsed}</span>
                               </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-800"><Copy className="w-3.5 h-3.5" /></Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center sm:text-left">
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest order-last sm:order-first">Build v4.2.5-stable • Quantum Shield Enhanced</p>
              <div className="flex gap-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Health: Peak</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 ring-1 ring-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3" /> All Systems Nominal
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
