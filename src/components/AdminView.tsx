import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Bell, 
  Clock, 
  Database,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { DashboardOverview } from './admin/DashboardOverview';
import { NotificationHub } from './admin/NotificationHub';
import { AuditLogs } from './admin/AuditLogs';
import { DatabaseViewer } from './admin/DatabaseViewer';
import { AdminSettings } from './admin/AdminSettings';

export const AdminView = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500">
           <Shield className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Access Denied</h1>
           <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">
             You attempt to reach the neural core without proper administrative clearance. This event has been logged.
           </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'notifications', label: 'Broadcasts', icon: Bell },
    { id: 'logs', label: 'Audit Trail', icon: Clock },
    { id: 'database', label: 'Cloud DB', icon: Database },
    { id: 'settings', label: 'Governance', icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-8 w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Admin Neural Core</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Global governance and audit infrastructure</p>
        </div>

        <div className="flex gap-1 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
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
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'notifications' && <NotificationHub />}
        {activeTab === 'logs' && <AuditLogs />}
        {activeTab === 'database' && <DatabaseViewer />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};
