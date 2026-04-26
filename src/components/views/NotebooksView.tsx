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
  X,
  Star,
  Copy,
  Archive,
  Share2,
  Play,
  Download,
  Code,
  Type,
  Layout,
  CheckCircle2,
  History,
  Users
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
}

interface Notebook {
  id: string;
  title: string;
  description: string;
  updated: string;
  status: 'Active' | 'Draft' | 'Archived';
  isFavorite: boolean;
  cells: Cell[];
  lastEditedBy: string;
  collaborators: string[];
  createdAt: string;
}

export const NotebooksView = () => {
  const { getToken, user } = useAuth();
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([
    { 
      id: '1', 
      title: 'Ad-hoc Revenue Audit Q1', 
      description: 'Quarterly financial review for stakeholders.',
      updated: '2 hours ago', 
      status: 'Active', 
      isFavorite: true,
      cells: [
        { id: 'c1', type: 'markdown', content: '# Revenue Audit Q1\nAnalysis of sales performance.' },
        { id: 'c2', type: 'code', content: 'df = pd.read_csv("revenue.csv")\ndf.head()', output: 'Sales data loaded.' }
      ],
      lastEditedBy: 'John Doe',
      collaborators: ['Sarah Smith', 'Mike Ross'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    { 
      id: '2', 
      title: 'Customer Segmentation Analysis', 
      description: 'Clustering customers by lifetime value.',
      updated: 'Yesterday', 
      status: 'Draft', 
      isFavorite: false,
      cells: [],
      lastEditedBy: 'John Doe',
      collaborators: [],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
  ]);

  // UI State
  const [isCreating, setIsCreating] = React.useState(false);
  const [selectedNotebook, setSelectedNotebook] = React.useState<Notebook | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [sortOrder, setSortOrder] = React.useState<'Updated' | 'Name' | 'Status' | 'Created'>('Updated');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsNewModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDuplicate = (nb: Notebook) => {
    const copy: Notebook = {
      ...nb,
      id: Date.now().toString(),
      title: `Copy of ${nb.title}`,
      updated: 'Just now',
      status: 'Draft',
      createdAt: new Date().toISOString()
    };
    setNotebooks([copy, ...notebooks]);
    toast.success("Notebook duplicated");
  };

  const handleArchive = (id: string) => {
    setNotebooks(notebooks.map(n => n.id === id ? { ...n, status: 'Archived' } : n));
    toast.success("Notebook archived");
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotebooks(notebooks.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotebooks(notebooks.map(n => {
      if (n.id === id) {
        return { ...n, status: n.status === 'Active' ? 'Draft' : 'Active' };
      }
      return n;
    }));
  };

  const filteredNotebooks = notebooks
    .filter(nb => {
      const matchesSearch = nb.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || nb.status === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      switch (sortOrder) {
        case 'Name': return a.title.localeCompare(b.title);
        case 'Status': return a.status.localeCompare(b.status);
        case 'Created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0; // "Updated" logic would need real timestamps
      }
    });

  if (selectedNotebook) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-black overflow-hidden font-sans">
        {/* Editor Header */}
        <div className="h-20 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedNotebook(null)}
              className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-95 border border-slate-100 dark:border-zinc-800"
            >
              <ChevronRight className="w-5 h-5 rotate-180 text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedNotebook.title}</h3>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Editor V2</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isSaving ? 'Saving...' : 'Saved just now'}
                </p>
                <div className="h-3 w-px bg-slate-200 dark:bg-zinc-800" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Session: 02:45:12</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-4 bg-slate-50 dark:bg-zinc-800 p-1 rounded-xl border border-slate-100 dark:border-zinc-700">
               <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Python 3.11</button>
               <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700" />
               <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">CPU: 12%</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-zinc-700">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-zinc-700">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button 
              onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); toast.success("All changes synced"); }}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Save Session
            </button>
          </div>
        </div>

        {/* Editor Main Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-black scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => {
                    const newCell: Cell = { id: Date.now().toString(), type: 'markdown', content: '## New Markdown Cell\nDouble click to edit.' };
                    setSelectedNotebook({ ...selectedNotebook, cells: [...selectedNotebook.cells, newCell] });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:text-indigo-500 transition-all shadow-sm"
                 >
                   <Type className="w-3.5 h-3.5" /> Markdown
                 </button>
                 <button 
                  onClick={() => {
                    const newCell: Cell = { id: Date.now().toString(), type: 'code', content: '# Write python code here\nprint("Hello Cognitive Tech")' };
                    setSelectedNotebook({ ...selectedNotebook, cells: [...selectedNotebook.cells, newCell] });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:text-indigo-500 transition-all shadow-sm"
                 >
                   <Code className="w-3.5 h-3.5" /> Code Cell
                 </button>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                 <Play className="w-3.5 h-3.5" /> Run All
               </button>
            </div>

            {/* Cells */}
            <AnimatePresence>
              {selectedNotebook.cells.length > 0 ? (
                selectedNotebook.cells.map((cell, i) => (
                  <motion.div 
                    layout
                    key={cell.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-50/50 dark:bg-zinc-800/30 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">[{i + 1}]</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          cell.type === 'code' ? "bg-indigo-500" : "bg-amber-500"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400">{cell.type}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => {
                             const newCells = selectedNotebook.cells.filter(c => c.id !== cell.id);
                             setSelectedNotebook({ ...selectedNotebook, cells: newCells });
                           }}
                           className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {cell.type === 'code' ? (
                        <div className="space-y-4">
                          <textarea 
                            className="w-full bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 font-mono text-sm text-indigo-500 dark:text-indigo-400 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                            rows={Math.max(2, cell.content.split('\n').length)}
                            defaultValue={cell.content}
                          />
                          {cell.output && (
                            <div className="bg-slate-900 dark:bg-zinc-950 p-4 rounded-xl border-l-4 border-emerald-500">
                               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <CheckCircle2 className="w-3 h-3" /> Output
                               </p>
                               <pre className="text-xs text-slate-300 font-mono">{cell.output}</pre>
                            </div>
                          )}
                        </div>
                      ) : (
                        <textarea 
                          className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-zinc-300 font-sans text-base leading-relaxed resize-none p-2"
                          rows={Math.max(3, cell.content.split('\n').length)}
                          defaultValue={cell.content}
                          placeholder="Double click to edit markdown..."
                        />
                      )}
                    </div>
                    {cell.type === 'code' && (
                      <div className="px-6 pb-4 flex justify-end">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                          <Play className="w-3 h-3" /> Run Cell
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[3rem] bg-white/50 dark:bg-zinc-900/30">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                    <Edit className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Notebook Empty</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-8">Add your first cell to begin the analysis.</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        const newCell: Cell = { id: Date.now().toString(), type: 'markdown', content: '# New Notebook\nStart typing...' };
                        setSelectedNotebook({ ...selectedNotebook, cells: [newCell] });
                      }}
                      className="px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:text-indigo-500 transition-all shadow-sm"
                    >
                      Markdown
                    </button>
                    <button 
                      onClick={() => {
                        const newCell: Cell = { id: Date.now().toString(), type: 'code', content: 'print("Init Session...")' };
                        setSelectedNotebook({ ...selectedNotebook, cells: [newCell] });
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      Code Cell
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="h-10 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <History className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last commit: 12 min ago</span>
              </div>
              <div className="flex items-center gap-2">
                 <Users className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">3 Collaborators online</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">UTF-8</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Connected</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Your Notebooks</h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">Collaborative, interactive workspaces for code, data, and storytelling.</p>
        </div>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Notebook
        </button>
      </div>

      {/* Toolbar: Search, Filters, Sort */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notebooks..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="flex p-1 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700">
            {['All', 'Active', 'Draft', 'Archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Sort By:</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Updated">Last Updated</option>
            <option value="Name">Name A–Z</option>
            <option value="Status">Status</option>
            <option value="Created">Date Created</option>
          </select>
        </div>
      </div>

      {/* Notebook Grid */}
      {filteredNotebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Notebook Card */}
          {activeTab === 'All' && !searchQuery && (
            <button 
              onClick={() => setIsNewModalOpen(true)}
              className="h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 hover:border-slate-400 dark:hover:border-zinc-600 transition-all group bg-slate-50/50 dark:bg-zinc-900/30"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Create New Notebook</span>
            </button>
          )}

          {/* Notebook Cards */}
          <AnimatePresence>
            {filteredNotebooks.map((nb) => (
              <motion.div 
                layout
                key={nb.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-lg transition-all group cursor-pointer flex flex-col relative"
                onClick={() => setSelectedNotebook(nb)}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                      <FileText className="w-5 h-5" />
                    </div>
                    <button 
                      onClick={(e) => toggleFavorite(nb.id, e)}
                      className={cn(
                        "p-2 rounded-lg transition-all active:scale-90",
                        nb.isFavorite ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-400 hover:bg-slate-50"
                      )}
                    >
                      <Star className={cn("w-4 h-4", nb.isFavorite && "fill-amber-500")} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => toggleStatus(nb.id, e)}
                      title={nb.status === 'Active' ? 'Deactivate' : 'Activate'}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5",
                        nb.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                        nb.status === 'Draft' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", nb.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                      {nb.status}
                    </button>
                    
                    {/* Three-dot Menu */}
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === nb.id ? null : nb.id); }}
                        className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <AnimatePresence>
                        {menuOpenId === nb.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-2 overflow-hidden"
                            >
                              {[
                                { label: 'Open', icon: FileText, action: () => setSelectedNotebook(nb) },
                                { label: 'Rename', icon: Edit, action: () => setEditingId(nb.id) },
                                { label: 'Duplicate', icon: Copy, action: () => handleDuplicate(nb) },
                                { label: 'Archive', icon: Archive, action: () => handleArchive(nb.id) },
                                { label: 'Delete', icon: Trash2, action: () => setIsDeleteModalOpen(nb.id), color: 'text-red-500' },
                              ].map((item) => (
                                <button 
                                  key={item.label}
                                  onClick={(e) => { e.stopPropagation(); item.action(); setMenuOpenId(null); }}
                                  className={cn(
                                    "w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors",
                                    item.color || "text-slate-600 dark:text-zinc-400"
                                  )}
                                >
                                  <item.icon className="w-3.5 h-3.5" />
                                  {item.label}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {editingId === nb.id ? (
                  <input 
                    autoFocus
                    className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight bg-slate-50 dark:bg-zinc-800 border border-indigo-500 rounded px-1 outline-none w-full"
                    defaultValue={nb.title}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setNotebooks(notebooks.map(n => n.id === nb.id ? { ...n, title: (e.target as HTMLInputElement).value } : n));
                        setEditingId(null);
                      }
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onBlur={(e) => {
                      setNotebooks(notebooks.map(n => n.id === nb.id ? { ...n, title: (e.target as HTMLInputElement).value } : n));
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors truncate">{nb.title}</h4>
                )}
                
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-6 line-clamp-2">{nb.description}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" title={`Exact: ${new Date(nb.createdAt).toLocaleString()}`}>
                      <Clock className="w-3.5 h-3.5" /> Updated {nb.updated}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold italic truncate ml-2">By {nb.lastEditedBy}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {nb.collaborators.length > 0 ? (
                        nb.collaborators.map((name, i) => (
                          <div 
                            key={i} 
                            title={name}
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-zinc-400 shadow-sm transition-transform hover:scale-110 cursor-help"
                          >
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                          JD
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toast.info("Sharing modal coming soon!"); }}
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-8 border-2 border-dashed border-slate-200 dark:border-zinc-800">
             <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notebooks found</h3>
          <p className="text-slate-500 dark:text-zinc-400 font-medium mb-8 max-w-xs">Create one to get started or try a different search term.</p>
          <button 
            onClick={() => { setIsNewModalOpen(true); setSearchQuery(''); setActiveTab('All'); }}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Notebook
          </button>
        </div>
      )}

      {/* New Notebook Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Init Workspace</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Notebook Name</label>
                  <input 
                    autoFocus
                    placeholder="e.g. Sales Forecast 2026"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const title = (e.target as HTMLInputElement).value;
                        if (!title) return;
                        const newNb: Notebook = {
                          id: Date.now().toString(),
                          title,
                          description: 'New interactive research workspace.',
                          updated: 'Just now',
                          status: 'Draft',
                          isFavorite: false,
                          cells: [],
                          lastEditedBy: 'John Doe',
                          collaborators: [],
                          createdAt: new Date().toISOString()
                        };
                        setNotebooks([newNb, ...notebooks]);
                        setIsNewModalOpen(false);
                        toast.success("Notebook created!");
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Blank', icon: FileText, color: 'text-slate-400' },
                      { name: 'Analysis', icon: Code, color: 'text-indigo-500' },
                      { name: 'Stocks', icon: Layout, color: 'text-amber-500' },
                      { name: 'Report', icon: FileText, color: 'text-emerald-500' },
                    ].map((t) => (
                      <button 
                        key={t.name}
                        className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left flex items-center gap-3 group"
                      >
                        <t.icon className={cn("w-5 h-5 group-hover:scale-110 transition-transform", t.color)} />
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button onClick={() => setIsNewModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">Discard</button>
                <button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="e.g. Sales Forecast 2026"]') as HTMLInputElement;
                    if (!input?.value) return;
                    const newNb: Notebook = {
                      id: Date.now().toString(),
                      title: input.value,
                      description: 'New interactive research workspace.',
                      updated: 'Just now',
                      status: 'Draft',
                      isFavorite: false,
                      cells: [],
                      lastEditedBy: 'John Doe',
                      collaborators: [],
                      createdAt: new Date().toISOString()
                    };
                    setNotebooks([newNb, ...notebooks]);
                    setIsNewModalOpen(false);
                    toast.success("Notebook created!");
                  }}
                  className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Init Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Notebook?</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-8">This action cannot be undone. All cells and data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(null)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 transition-colors">Keep</button>
                <button 
                  onClick={() => {
                    setNotebooks(notebooks.filter(n => n.id !== isDeleteModalOpen));
                    setIsDeleteModalOpen(null);
                    toast.success("Notebook purged.");
                  }} 
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
