import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  Clock, 
  Trash2,
  MoreVertical,
  Edit,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface Notebook {
  id: string;
  title: string;
  updated: string;
  status: 'Active' | 'Draft' | 'Archived';
  content: string;
}

export const NotebooksView = () => {
  const { getToken, user } = useAuth();
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([
    { id: '1', title: 'Ad-hoc Revenue Audit Q1', updated: '2 hours ago', status: 'Active', content: '# Q1 Revenue Audit\nAnalysis of the first quarter...' },
    { id: '2', title: 'Customer Segmentation Analysis', updated: 'Yesterday', status: 'Draft', content: 'Starting the customer segmentation...' },
  ]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [selectedNotebook, setSelectedNotebook] = React.useState<Notebook | null>(null);
  const [newTitle, setNewTitle] = React.useState('');

  const createNotebook = async () => {
    if (!newTitle.trim()) return;
    const newNb: Notebook = {
      id: Date.now().toString(),
      title: newTitle,
      updated: 'Just now',
      status: 'Draft',
      content: ''
    };
    setNotebooks([newNb, ...notebooks]);
    setIsCreating(false);
    setNewTitle('');
    toast.success("Notebook created successfully");

    // Log to history
    if (user) {
      try {
        const token = await getToken();
        if (!token) {
          console.warn("No auth token available, skipping history save");
        } else {
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          headers['Authorization'] = `Bearer ${token}`;
          const res = await fetch('/api/history', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: `Created notebook: ${newTitle}`,
              datasetId: 'notebook-resource',
              datasetName: 'Notebooks',
              result: 'New workspace initialized.'
            })
          });
          
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error("Failed to save notebook history:", res.status, error);
          }
        }
      } catch (error) {
        console.error("Failed to log notebook creation:", error);
      }
    }
  };

  const deleteNotebook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotebooks(notebooks.filter(n => n.id !== id));
    toast.success("Notebook deleted");
  };

  if (selectedNotebook) {
    return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSelectedNotebook(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Notebooks
          </button>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-zinc-800 rounded-lg">
                <Save className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setSelectedNotebook(null)}
                className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-zinc-800 rounded-lg"
              >
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm min-h-[600px]">
           <input 
             className="text-3xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white w-full mb-6"
             defaultValue={selectedNotebook.title}
           />
           <textarea 
             className="w-full min-h-[400px] bg-transparent border-none outline-none text-slate-600 dark:text-zinc-400 resize-none font-mono text-sm leading-relaxed"
             placeholder="Start writing..."
             defaultValue={selectedNotebook.content}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Your Notebooks</h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">Collaborative, interactive workspaces for code, data, and storytelling.</p>
        </div>
        {!isCreating ? (
           <button 
            onClick={() => setIsCreating(true)}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
           >
             <Plus className="w-4 h-4" />
             New Notebook
           </button>
        ) : (
          <div className="flex items-center gap-2">
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNotebook()}
              placeholder="Enter title..."
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button onClick={createNotebook} className="p-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => setIsCreating(false)} className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-500 rounded-xl">
               <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Notebook Card */}
        <button 
          onClick={() => setIsCreating(true)}
          className="h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 hover:border-slate-400 dark:hover:border-zinc-600 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-widest leading-none">Create New Notebook</span>
        </button>

        {/* Existing Notebooks */}
        {notebooks.map((nb) => (
          <div 
            key={nb.id} 
            onClick={() => setSelectedNotebook(nb)}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                  nb.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                  nb.status === 'Draft' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                  {nb.status}
                </span>
                <button 
                  onClick={(e) => deleteNotebook(nb.id, e)}
                  className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{nb.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Updated {nb.updated}
            </p>
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex -space-x-2">
                 <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-900 flex items-center justify-center text-[8px] text-white">JD</div>
                 <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200"></div>
              </div>
              <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
