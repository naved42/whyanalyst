import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon,
  Search, 
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  Table,
  FileText,
  Database,
  Link as LinkIcon,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  query: string;
  datasetName: string;
  timestamp: string;
}

interface HistoryViewProps {
  onReRun?: (record: any) => void;
}

export const HistoryView = ({ onReRun }: HistoryViewProps) => {
  const { getToken, user } = useAuth();
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/history', { headers });
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const deleteHistoryItem = async (id: string) => {
    try {
      const token = await getToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/history/${id}`, { 
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error("Delete failed");

      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("History item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.datasetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analysis History</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Your private audit trail of AI interactions and data events.</p>
        </div>
        <button 
          onClick={fetchHistory}
          className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-slate-500"
        >
          <RefreshCcw className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Type</span>
            </div>
            <div className="p-2 space-y-1">
              {[
                { label: 'All Activity', icon: HistoryIcon, active: true },
                { label: 'Chat Queries', icon: FileText, active: false },
                { label: 'Data Uploads', icon: Table, active: false },
                { label: 'Connections', icon: LinkIcon, active: false },
              ].map((filter) => (
                <button 
                  key={filter.label}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    filter.active 
                      ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-lg" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="md:col-span-9 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCcw className="w-8 h-8 animate-spin text-slate-300" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hydrating History...</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800 p-20 text-center">
                 <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No activity recorded</h3>
                 <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-xs mx-auto">Start by asking a question in chat or uploading a dataset.</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {item.datasetName === 'Chat Interaction' ? <FileText className="w-6 h-6" /> : <Table className="w-6 h-6" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{item.query}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Database className="w-3 h-3" />
                            {item.datasetName}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => onReRun?.(item)}
                         className={cn(
                           "p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                           !onReRun && "hidden"
                         )}
                         title="Re-run analysis"
                       >
                          <RefreshCcw className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
