import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Search, 
  Plus, 
  RefreshCw, 
  ChevronRight, 
  MoreVertical, 
  Snowflake, 
  Table as TableIcon,
  Cpu,
  RefreshCcw,
  Bell,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Table
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatabasesViewProps {
  onNavigate?: (view: any) => void;
}

export const DatabasesView = ({ onNavigate }: DatabasesViewProps) => {
  const [activeConnectors, setActiveConnectors] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ct_active_connectors');
      if (saved) setActiveConnectors(JSON.parse(saved));
    } catch {}
  }, []);
  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Databases</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Manage and monitor your enterprise data connections.</p>
        </div>
        <button 
          onClick={() => onNavigate?.('connect')}
          className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Connect New Source
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { label: 'Total Sources', value: '12', trend: '+2 this month', color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
          { label: 'Health Status', value: '100%', trend: 'All stable', color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-zinc-800' },
          { label: 'Total Tables', value: '1,482', trend: 'Cross-node', color: 'text-slate-500 dark:text-zinc-400', bg: 'bg-slate-50 dark:bg-zinc-800' },
          { label: 'Sync Volume', value: '4.2 TB', trend: '24h window', color: 'text-slate-500 dark:text-zinc-400', bg: 'bg-slate-50 dark:bg-zinc-800' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between flex-wrap gap-2">
              <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
              <span className={cn("text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter whitespace-nowrap", stat.color, stat.bg)}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid of Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* PostgreSQL Card */}
        <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-inner">
                  <Database className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Production RDS</h3>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">aws-east-1.postgresql.com</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest",
                activeConnectors.includes('PostgreSQL') 
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30"
                  : "bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border-slate-100 dark:border-zinc-800"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", activeConnectors.includes('PostgreSQL') ? "bg-emerald-500 animate-pulse" : "bg-slate-300")}></span>
                {activeConnectors.includes('PostgreSQL') ? 'ACTIVE' : 'DISCONNECTED'}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-slate-50 dark:border-zinc-800 mb-6">
              {[
                { label: 'Last Sync', value: '4m ago' },
                { label: 'Tables', value: '142' },
                { label: 'Records', value: '14.2M' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300">Manage Schema</button>
              <button className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300">Sync History</button>
              <button className="w-full sm:w-auto text-xs font-bold px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl ml-auto hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-md">Trigger Sync</button>
            </div>
          </div>
        </div>

        {/* Snowflake Card */}
        <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-zinc-700 shadow-inner">
              <Snowflake className="w-6 h-6" />
            </div>
            <div className="px-2 py-1 bg-slate-900 dark:bg-zinc-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Warehouse</div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Snowflake DW</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-6">Enterprise Data Lake</p>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-400 dark:text-zinc-500">Connection</span>
                <span className={cn(
                  "font-bold uppercase tracking-tighter",
                  activeConnectors.includes('Snowflake') ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                )}>
                  {activeConnectors.includes('Snowflake') ? 'Verified' : 'Required'}
                </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-400 dark:text-zinc-500">Tables</span>
              <span className="font-bold text-slate-900 dark:text-white">842</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-400 dark:text-zinc-500">Latency</span>
              <span className="font-bold text-slate-900 dark:text-white">120ms</span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
              <div className="bg-slate-900 dark:bg-indigo-600 h-full rounded-full w-[85%] transition-all duration-1000"></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">85% Usage Level</p>
          </div>
        </div>

        {/* Recent Activity Bento */}
        <div className="col-span-12 bg-slate-900 dark:bg-zinc-900/50 text-white rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-xl font-bold tracking-tight">System Sync Activity</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 dark:bg-zinc-800 rounded-full border border-slate-700 dark:border-zinc-700">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Live Stream Enabled</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: 'PostgreSQL Sync Successful', detail: "Added 1,204 new rows to 'transactions' table", time: '2m ago', icon: RefreshCw, color: 'text-emerald-400' },
              { title: 'Schema Drift Detected', detail: "Snowflake: 'user_logs' schema modified", time: '14m ago', icon: AlertTriangle, color: 'text-amber-400' },
              { title: 'Backup Completed', detail: "Production RDS nightly backup stored in S3", time: '4h ago', icon: CheckCircle2, color: 'text-slate-400' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 dark:bg-zinc-800/20 rounded-xl border border-slate-800 dark:border-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-800 transition-all cursor-pointer group shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-900 dark:bg-zinc-900 border border-slate-800 dark:border-zinc-700 transition-transform group-hover:scale-110", activity.color)}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-white transition-colors truncate">{activity.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium truncate mt-0.5">{activity.detail}</p>
                </div>
                <span className="text-[10px] font-black text-slate-600 dark:text-zinc-500 uppercase tracking-widest ml-auto">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Table Area - only visible on large screens or wrapped on mobile */}
      <div className="mt-16 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active Infrastructure Node</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 transition-colors">
               <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 transition-colors">
               <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Source Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Last Sync</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
              {[
                { name: 'Redis Cache', type: 'In-Memory', status: 'Active', sync: 'Real-time' },
                { name: 'Google Sheets', type: 'Integration', status: 'Pending', sync: '2h ago' },
                { name: 'ElasticSearch', type: 'Search Node', status: 'Active', sync: '5m ago' },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:bg-slate-900 group-hover:dark:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <Database className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-tighter">{row.type}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-widest",
                      row.status === 'Active' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30" : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/30"
                    )}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-tight">{row.sync}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-slate-100 dark:hover:border-zinc-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-none hover:shadow-sm">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
