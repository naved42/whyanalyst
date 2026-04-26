import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudUpload, 
  FileText, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  RefreshCw, 
  XCircle, 
  FileSearch, 
  Bell, 
  HelpCircle, 
  Plus, 
  Rocket, 
  Database, 
  History, 
  Lock, 
  GitBranch,
  ExternalLink,
  Pause,
  RefreshCcw,
  LayoutGrid,
  Trash2,
  FileCode,
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface AppFile {
  id: string;
  name: string;
  type: 'Dataset' | 'Model Weight' | 'Log';
  extension: 'csv' | 'json' | 'sql' | 'xlsx';
  size: number; // in bytes
  status: 'Ready' | 'Processing' | 'Error';
  createdAt: string;
  versions: number;
}

export const FilesView = () => {
  const { getToken, user } = useAuth();
  const [files, setFiles] = React.useState<AppFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'All' | 'Datasets' | 'Model Weights' | 'Logs' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof AppFile; direction: 'asc' | 'desc' } | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  
  // Upload State
  const [uploadQueue, setUploadQueue] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Storage Stats
  const STORAGE_LIMIT = 10 * 1024 * 1024 * 1024; // 10GB in bytes
  const usedStorage = React.useMemo(() => files.reduce((acc, f) => acc + f.size, 0), [files]);
  const storagePercentage = Math.min((usedStorage / STORAGE_LIMIT) * 100, 100);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/datasets', { headers });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      
      // Transform mock data to new AppFile structure
      const transformed = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        type: 'Dataset',
        extension: d.name.split('.').pop() as any || 'csv',
        size: (d.rows || 100) * 512, // Mock size calculation
        status: 'Ready',
        createdAt: d.createdAt,
        versions: 1
      }));
      setFiles(transformed);
    } catch (error) {
      console.error("Failed to fetch files", error);
      toast.error("Could not load files");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFiles: File[] = [];
    if ('files' in e.target && e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      selectedFiles = Array.from(e.dataTransfer.files);
    }

    if (selectedFiles.length === 0) return;

    // Validation
    const validExtensions = ['csv', 'json', 'sql', 'xlsx', 'xls'];
    const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

    for (const file of selectedFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !validExtensions.includes(ext)) {
        toast.error(`Unsupported file type: ${file.name}. Please upload CSV, JSON, or SQL only.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`File too large: ${file.name}. Max size is 2GB.`);
        continue;
      }

      // Add to queue and simulate upload
      const uploadId = Math.random().toString(36).substr(2, 9);
      setUploadQueue(prev => [...prev, { id: uploadId, name: file.name, progress: 0, speed: '0 MB/s' }]);

      simulateUpload(uploadId, file);
    }
  };

  const simulateUpload = (id: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadQueue(prev => prev.filter(u => u.id !== id));
          const newFile: AppFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'Dataset',
            extension: file.name.split('.').pop() as any,
            size: file.size,
            status: 'Ready',
            createdAt: new Date().toISOString(),
            versions: 1
          };
          setFiles(prev => [newFile, ...prev]);
          toast.success(`${file.name} uploaded successfully`);
        }, 500);
      }
      setUploadQueue(prev => prev.map(u => u.id === id ? { ...u, progress: Math.round(progress), speed: (Math.random() * 5 + 2).toFixed(1) + ' MB/s' } : u));
    }, 200);
  };

  const deleteFile = async (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success("File deleted successfully");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Modal States
  const [previewFile, setPreviewFile] = React.useState<AppFile | null>(null);
  const [moveFile, setMoveFile] = React.useState<AppFile | null>(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = React.useState<AppFile | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [showVersionHistory, setShowVersionHistory] = React.useState<AppFile | null>(null);
  const [showOptimizeAI, setShowOptimizeAI] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRename = (file: AppFile) => {
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, name: editingName } : f));
    setEditingId(null);
    toast.success("File renamed");
  };

  const filteredFiles = React.useMemo(() => {
    let result = [...files];
    if (activeTab !== 'All') {
      result = result.filter(f => {
        if (activeTab === 'Datasets') return f.type === 'Dataset';
        if (activeTab === 'Model Weights') return f.type === 'Model Weight';
        if (activeTab === 'Logs') return f.type === 'Log';
        if (activeTab === 'Archived') return false; // Mock archive logic
        return true;
      });
    }
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [files, activeTab, searchQuery, sortConfig]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen max-w-[1600px] mx-auto">
      {/* Storage Warnings */}
      <AnimatePresence>
        {storagePercentage >= 80 && storagePercentage < 100 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400 text-sm font-bold">
              <Bell className="w-4 h-4" />
              You are using {storagePercentage.toFixed(0)}% of your storage. Upgrade to avoid interruptions.
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-yellow-900 dark:text-yellow-300 hover:underline">Upgrade Now</button>
          </motion.div>
        )}
        {storagePercentage >= 100 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-400 text-sm font-bold">
              <XCircle className="w-4 h-4" />
              Storage full. Please delete files or upgrade your plan to upload more.
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-red-900 dark:text-red-300 hover:underline">Manage Storage</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Files Management</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Manage your datasets, model outputs, and cognitive assets.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
             <Plus className="w-4 h-4" />
             New Upload
           </button>
        </div>
      </div>

      <input 
        type="file" 
        multiple
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
        accept=".csv,.json,.sql,.xlsx"
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav (Folders) */}
        <div className="lg:col-span-2 space-y-8">
          <nav className="space-y-1">
            {[
              { id: 'All', label: 'All Files', icon: LayoutGrid },
              { id: 'Datasets', label: 'Datasets', icon: FileText, count: files.filter(f => f.type === 'Dataset').length },
              { id: 'Model Weights', label: 'Model Weights', icon: Zap, count: files.filter(f => f.type === 'Model Weight').length },
              { id: 'Logs', label: 'Logs', icon: History, count: files.filter(f => f.type === 'Log').length },
              { id: 'Archived', label: 'Archived', icon: Trash2 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === item.id 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.count !== undefined && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-md",
                    activeTab === item.id ? "bg-brand-primary/20" : "bg-slate-100 dark:bg-zinc-800"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Storage Mini-Widget */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Storage</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{storagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercentage}%` }}
                className={cn(
                  "h-full transition-all",
                  storagePercentage >= 100 ? "bg-red-500" : storagePercentage >= 80 ? "bg-yellow-500" : "bg-brand-primary"
                )}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold mb-4">{formatSize(usedStorage)} of {formatSize(STORAGE_LIMIT)} used</p>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Middle/Main Area */}
        <div className="lg:col-span-10 space-y-6">
          
          {/* Upload & Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              onClick={() => storagePercentage < 100 && fileInputRef.current?.click()}
              className={cn(
                "relative bg-white dark:bg-zinc-900 p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center group transition-all min-h-[220px]",
                storagePercentage >= 100 ? "opacity-50 cursor-not-allowed border-red-200 dark:border-red-900" : "cursor-pointer border-slate-200 dark:border-zinc-800 hover:border-brand-primary hover:bg-brand-primary/[0.02]"
              )}
            >
              {uploadQueue.length === 0 ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CloudUpload className="w-7 h-7 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Assets</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-[200px]">Drag & Drop or <span className="text-brand-primary font-bold">browse</span></p>
                  <div className="flex gap-2 mt-4">
                    {['CSV', 'JSON', 'SQL'].map(type => (
                      <span key={type} className="text-[9px] font-black px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded-md text-slate-400 uppercase tracking-tighter">{type}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full space-y-4 px-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-primary">Processing Queue</h3>
                  {uploadQueue.map(upload => (
                    <div key={upload.id} className="w-full bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{upload.name}</span>
                        <span className="text-[10px] font-bold text-brand-primary">{upload.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${upload.progress}%` }}
                          className="h-full bg-brand-primary"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{upload.speed}</span>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Optimize for AI</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">Cleaned CSV files process 3x faster. Use our autonomous agent to normalize datasets before analysis.</p>
                </div>
                <button 
                  onClick={() => setShowOptimizeAI(true)}
                  className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-primary hover:gap-3 transition-all"
                >
                  Learn more & Launch Agent
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            </section>
          </div>

          {/* Recently Uploaded Table */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-zinc-800/20">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Recently Uploaded
                  <span className="ml-2 text-slate-400 dark:text-zinc-600">({filteredFiles.length})</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 transition-all duration-300",
                  isSearchExpanded ? "w-64" : "w-10 overflow-hidden"
                )}>
                  <Search className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer" onClick={() => setIsSearchExpanded(!isSearchExpanded)} />
                  <input 
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ml-3 bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <button 
                  onClick={fetchFiles}
                  className="p-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all group"
                >
                  <RefreshCcw className="w-4 h-4 text-slate-500 group-active:rotate-180 transition-transform" />
                </button>
              </div>
            </div>

            {/* Bulk Action Bar */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="px-8 py-3 bg-brand-primary text-white flex items-center justify-between"
                >
                  <span className="text-sm font-bold">{selectedIds.size} files selected</span>
                  <div className="flex items-center gap-4">
                    <button className="text-xs font-black uppercase tracking-widest hover:underline">Download Selected</button>
                    <button className="text-xs font-black uppercase tracking-widest hover:underline">Move</button>
                    <button className="text-xs font-black uppercase tracking-widest hover:underline text-red-100">Delete</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 dark:bg-zinc-800/30">
                  <tr>
                    <th className="pl-8 pr-4 py-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 dark:border-zinc-700 text-brand-primary focus:ring-brand-primary" 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(new Set(filteredFiles.map(f => f.id)));
                          else setSelectedIds(new Set());
                        }}
                        checked={selectedIds.size === filteredFiles.length && filteredFiles.length > 0}
                      />
                    </th>
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'status', label: 'Status' },
                      { key: 'size', label: 'Size', align: 'right' },
                    ].map(col => (
                      <th 
                        key={col.key}
                        onClick={() => setSortConfig({ key: col.key as any, direction: sortConfig?.key === col.key && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                        className={cn(
                          "px-6 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-zinc-800 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors",
                          col.align === 'right' && "text-right"
                        )}
                      >
                        <div className={cn("flex items-center gap-1", col.align === 'right' && "justify-end")}>
                          {col.label}
                          {sortConfig?.key === col.key && (
                             <ChevronRight className={cn("w-3 h-3 transition-transform", sortConfig.direction === 'desc' ? "rotate-90" : "-rotate-90")} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center max-w-sm mx-auto">
                          <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                            <CloudUpload className="w-10 h-10 text-slate-300" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase">No assets found</h4>
                          <p className="text-sm text-slate-500 dark:text-zinc-500 mb-8 font-medium">Start building your intelligence pool by uploading datasets, logs, or model outputs.</p>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-brand-primary/20"
                          >
                            Upload Files Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredFiles.map((file) => (
                    <tr key={file.id} className={cn(
                      "group transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30",
                      selectedIds.has(file.id) && "bg-brand-primary/[0.03] dark:bg-brand-primary/[0.03]"
                    )}>
                      <td className="pl-8 pr-4 py-5">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 dark:border-zinc-700 text-brand-primary focus:ring-brand-primary" 
                          checked={selectedIds.has(file.id)}
                          onChange={() => {
                            const newSet = new Set(selectedIds);
                            if (newSet.has(file.id)) newSet.delete(file.id);
                            else newSet.add(file.id);
                            setSelectedIds(newSet);
                          }}
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative group-hover:scale-110 transition-transform duration-300",
                            file.extension === 'csv' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" :
                            file.extension === 'json' ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600" :
                            "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600"
                          )}>
                            {file.extension === 'csv' ? <FileText className="w-6 h-6" /> :
                             file.extension === 'json' ? <GitBranch className="w-6 h-6" /> :
                             <Database className="w-6 h-6" />}
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md text-[8px] font-black uppercase tracking-tighter shadow-sm">{file.extension}</span>
                          </div>
                          <div>
                            {editingId === file.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  autoFocus
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleRename(file)}
                                  onBlur={() => setEditingId(null)}
                                  className="bg-white dark:bg-zinc-800 border border-brand-primary rounded px-2 py-0.5 text-sm font-bold outline-none"
                                />
                              </div>
                            ) : (
                              <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{file.name}</div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-tighter">{new Date(file.createdAt).toLocaleDateString()}</span>
                              {file.versions > 1 && <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[8px] font-bold rounded-md">v{file.versions}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          file.status === 'Ready' ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100 dark:border-emerald-900/30" :
                          file.status === 'Processing' ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 border-amber-100 dark:border-amber-900/30" :
                          "bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100 dark:border-red-900/30"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                            file.status === 'Ready' ? "bg-emerald-500" : 
                            file.status === 'Processing' ? "bg-amber-500" : "bg-red-500"
                          )} />
                          {file.status}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-xs font-black text-slate-900 dark:text-white font-mono">{formatSize(file.size)}</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => { setEditingId(file.id); setEditingName(file.name); }}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all" title="Rename"
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </button>
                          <button 
                            onClick={() => setMoveFile(file)}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all" title="Move"
                          >
                            <GitBranch className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toast.success("Downloading " + file.name)}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all" title="Download"
                          >
                            <CloudUpload className="w-4 h-4 rotate-180" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmFile(file)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-1"></div>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                              {openMenuId === file.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                  >
                                    <div className="p-2 space-y-1">
                                      {[
                                        { label: 'Preview', icon: FileSearch, onClick: () => { setPreviewFile(file); setOpenMenuId(null); } },
                                        { label: 'Analyze with AI', icon: Zap, onClick: () => { toast.success("AI Analysis launched"); setOpenMenuId(null); } },
                                        { label: 'Copy Link', icon: ExternalLink, onClick: () => { navigator.clipboard.writeText("https://cogtech.ai/file/" + file.id); toast.success("Link copied!"); setOpenMenuId(null); } },
                                        { label: 'Archive', icon: Trash2, onClick: () => { toast.info("File archived"); setOpenMenuId(null); } },
                                        { label: 'Version History', icon: History, onClick: () => { setShowVersionHistory(file); setOpenMenuId(null); } },
                                      ].map((item) => (
                                        <button 
                                          key={item.label}
                                          onClick={item.onClick}
                                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-brand-primary/5 hover:text-brand-primary transition-all"
                                        >
                                          <item.icon className="w-3.5 h-3.5" />
                                          {item.label}
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/30 dark:bg-zinc-800/20">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Showing {filteredFiles.length} files</span>
               <div className="flex items-center gap-4">
                 <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary disabled:opacity-30">Previous</button>
                 <div className="px-3 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-[10px] font-black">Page 1 of 1</div>
                 <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary disabled:opacity-30">Next</button>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Info Area */}
      <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-6 py-10 border-t border-slate-200 dark:border-zinc-800">
        {[
          { label: 'AES-256 Encrypted', icon: Lock, desc: 'Enterprise-grade encryption at rest' },
          { label: 'Redundant Storage', icon: GitBranch, desc: 'Multi-region data replication' },
          { label: '30-Day Versioning', icon: History, desc: 'Restore any point-in-time state' }
        ].map((info) => (
          <div key={info.label} className="group relative flex items-center gap-3 text-slate-400 dark:text-zinc-500 hover:text-slate-600 transition-colors cursor-help">
            <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
              <info.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.3em]">{info.label}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
              {info.desc}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {deleteConfirmFile && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">Delete File?</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8 font-medium">Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{deleteConfirmFile.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirmFile(null)}
                  className="flex-1 py-3 px-6 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { deleteFile(deleteConfirmFile.id); setDeleteConfirmFile(null); }}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {moveFile && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-6">Move Asset</h3>
              <div className="space-y-3 mb-8">
                {['Datasets', 'Model Weights', 'Logs', 'Archived'].map(folder => (
                  <button 
                    key={folder}
                    onClick={() => { toast.success("Moved to " + folder); setMoveFile(null); }}
                    className="w-full p-4 text-left border border-slate-100 dark:border-zinc-800 rounded-xl hover:bg-brand-primary/5 hover:border-brand-primary transition-all flex items-center gap-3"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{folder}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setMoveFile(null)}
                className="w-full py-3 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {previewFile && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] max-w-5xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{previewFile.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Data Preview • First 50 Rows</p>
                </div>
                <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white dark:bg-zinc-900 shadow-sm">
                    <tr>
                      {['ID', 'Timestamp', 'Feature_A', 'Feature_B', 'Label', 'Confidence'].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/20">
                        <td className="px-4 py-3 text-xs font-mono text-slate-400">#TRX_{8492 + i}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{new Date().toLocaleTimeString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-900 dark:text-white font-bold">{(Math.random() * 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-slate-900 dark:text-white font-bold">{(Math.random() * 10).toFixed(4)}</td>
                        <td className="px-4 py-3">
                           <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[9px] font-black rounded uppercase">Valid</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-brand-primary">{(95 + Math.random() * 5).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-slate-50 dark:bg-zinc-800/30 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Metadata: {previewFile.extension.toUpperCase()} Format • {formatSize(previewFile.size)}</p>
                <div className="flex gap-4">
                  <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">Download CSV</button>
                  <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">Analyze with AI</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showUpgradeModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowUpgradeModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="text-center mb-12">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Expand Your Intelligence Pool</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-md mx-auto">Get massive storage and advanced cognitive processing features.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Starter', price: '$0', storage: '10 GB', features: ['Standard Upload', '3-Day History', 'Basic AI'], current: true },
                  { name: 'Pro', price: '$49', storage: '250 GB', features: ['Multi-file Upload', '30-Day Versioning', 'Priority Reasoning'], popular: true },
                  { name: 'Enterprise', price: 'Custom', storage: 'UNLIMITED', features: ['Dedicated Storage', 'On-premise LLM', 'SLA Support'], current: false },
                ].map(plan => (
                  <div key={plan.name} className={cn(
                    "p-8 rounded-[2rem] border transition-all relative flex flex-col justify-between",
                    plan.popular ? "border-brand-primary bg-brand-primary/[0.02] shadow-xl shadow-brand-primary/10" : "border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30"
                  )}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</span>}
                    <div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{plan.name}</h4>
                      <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">{plan.price}<span className="text-sm font-medium text-slate-400 tracking-normal">{plan.price !== 'Custom' && '/mo'}</span></div>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-xs font-bold text-slate-900 dark:text-white">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                          {plan.storage} Storage
                        </li>
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-slate-200 dark:text-zinc-700" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className={cn(
                      "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                      plan.current ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-95"
                    )}>
                      {plan.current ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Side Panels */}
      <AnimatePresence>
        {showVersionHistory && (
          <>
            <div className="fixed inset-0 z-[400] bg-slate-950/20 backdrop-blur-[2px]" onClick={() => setShowVersionHistory(null)}></div>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 z-[401] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Version History</h3>
                <button onClick={() => setShowVersionHistory(null)}><XCircle className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-auto p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{showVersionHistory.name}</div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Version</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past Versions</h4>
                  {[
                    { v: 1.2, date: '2 hours ago', size: '1.2 MB', user: 'System' },
                    { v: 1.1, date: 'Yesterday', size: '1.1 MB', user: 'Demo Scientist' },
                    { v: 1.0, date: '3 days ago', size: '980 KB', user: 'Demo Scientist' },
                  ].map((ver) => (
                    <div key={ver.v} className="flex items-center justify-between p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Version {ver.v}</div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{ver.date} • {ver.size}</p>
                      </div>
                      <button 
                        onClick={() => { toast.success("Restored version " + ver.v); setShowVersionHistory(null); }}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showOptimizeAI && (
          <>
            <div className="fixed inset-0 z-[400] bg-slate-950/20 backdrop-blur-[2px]" onClick={() => setShowOptimizeAI(false)}></div>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 z-[401] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Data Cleaning</h3>
                <button onClick={() => setShowOptimizeAI(false)}><XCircle className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-auto p-8 space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Autonomous Cleaning Agent</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Our agent uses semantic analysis to normalize your datasets before they enter the processing pipeline. This reduces token usage by up to 40%.</p>
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Agents</h5>
                  {[
                    { n: 'Deduplication', d: 'Remove repeating rows & redundant data points' },
                    { n: 'Null Value Handler', d: 'Intelligently fill or remove empty cells' },
                    { n: 'Schema Normalizer', d: 'Standardize headers and data types' },
                    { n: 'Outlier Detection', d: 'Flag statistical anomalies automatically' },
                  ].map(agent => (
                    <div key={agent.n} className="flex items-center gap-4 p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl group cursor-pointer hover:border-brand-primary transition-all">
                      <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-brand-primary transition-colors"></div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{agent.n}</div>
                        <p className="text-[10px] text-slate-400 mt-1">{agent.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => { toast.success("Cleaning agent launched on selected files"); setShowOptimizeAI(false); }}
                    className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Launch Cleaning Agent
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
