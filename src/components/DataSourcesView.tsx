import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Database,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  createdAt: string;
}

interface DataSourcesViewProps {
  onUpload: (file: File) => void;
  activeDatasetId: string | null;
  setActiveDataset: (id: string) => void;
  isLoading: boolean;
}

export const DataSourcesView = ({ onUpload, activeDatasetId, setActiveDataset, isLoading }: DataSourcesViewProps) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('/api/datasets');
      const data = await res.json();
      setDatasets(data);
    } catch (err) {
      toast.error("Failed to load datasets");
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
      setDatasets(prev => prev.filter(d => d.id !== id));
      toast.success("Dataset removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#050505] p-4 sm:p-6 lg:p-10 overflow-y-auto">
      <div className="w-full space-y-8 sm:space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Data Management</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your analysis inventory and persistent sources.</p>
          </div>
          
          <Tooltip>
            <TooltipTrigger>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} 
                />
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-11 sm:h-10 px-6 sm:px-4 gap-2 rounded-xl sm:rounded-lg">
                  <Plus className="w-4 h-4" />
                  Upload New Dataset
                </Button>
              </label>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">Upload locally stored CSV or Excel spreadsheets</TooltipContent>
          </Tooltip>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {datasets.map((dataset) => (
            <motion.div 
              key={dataset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group p-6 rounded-3xl border-2 transition-all relative overflow-hidden",
                activeDatasetId === dataset.id 
                  ? "border-indigo-600 bg-indigo-50/10" 
                  : "border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50/50 dark:bg-zinc-900/30"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  activeDatasetId === dataset.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-400"
                )}>
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <button 
                      onClick={() => handleDelete(dataset.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Permanently delete this dataset</TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="font-bold text-zinc-900 dark:text-white truncate pr-6">{dataset.name}</h3>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500 cursor-help">
                       <span>{dataset.rows.toLocaleString()} Rows</span>
                       <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                       <span>{dataset.columns} Features</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Dataset dimensions: Rows represent observations, Features represent unique variables.</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <Clock className="w-3 h-3" />
                  {new Date(dataset.createdAt).toLocaleDateString()}
                </div>
                
                {activeDatasetId === dataset.id ? (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveDataset(dataset.id)}
                        className="text-xs h-8 hover:bg-indigo-600 hover:text-white transition-all gap-2"
                      >
                        Select
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Set as active dataset for analysis</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </motion.div>
          ))}

          {datasets.length === 0 && !isLoading && (
            <div className="col-span-full py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
               <Database className="w-12 h-12 text-zinc-200" />
               <p className="text-zinc-500 dark:text-zinc-400 text-sm">No datasets found. Start by uploading a file.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
