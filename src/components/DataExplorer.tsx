import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Table as TableIcon, 
  Upload, 
  ChevronDown, 
  ChevronRight,
  Info,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { cn } from '@/src/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface DataExplorerProps {
  audit: any;
  preview: any[];
  onUpload: (file: File) => void;
  isLoading: boolean;
  onSelectCol?: (name: string) => void;
  selectedCol?: string | null;
}

export const DataExplorer = ({ audit, preview, onUpload, isLoading, onSelectCol, selectedCol }: DataExplorerProps) => {
  const [section, setSection] = useState<'preview' | 'schema'>('preview');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      // Simulate progress since we don't have a real stream here
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      try {
        await onUpload(file);
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      } catch (err) {
        clearInterval(interval);
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#080808] border-zinc-200 dark:border-zinc-800 w-full lg:w-[380px] border-r shrink-0">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white uppercase tracking-wider">Dataset Explorer</h2>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <label className={cn(
              "block w-full border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer group relative overflow-hidden",
              uploadStatus === 'idle' && "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/50",
              uploadStatus === 'uploading' && "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5",
              uploadStatus === 'success' && "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5",
              uploadStatus === 'error' && "border-red-500 bg-red-50/10 dark:bg-red-500/5"
            )}>
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileChange} disabled={uploadStatus === 'uploading'} />
              
              <div className="flex flex-col items-center justify-center text-center space-y-2 relative z-10">
                 {uploadStatus === 'uploading' ? (
                   <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                 ) : uploadStatus === 'success' ? (
                   <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                     <CheckCircle2 className="w-3 h-3 text-white" />
                   </div>
                 ) : uploadStatus === 'error' ? (
                   <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                     <span className="text-white text-[10px] font-bold">!</span>
                   </div>
                 ) : (
                   <Upload className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                 )}
                 
                 <p className={cn(
                   "text-[11px] font-medium transition-colors",
                   uploadStatus === 'success' ? "text-emerald-600 dark:text-emerald-400" :
                   uploadStatus === 'error' ? "text-red-600 dark:text-red-400" :
                   "text-zinc-600 dark:text-zinc-400"
                 )}>
                   {uploadStatus === 'uploading' ? `Processing Pipeline (${uploadProgress}%)` : 
                    uploadStatus === 'success' ? 'Dataset Synced Successfully' :
                    uploadStatus === 'error' ? 'Sync Failed' :
                    'Upload or Replace Dataset'}
                 </p>
              </div>

              {uploadStatus === 'uploading' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              )}
            </label>
          </TooltipTrigger>
          <TooltipContent side="bottom">Supports CSV and Excel files (max 100MB)</TooltipContent>
        </Tooltip>
      </div>

    <div className="flex px-4 py-2 gap-4 border-b border-zinc-200 dark:border-zinc-800 items-center justify-between">
      <div className="flex gap-4">
         <Tooltip>
           <TooltipTrigger>
             <button 
               onClick={() => setSection('preview')}
               className={cn(
                 "text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative pb-2",
                 section === 'preview' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-900"
               )}
             >
               Preview
               {section === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
             </button>
           </TooltipTrigger>
           <TooltipContent side="bottom">View top 10 rows of active dataset</TooltipContent>
         </Tooltip>
 
         <Tooltip>
           <TooltipTrigger>
             <button 
               onClick={() => setSection('schema')}
               className={cn(
                 "text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative pb-2",
                 section === 'schema' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-900"
               )}
             >
               Schema
               {section === 'schema' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
             </button>
           </TooltipTrigger>
           <TooltipContent side="bottom">Inspect data types and quality indicators</TooltipContent>
         </Tooltip>
      </div>

      {audit && section === 'preview' && (
        <Tooltip>
          <TooltipTrigger>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => {
                import('@/src/lib/export').then(({ exportToCSV }) => {
                  exportToCSV(preview.slice(0, 50), audit.name || 'preview_export');
                });
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Export Preview to CSV</TooltipContent>
        </Tooltip>
      )}
    </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {audit ? (
            <>
              {section === 'preview' ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#0a0a0a]">
                    <table className="w-full text-[10px] text-left">
                      <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0">
                        <tr>
                          {Object.keys(preview[0] || {}).slice(0, 4).map(col => (
                            <th key={col} className="px-3 py-2 font-bold text-zinc-500 uppercase">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {preview.slice(0, 10).map((row, i) => (
                          <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                            {Object.values(row).slice(0, 4).map((val: any, j) => (
                              <td key={j} className="px-3 py-2 text-zinc-600 dark:text-zinc-400 truncate max-w-[100px]">
                                {val !== null ? String(val) : <span className="text-red-500 opacity-50">NaN</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-center text-zinc-500 italic">Showing top 10 rows • Total {audit.rows.toLocaleString()} entries</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {audit.schema.map((col: any) => (
                    <Tooltip key={col.name}>
                      <TooltipTrigger>
                        <button 
                          onClick={() => onSelectCol?.(col.name)}
                          className={cn(
                            "w-full p-3 rounded-xl border flex items-center justify-between group transition-all text-left",
                            selectedCol === col.name 
                              ? "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30" 
                              : "bg-white dark:bg-[#0a0a0a] border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full transition-colors",
                              selectedCol === col.name ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"
                            )} />
                            <div>
                              <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate max-w-[140px]">{col.name}</p>
                              <p className="text-[9px] text-zinc-500 font-mono flex items-center gap-2 uppercase tracking-widest">
                                {col.type} 
                                {col.nullCount > 0 && <span className="text-amber-500 text-[8px]">! {col.nullCount} NaNs</span>}
                              </p>
                            </div>
                          </div>
                          {selectedCol === col.name && (
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Focus analysis on {col.name}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <Layers className="w-3 h-3" />
                  Quick Summaries
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Total Dimensions</p>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{audit.columns}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Health Grade</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">A-</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
             <div className="py-20 text-center space-y-4 px-6">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 mx-auto flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-xs text-zinc-500 italic leading-relaxed">
                  Upload a dataset to activate the exploration engine and start your journey.
                </p>
             </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
