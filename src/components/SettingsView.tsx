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
  CreditCard,
  BarChart3,
  HardDrive,
  Activity,
  Zap,
  Mail,
  Shield,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { ProfileImageUpload } from './ProfileImageUpload';

interface SettingsViewProps {
  initialTab?: 'preferences' | 'account' | 'usage';
  onNavigate?: (tab: string) => void;
}

export const SettingsView = ({ initialTab = 'preferences', onNavigate }: SettingsViewProps) => {
  const { theme, setTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'preferences' | 'account' | 'usage' | 'security' | 'api'>(initialTab as any);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setActiveTab(initialTab as any);
  }, [initialTab]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(() => setSettings({ model: 'gemini-3-flash-preview', emailNotifications: true }));
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
                { id: 'usage', label: 'Statistics', icon: BarChart3 },
                { id: 'security', label: 'Security', icon: ShieldCheck },
                { id: 'api', label: 'API Keys', icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'admin') {
                      onNavigate?.('admin');
                    } else {
                      setActiveTab(tab.id as any);
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {activeTab === 'preferences' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8">
                <div className="flex items-center gap-3 pb-6 border-b border-zinc-50 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Appearance & Visuals</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Customize the workspace aesthetic ecosystem.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">System Theme</h3>
                      <p className="text-[11px] text-zinc-500 font-medium">Select your preferred color profile for the interface.</p>
                    </div>
                    <div className="flex bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl w-fit border border-zinc-100 dark:border-zinc-700">
                      <button 
                        onClick={() => handleUpdate({ theme: 'light' })}
                        className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", theme === 'light' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")}
                      >
                        <Sun className="w-3.5 h-3.5" /> Light
                      </button>
                      <button 
                        onClick={() => handleUpdate({ theme: 'dark' })}
                        className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", theme === 'dark' ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400")}
                      >
                        <Moon className="w-3.5 h-3.5" /> Dark
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Intelligent Persona</h3>
                      <p className="text-[11px] text-zinc-500 font-medium">Select the default model for automated reasoning.</p>
                    </div>
                    <select 
                      value={settings.model}
                      onChange={(e) => handleUpdate({ model: e.target.value })}
                      className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none w-full sm:w-auto cursor-pointer"
                    >
                      <option value="gemini-3-flash-preview">Flash Pro (Realtime)</option>
                      <option value="gemini-1.5-pro">Model 1.5 (Reasoning)</option>
                    </select>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4 group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Privacy Protocols</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">Manage encryption keys and access logs.</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4 group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-500" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Notification Ops</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">Configure push alerts and webhooks.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  <ProfileImageUpload currentPhotoURL={user?.photoURL} />
                  
                  <div className="flex-1 space-y-6 text-center sm:text-left">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{user?.displayName || 'Active Analyst'}</h2>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                           <Shield className="w-3.5 h-3.5" /> Verified Researcher
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                           <Mail className="w-4 h-4 text-zinc-400" />
                           <div className="text-left">
                              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter leading-none mb-1">Email Address</p>
                              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{user?.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                           <CreditCard className="w-4 h-4 text-zinc-400" />
                           <div className="text-left">
                              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter leading-none mb-1">Billing Tier</p>
                              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Enterprise Shield • Pro</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Button variant="outline" className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest border-zinc-200 dark:border-zinc-800">Edit Profile</Button>
                        <Button className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700">Manage Subscription</Button>
                     </div>
                  </div>
               </div>

               {isAdmin && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-8 rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-500 shadow-2xl shadow-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8 mt-6"
                 >
                   <div className="flex items-center gap-6 text-center md:text-left">
                     <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                       <Shield className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Admin Neural Core</h3>
                       <p className="text-[11px] font-bold text-white/70 uppercase tracking-tight max-w-sm">
                         Access global governance, user registry, and system-wide telemetry protocols.
                       </p>
                     </div>
                   </div>
                   <Button 
                     onClick={() => onNavigate?.('admin')}
                     className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                   >
                     Launch Admin Panel <ChevronRight className="w-4 h-4 ml-2" />
                   </Button>
                 </motion.div>
               )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Token Units', val: '1.2M', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Storage Cap', val: '8.4 GB', icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Query Cycles', val: '42k+', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                       <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                       <h4 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{stat.val}</h4>
                    </div>
                  ))}
               </div>

               <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Resource Allocation</h3>
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Billing Cycle ends in 12 days</span>
                  </div>
                  
                  <div className="space-y-6">
                     {[
                       { label: 'AI Inference Engines', used: 75, total: 100, unit: 'Requests' },
                       { label: 'Vector Storage Memory', used: 32, total: 50, unit: 'Docs' },
                       { label: 'Compute Instances', used: 12, total: 15, unit: 'Threads' }
                     ].map((res, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-zinc-500 font-bold">{res.label}</span>
                             <span className="text-zinc-900 dark:text-white">{res.used} / {res.total} {res.unit}</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(res.used / res.total) * 100}%` }}
                               className="h-full bg-indigo-500 rounded-full" 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
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
                     <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 text-[10px] font-black uppercase tracking-widest gap-2">
                        <Plus className="w-4 h-4" /> Generate Key
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
        </div>
      </div>
    </div>
  );
};
