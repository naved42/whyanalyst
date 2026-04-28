import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Cloud, 
  Server, 
  Shield, 
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Connector {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 's3' | 'bigquery';
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
}

export const ConnectorsView = () => {
  const [connectors, setConnectors] = useState<Connector[]>([
    { id: '1', name: 'Production DB', type: 'postgres', status: 'connected', lastSync: '2 mins ago' },
    { id: '2', name: 'Raw Data Bucket', type: 's3', status: 'connected', lastSync: '1 hour ago' },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'postgres':
      case 'mysql': return <Server className="w-5 h-5" />;
      case 's3': return <Cloud className="w-5 h-5" />;
      case 'bigquery': return <Database className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const handleAdd = () => {
    toast.info("Database connector wizard coming soon!");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#050505] p-4 sm:p-6 lg:p-10 overflow-y-auto">
      <div className="w-full space-y-6 sm:space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Data Connectors</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Bridge your external warehouse directly into the analysis engine.</p>
          </div>
          
          <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 h-11 sm:h-10 gap-2 w-full sm:w-auto rounded-xl sm:rounded-lg order-first sm:order-none font-bold">
            <Plus className="w-4 h-4" />
            Add Connector
          </Button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {connectors.map((connector, i) => (
            <motion.div 
              key={connector.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors">
                    {getIcon(connector.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white leading-tight">{connector.name}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">{connector.type}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1 sm:gap-1.5 shrink-0",
                  connector.status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  {connector.status === 'connected' ? <CheckCircle2 className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {connector.status}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
                <div className="text-[10px] text-zinc-400 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden xs:inline">Synced</span> {connector.lastSync}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs font-bold gap-2">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={handleAdd}
            className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[160px]"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
              <Plus className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Connect more sources</span>
          </button>
        </div>
      </div>
    </div>
  );
};
