import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Search, 
  ChevronRight, 
  Calendar, 
  Database,
  BarChart3,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

import { useAuth } from '../hooks/useAuth';

interface HistoryRecord {
  id: string;
  query: string;
  datasetName: string;
  timestamp: string;
  result: any;
  userId?: string;
}

export const HistoryView = ({ onReRun }: { onReRun: (record: any) => void }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState('');
  const { getToken, user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = await getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch('/api/history', { headers });
      const data = await res.json();
      setHistory(data);
    };

    if (user) {
      fetchHistory();
    }
  }, [user, getToken]);

  const filtered = history.filter(h => 
    h.query.toLowerCase().includes(search.toLowerCase()) || 
    h.datasetName.toLowerCase().includes(search.toLowerCase())
  ).reverse();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#050505] p-4 sm:p-6 lg:p-10 overflow-y-auto">
      <div className="w-full space-y-6 sm:space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Analysis History</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Review and re-initialize past sessions.</p>
          </div>
          
          <div className="relative group w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm w-full sm:w-[300px] focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all h-11 sm:h-10"
            />
          </div>
        </header>

        <div className="space-y-3 sm:space-y-4">
          {filtered.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                   <h3 className="font-bold text-zinc-900 dark:text-white truncate text-sm sm:text-base">{item.query}</h3>
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{item.datasetName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex items-center shrink-0">
                 <Tooltip>
                   <TooltipTrigger className="w-full sm:w-auto">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => onReRun(item)}
                       className="w-full sm:w-auto text-xs h-10 sm:h-9 rounded-xl border border-zinc-100 dark:border-zinc-800 sm:border-none hover:bg-indigo-600 hover:text-white gap-2 px-6 sm:px-4 transition-all font-bold"
                     >
                       <RefreshCcw className="w-3 h-3" />
                       Re-run
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="top">Re-execute this specific analysis query</TooltipContent>
                 </Tooltip>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center space-y-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem]">
              <History className="w-12 h-12 text-zinc-200 mx-auto" />
              <p className="text-sm text-zinc-400 italic">No matching history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
