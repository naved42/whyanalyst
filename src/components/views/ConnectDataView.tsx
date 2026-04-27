import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  Database, 
  RefreshCw, 
  Plus, 
  ChevronRight, 
  Headset, 
  Search,
  HardDrive,
  CheckCircle2,
  X,
  Lock,
  Globe,
  Settings,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronDown,
  Monitor,
  Zap,
  Cable,
  Server,
  Share2,
  GitBranch,
  ShieldAlert,
  Terminal,
  Activity,
  FileJson,
  FileCode,
  LayoutGrid,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  CreditCard
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type ConnectorStatus = 'connected' | 'failed' | 'available' | 'premium';
export type SyncFrequency = 'Real-time' | '15min' | 'Hourly' | 'Daily' | 'Weekly';

interface ActivityLog {
  id: string;
  connectorName: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

interface Connector {
  id: string;
  name: string;
  type: string;
  category: 'Cloud Storage' | 'Database' | 'API' | 'SaaS';
  status: ConnectorStatus;
  lastSync?: string;
  syncFrequency: SyncFrequency;
  health: 'green' | 'yellow' | 'red';
}

export const ConnectDataView = () => {
  const { getToken, user } = useAuth();
  const [connectingSource, setConnectingSource] = useState<Connector | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showCustomNodeModal, setShowCustomNodeModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ latency: 120, capacity: 88, lastSync: '4 minutes ago' });
  const [activeTab, setActiveTab] = useState<'connectors' | 'activity'>('connectors');
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleConnect = (source: Connector) => {
    setConnectingSource(source);
  };

  // Live stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(prev => ({
        ...prev,
        latency: Math.floor(115 + Math.random() * 15),
        capacity: Math.min(100, Math.max(0, prev.capacity + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle theme logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle Disconnect
  const handleDisconnect = (id: string, name: string) => {
    toast.error(`Disconnecting ${name}`, {
      description: "Establishing handshake to terminate secure tunnel...",
      action: {
        label: "Confirm",
        onClick: () => {
          setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: 'available', lastSync: undefined } : c));
          toast.success(`${name} detached successfully`);
        }
      }
    });
  };

  const handleRetry = (id: string) => {
    toast.promise(new Promise(r => setTimeout(r, 1500)), {
      loading: 'Recalibrating connection sequence...',
      success: () => {
        setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: 'connected', health: 'green', lastSync: 'Just now' } : c));
        return 'Re-authentication successful';
      },
      error: 'Sequencing failed'
    });
  };

  const [connectors, setConnectors] = useState<Connector[]>([
    { id: 's3', name: 'Amazon S3', type: 'Object Storage', category: 'Cloud Storage', status: 'connected', lastSync: '12 mins ago', syncFrequency: '15min', health: 'green' },
    { id: 'gdrive', name: 'Google Drive', type: 'Cloud Storage', category: 'Cloud Storage', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'snowflake', name: 'Snowflake', type: 'Data Warehouse', category: 'Database', status: 'premium', syncFrequency: 'Hourly', health: 'green' },
    { id: 'rest_api', name: 'Rest API', type: 'Custom Endpoint', category: 'API', status: 'connected', lastSync: '1 hour ago', syncFrequency: 'Real-time', health: 'green' },
    { id: 'dropbox', name: 'Dropbox', type: 'Cloud Storage', category: 'Cloud Storage', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'bigquery', name: 'BigQuery', type: 'Data Warehouse', category: 'Database', status: 'available', syncFrequency: 'Hourly', health: 'green' },
    { id: 'postgres', name: 'PostgreSQL', type: 'Database', category: 'Database', status: 'connected', lastSync: '3 mins ago', syncFrequency: 'Real-time', health: 'green' },
    { id: 'azure', name: 'Azure Blob', type: 'Object Storage', category: 'Cloud Storage', status: 'available', syncFrequency: 'Daily', health: 'green' },
    // New connectors
    { id: 'mysql', name: 'MySQL', type: 'Database', category: 'Database', status: 'available', syncFrequency: 'Hourly', health: 'green' },
    { id: 'mongodb', name: 'MongoDB', type: 'NoSQL Database', category: 'Database', status: 'available', syncFrequency: '15min', health: 'green' },
    { id: 'notion', name: 'Notion', type: 'Workspace', category: 'SaaS', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'airtable', name: 'Airtable', type: 'Database/SaaS', category: 'SaaS', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'slack', name: 'Slack', type: 'Communication', category: 'SaaS', status: 'available', syncFrequency: 'Real-time', health: 'green' },
    { id: 'hubspot', name: 'HubSpot', type: 'CRM', category: 'SaaS', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'salesforce', name: 'Salesforce', type: 'CRM', category: 'SaaS', status: 'premium', syncFrequency: 'Daily', health: 'green' },
    { id: 'github', name: 'GitHub', type: 'Version Control', category: 'SaaS', status: 'available', syncFrequency: 'Hourly', health: 'green' },
    { id: 'stripe', name: 'Stripe', type: 'Payments', category: 'API', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'kafka', name: 'Kafka', type: 'Streaming', category: 'API', status: 'premium', syncFrequency: 'Real-time', health: 'green' },
    { id: 'ftp', name: 'FTP/SFTP', type: 'File Transfer', category: 'Cloud Storage', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'onedrive', name: 'OneDrive', type: 'Cloud Storage', category: 'Cloud Storage', status: 'available', syncFrequency: 'Daily', health: 'green' },
    { id: 'redshift', name: 'Redshift', type: 'Data Warehouse', category: 'Database', status: 'premium', syncFrequency: 'Hourly', health: 'green' },
    { id: 'firebase', name: 'Firebase', type: 'Backend/NoSQL', category: 'Database', status: 'available', syncFrequency: '15min', health: 'green' },
    { id: 'bigquery_old', name: 'Legacy BigQuery', type: 'Database', category: 'Database', status: 'failed', syncFrequency: 'Daily', health: 'red' },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', connectorName: 'PostgreSQL', status: 'success', message: 'Sync completed: 1,245 records added', timestamp: '3 mins ago' },
    { id: '2', connectorName: 'Amazon S3', status: 'success', message: 'Incremental sync successful', timestamp: '12 mins ago' },
    { id: '3', connectorName: 'Snowflake', status: 'error', message: 'Authentication failed: Invalid credentials', timestamp: '1 hour ago' },
  ]);

  const filteredConnectors = useMemo(() => {
    return connectors.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === 'All') return matchesSearch;
      if (activeFilter === 'Connected') return matchesSearch && c.status === 'connected';
      if (activeFilter === 'Available') return matchesSearch && (c.status === 'available' || c.status === 'premium');
      if (activeFilter === 'Premium') return matchesSearch && c.status === 'premium';
      if (activeFilter === 'Cloud Storage') return matchesSearch && c.category === 'Cloud Storage';
      if (activeFilter === 'Database') return matchesSearch && c.category === 'Database';
      if (activeFilter === 'API') return matchesSearch && c.category === 'API';
      return matchesSearch;
    });
  }, [connectors, searchQuery, activeFilter]);

  const handleManualSync = () => {
    setIsSyncing(true);
    toast.promise(new Promise(r => setTimeout(r, 2000)), {
      loading: 'Triggering global sync...',
      success: () => {
        setIsSyncing(false);
        setSyncStatus(prev => ({ ...prev, lastSync: 'Just now' }));
        return 'System-wide sync complete';
      },
      error: 'Sync failed'
    });
  };

  const finalizeConnection = async () => {
    if (!connectingSource) return;
    setIsSyncing(true);
    try {
      const token = await getToken();
      
      // Simulate OAuth or Credential Verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnectors(prev => prev.map(c => c.id === connectingSource.id ? { ...c, status: 'connected', lastSync: 'Just now' } : c));
      
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        connectorName: connectingSource.name,
        status: 'success',
        message: `Initial connection established. Sync frequency: ${connectingSource.syncFrequency}.`,
        timestamp: 'Just now'
      };
      setActivityLogs(prev => [newLog, ...prev]);

      if (user) {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('/api/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: `Connected data source: ${connectingSource.name}`,
            datasetId: 'external-integration',
            datasetName: connectingSource.name,
            result: 'Connection established and verified.'
          })
        });
      }

      setIsSyncing(false);
      setConnectingSource(null);
      toast.success(`${connectingSource.name} connected successfully`, {
        description: "Your data is now being indexed for AI analysis."
      });
    } catch (error) {
      toast.error("Failed to connect source");
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
      {/* Top Navigation & Global Search */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search datasets, data sources, and connectors..."
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 outline-none transition-all dark:text-white shadow-sm"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
              >
                <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Results</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredConnectors.length > 0 ? (
                    filteredConnectors.slice(0, 5).map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => { setConnectingSource(c); setSearchQuery(''); }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Cable className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{c.type}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-xs">No matching nodes found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto relative">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:translate-y-[-2px] transition-all"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm relative group overflow-hidden hover:translate-y-[-2px] transition-all"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notifications</p>
                    <button className="text-[10px] font-bold text-indigo-500 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: 'Sync Successful', desc: 'Amazon S3 incremental sync finished.', time: '12m' },
                      { title: 'New Node Available', desc: 'Snowflake Enterprise v2.4 connector live.', time: '1h' },
                      { title: 'Handshake Error', desc: 'BigQuery credentials expired.', time: '2h', error: true },
                    ].map((n, i) => (
                      <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 border-b border-slate-50 dark:border-zinc-800 last:border-0 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <p className={cn("text-xs font-bold", n.error ? "text-red-500" : "text-slate-900 dark:text-white")}>{n.title}</p>
                          <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <div 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="w-11 h-11 bg-slate-900 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xl active:scale-95 transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-indigo-500"
            >
              {user?.displayName?.charAt(0) || <User className="w-5 h-5" />}
            </div>
            <AnimatePresence>
              {showProfile && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[60] overflow-hidden py-2"
                >
                  <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.displayName || 'Authorized User'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@cognite.ai'}</p>
                  </div>
                  {[
                    { label: 'Profile Settings', icon: User },
                    { label: 'Billing & Plan', icon: CreditCard },
                    { label: 'API Identity', icon: Terminal },
                    { label: 'Security Handshake', icon: ShieldAlert, variant: 'danger' },
                  ].map((item, i) => (
                    <button 
                      key={i}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors",
                        item.variant === 'danger' ? "text-red-500" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="h-px bg-slate-50 dark:bg-zinc-800 my-2"></div>
                  <button className="w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Terminate Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Connect <span className="text-indigo-500">Nodes</span></h2>
          <p className="text-base text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed font-medium">Bridge high-fidelity cognitive data streams into the analysis core.</p>
        </div>
        
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Connected', 'Available', 'Premium', 'Cloud Storage', 'Database', 'API'].map((f) => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                activeFilter === f 
                  ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-lg shadow-indigo-500/20" 
                  : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Featured Integration: AWS S3 */}
        <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800 p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
             <Cloud className="w-full h-full text-slate-900 dark:text-white" />
          </div>
          <div className="z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-inner group-hover:rotate-3 transition-transform">
                <HardDrive className="w-10 h-10 text-slate-600 dark:text-zinc-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Amazon S3 Hub</h3>
                  <Badge status="connected" />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Synced 12 mins ago</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase">Live Health</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-base text-slate-500 dark:text-zinc-400 max-w-md font-medium leading-relaxed">High-performance object storage cluster for unstructured intelligence assets.</p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 z-10 pt-8 border-t border-slate-50 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['PDF', 'CSV', 'JSON', 'SQL'].map((type) => (
                  <TooltipProvider key={type}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="w-12 h-12 rounded-xl border-4 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-zinc-400 shadow-sm cursor-help hover:translate-y-[-2px] transition-transform">{type}</div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-none text-white text-[10px] font-bold py-2 px-3 rounded-lg">
                        <p>Preview {type} logs in S3</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="flex flex-col ml-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Formats</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">4 Pipelines</p>
              </div>
            </div>
            <button 
              onClick={() => handleConnect(connectors.find(c => c.id === 's3')!)}
              className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <Settings className="w-4 h-4" />
              Manage Settings
            </button>
          </div>
        </div>

        {/* Active Status Summary */}
        <div className="md:col-span-12 lg:col-span-4 bg-slate-900 dark:bg-zinc-950 text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-slate-800 dark:border-zinc-800">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
            <Activity className="w-16 h-16" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Connectivity</h3>
              <button 
                onClick={handleManualSync}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                title="Manual Global Sync"
              >
                <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
              </button>
            </div>
            <p className="text-sm text-slate-400 dark:text-zinc-500 font-medium leading-relaxed">Integrated pipelines operating within <span className="text-white font-bold">{syncStatus.latency}ms</span> latency parameters.</p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Infrastructure Load</span>
                <span className={cn("text-white", syncStatus.capacity > 90 ? "text-red-400" : "")}>{syncStatus.capacity}% Capacity</span>
              </div>
              <div className="w-full bg-white/5 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${syncStatus.capacity}%` }}
                  className={cn(
                    "h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]",
                    syncStatus.capacity > 90 ? "bg-red-500" : "bg-white dark:bg-indigo-500"
                  )}
                ></motion.div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Synced</p>
                <p className="text-xs font-bold text-white">{syncStatus.lastSync}</p>
              </div>
              <button 
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                Logs
                <ChevronDown className={cn("w-3 h-3 transition-transform", showActivityLog && "rotate-180")} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showActivityLog && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  {activityLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="flex gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500')}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-[10px] font-black uppercase text-white/90">{log.connectorName}</p>
                          <span className="text-[9px] text-white/40">{log.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-white/60 leading-tight truncate w-full">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Google Drive Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800 p-8 flex flex-col hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-100 dark:border-zinc-700 group-hover:rotate-6 transition-transform">
              <Cloud className="w-8 h-8" />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[9px] font-black px-2 py-1 rounded-lg tracking-widest border border-slate-100 dark:border-zinc-700 uppercase cursor-help">Available</span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-none text-white text-[10px] font-bold py-2 px-3 rounded-lg">
                  <p>Ready for OAuth mapping</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Google Drive</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 flex-grow font-medium leading-relaxed">Cognitive document ingestion from shared team drives.</p>
          <button 
            onClick={() => handleConnect(connectors.find(c => c.id === 'gdrive')!)}
            className="mt-8 w-full border-2 border-slate-900 dark:border-indigo-600 text-slate-900 dark:text-white px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-2 group/btn"
          >
            Connect Hub
            <Globe className="w-4 h-4 group-hover/btn:animate-spin-slow" />
          </button>
        </div>

        {/* Snowflake Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800 p-8 flex flex-col hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-100 dark:border-zinc-700 group-hover:rotate-6 transition-transform">
               <Database className="w-8 h-8" />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span 
                    onClick={() => toast.info("Opening upgrade modal...")}
                    className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 text-[9px] font-black px-2 py-1 rounded-lg tracking-widest border border-indigo-100 dark:border-indigo-500/20 uppercase cursor-pointer hover:bg-indigo-100 transition-colors"
                  >
                    Premium
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-indigo-600 border-none text-white text-[10px] font-bold py-2 px-3 rounded-lg">
                  <p>Enterprise SQL Tunneling Required</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Snowflake</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 flex-grow font-medium leading-relaxed">Secure SQL tunneling to your enterprise data warehouse.</p>
          <button 
            onClick={() => handleConnect(connectors.find(c => c.id === 'snowflake')!)}
            className="mt-8 w-full border-2 border-slate-900 dark:border-indigo-600 text-slate-900 dark:text-white px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-2 group/btn"
          >
            Link Source
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Custom API Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-slate-50 dark:bg-zinc-800 rounded-[2rem] border border-slate-100 dark:border-zinc-800 p-8 flex flex-col shadow-inner relative group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-900 dark:text-white shadow-sm group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Rest API</h4>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Link</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 flex-grow font-medium leading-relaxed">Polling external endpoints for high-frequency structured data ingestion.</p>
          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">DOCS</button>
            <button 
              onClick={() => handleConnect(connectors.find(c => c.id === 'rest_api')!)}
              className="bg-slate-900 dark:bg-indigo-600 text-white p-3.5 rounded-2xl transition-all hover:bg-black dark:hover:bg-indigo-700 shadow-xl shadow-black/10 active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Secondary Sources Section Header */}
        <div className="col-span-12 mt-16 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase italic">Node <span className="text-indigo-500">Inventory</span></h3>
              <div className="h-px bg-slate-100 dark:bg-zinc-800 w-32"></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredConnectors.length} CONNECTORS IDENTIFIED</p>
          </div>
        </div>

        {/* Row of smaller connectors - Updated to use filteredConnectors */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredConnectors.filter(c => !['s3', 'gdrive', 'snowflake', 'rest_api'].includes(c.id)).map((source) => (
            <motion.div 
              layout
              key={source.id} 
              onClick={() => handleConnect(source)}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight">{source.name}</span>
                    <HealthDot status={source.health} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">{source.type}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-800 mt-2">
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge status={source.status} compact />
                    {source.status === 'failed' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRetry(source.id); }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                        title="Retry Connection"
                      >
                        <RefreshCw className="w-3 h-3 text-indigo-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {source.status === 'connected' && (
                    <>
                      <div className="flex items-center gap-2">
                         <Clock className="w-3 h-3 text-slate-300" />
                         <span className="text-[10px] font-bold text-slate-400">{source.syncFrequency}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDisconnect(source.id, source.name); }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                        title="Disconnect"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {source.status !== 'connected' && source.status !== 'failed' && (
                    <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Link</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add Request New Source Card */}
          <button 
            onClick={() => setShowCustomNodeModal(true)}
            className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-3 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all group min-h-[160px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Request New Node</span>
          </button>
        </div>
      </div>

      {/* Connection Modal Overlay - UPDATED DYNAMIC MODAL */}
      <AnimatePresence>
        {connectingSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSyncing && setConnectingSource(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                      {connectingSource.category === 'Cloud Storage' ? <Cloud className="w-8 h-8" /> : 
                       connectingSource.category === 'Database' ? <Database className="w-8 h-8" /> : 
                       <RefreshCw className="w-8 h-8" />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{connectingSource.name}</h3>
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Integrity Verification Required</p>
                    </div>
                  </div>
                  {!isSyncing && (
                    <button onClick={() => setConnectingSource(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* DYNAMIC FIELDS BASED ON CONNECTOR */}
                  {connectingSource.id === 's3' ? (
                    <>
                      <FormField label="S3 Bucket Name" placeholder="cognitive-assets-us-east" />
                      <FormField label="Region" placeholder="us-east-1" />
                      <FormField label="Access Key ID" placeholder="AKIA..." />
                      <FormField label="Secret Access Key" placeholder="••••••••" type="password" />
                    </>
                  ) : connectingSource.id === 'snowflake' ? (
                    <>
                      <FormField label="Account URL" placeholder="xy12345.snowflakecomputing.com" />
                      <FormField label="Warehouse" placeholder="COMPUTE_WH" />
                      <FormField label="Database" placeholder="RAW_DATA" />
                      <FormField label="User Role" placeholder="SYSADMIN" />
                    </>
                  ) : connectingSource.category === 'Database' ? (
                    <>
                      <FormField label="Host Address" placeholder="db.cognite.internal" />
                      <FormField label="Port" placeholder="5432" />
                      <FormField label="Database Name" placeholder="main_cluster" />
                      <FormField label="Credentials" placeholder="••••••••" type="password" />
                    </>
                  ) : (
                    <>
                      <FormField label="Endpoint Mapping" placeholder="https://api.source.com/v1" />
                      <FormField label="Auth Token" placeholder="Bearer eyJ..." type="password" />
                    </>
                  )}
                  <div className="col-span-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Capture Frequency</label>
                    <div className="flex flex-wrap gap-2">
                       {['Real-time', '15min', 'Hourly', 'Daily'].map(freq => (
                         <button 
                          key={freq}
                          onClick={() => setConnectingSource({ ...connectingSource, syncFrequency: freq as any })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border",
                            connectingSource.syncFrequency === freq 
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" 
                              : "bg-slate-50 dark:bg-zinc-800 text-slate-500 border-slate-100 dark:border-zinc-700"
                          )}
                         >
                           {freq}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-zinc-800">
                  <button 
                    disabled={isSyncing}
                    onClick={() => toast.info("Testing connection sequence...")}
                    className="flex-1 border-2 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    Test Sequence
                  </button>
                  <button 
                    disabled={isSyncing}
                    onClick={finalizeConnection}
                    className="flex-[2] bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-xl active:scale-[0.98] border border-transparent"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Uplink in Progress...
                      </>
                    ) : (
                      <>
                        Initialize Uplink
                        <RefreshCw className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Custom Node Modal */}
      <AnimatePresence>
        {showCustomNodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomNodeModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <Cable className="w-8 h-8" />
                  </div>
                  <button onClick={() => setShowCustomNodeModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Request Custom Node</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Describe your proprietary data source for our engineering team.</p>
                </div>
                <div className="space-y-4">
                  <FormField label="Source Name" placeholder="Legacy SAP Warehouse" />
                  <FormField label="Data Volume (Est)" placeholder="500 GB / month" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Integration Logic</label>
                    <textarea 
                      placeholder="Explain the security protocols and access methods..."
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm h-32 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    toast.success("Request submitted", { description: "Engineering team will contact you within 24-48 hours." });
                    setShowCustomNodeModal(false);
                  }}
                  className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Confirm Submission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Help Section */}
      <div className="mt-20 bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-12 group">
        <div className="flex-1 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
          <div className="w-24 h-24 rounded-3xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center shadow-2xl text-white shrink-0 group-hover:rotate-6 transition-transform relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Headset className="w-12 h-12" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 italic">CAN'T FIND YOUR SOURCE?</h4>
            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-xl font-medium leading-relaxed italic">Our infrastructure team builds custom high-performance connectors for proprietary legacy systems. Deployment ready in <span className="text-slate-900 dark:text-white">48 hours</span>.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCustomNodeModal(true)}
          className="w-full xl:w-auto bg-slate-900 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 shrink-0"
        >
          Request Custom Node
        </button>
      </div>
    </div>
  );
};

// Helper Components
const FormField = ({ label, placeholder, type = 'text' }: { label: string, placeholder: string, type?: string }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
    />
  </div>
);

const Badge = ({ status, compact = false }: { status: ConnectorStatus, compact?: boolean }) => {
  const styles = {
    connected: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    failed: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    available: "bg-slate-50 text-slate-500 border-slate-100 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700",
    premium: "bg-indigo-50 text-indigo-500 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  };

  return (
    <span className={cn(
      "font-black uppercase tracking-widest border rounded-[0.5rem] flex items-center gap-1.5",
      compact ? "text-[8px] px-1.5 py-0.5" : "text-[9px] px-2 py-1",
      styles[status] || styles.available
    )}>
      {status === 'connected' && <CheckCircle2 className={cn(compact ? "w-2.5 h-2.5" : "w-3 h-3")} />}
      {status === 'failed' && <AlertCircle className={cn(compact ? "w-2.5 h-2.5" : "w-3 h-3")} />}
      {status}
    </span>
  );
};

const HealthDot = ({ status }: { status: 'green' | 'yellow' | 'red' }) => (
  <div className={cn(
    "w-2 h-2 rounded-full",
    status === 'green' ? "bg-emerald-500" : status === 'yellow' ? "bg-amber-500" : "bg-red-500"
  )} title={`Health: ${status}`}></div>
);
