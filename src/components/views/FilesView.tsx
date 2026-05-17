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
  Download,
  Edit2,
  FolderOpen,
  ArrowUpDown,
  Filter,
  Eye,
  Brain,
  Copy,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Archive,
  Menu,
  X,
  FileJson,
  Folder,
  BarChart2
} from 'lucide-react';
import { DataAnalysisModal } from '../DataAnalysisModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Badge } from "@/src/components/ui/badge";

interface Dataset {
  id: string;
  name: string;
  filePath?: string;
  rows: number;
  columns: number;
  schema: any[];
  preview: any[];
  createdAt: string;
  type?: 'Dataset' | 'Model Weight' | 'Log';
  size?: string;
  status: 'Ready' | 'Processing' | 'Error';
  versionCount?: number;
  isArchived?: boolean;
}

export const FilesView = () => {
  const { getToken, user } = useAuth();
  const [datasets, setDatasets] = React.useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // New State for logic
  const [activeCategory, setActiveCategory] = React.useState<'All' | 'Datasets' | 'Model Weights' | 'Logs' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Dataset; direction: 'asc' | 'desc' } | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [uploadQueue, setUploadQueue] = React.useState<{ id: string; name: string; progress: number; speed: string; status: 'uploading' | 'success' | 'error' }[]>([]);
  const [storageLimit] = React.useState(2 * 1024 * 1024 * 1024); // 2GB
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [showCleaningPanel, setShowCleaningPanel] = React.useState(false);
  const [showVersionHistory, setShowVersionHistory] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [paginationPage, setPaginationPage] = React.useState(1);
  const [viewAll, setViewAll] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [analysisDataset, setAnalysisDataset] = React.useState<Dataset | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = React.useState(false);
  const [showUploadMenu, setShowUploadMenu] = React.useState(false);
  const [analysisInitialTab, setAnalysisInitialTab] = React.useState<'overview' | 'stats' | 'correlation' | 'preview'>('overview');

  const STORAGE_CATEGORIES = [
    { name: 'Datasets', count: 0, size: 0, color: 'bg-slate-900 dark:bg-indigo-500' },
    { name: 'Model Weights', count: 0, size: 0, color: 'bg-slate-400 dark:bg-zinc-600' },
    { name: 'Logs', count: 0, size: 0, color: 'bg-slate-200 dark:bg-zinc-700' },
  ];

  const totalUsedSize = React.useMemo(() => {
    return datasets.reduce((acc, d) => {
      const sizeVal = parseFloat(d.size?.split(' ')[0] || '0');
      if (isNaN(sizeVal)) return acc;
      const unit = d.size?.split(' ')[1] || 'KB';
      let multiplyer = 1024;
      if (unit === 'MB') multiplyer = 1024 * 1024;
      if (unit === 'GB') multiplyer = 1024 * 1024 * 1024;
      return acc + (sizeVal * multiplyer);
    }, 0);
  }, [datasets]);

  const storagePercentage = Math.min((totalUsedSize / storageLimit) * 100, 100);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('/api/datasets');
      const data = await res.json();
      // Enrich data for logic with variety
      const enriched = data.map((d: any, index: number) => {
        let type: 'Dataset' | 'Model Weight' | 'Log' = 'Dataset';
        if (d.name.toLowerCase().includes('weight') || d.name.toLowerCase().includes('model') || index % 10 === 7) type = 'Model Weight';
        if (d.name.toLowerCase().includes('log') || index % 10 === 9) type = 'Log';
        
        return {
          ...d,
          type,
          size: formatSize(d.rows),
          status: 'Ready',
          versionCount: Math.floor(Math.random() * 5) + 1,
          isArchived: index % 15 === 0 // Mock some archived files
        };
      });
      setDatasets(enriched);
    } catch (error) {
      console.error("Failed to fetch datasets", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDatasets();
  }, []);

  const updateUploadProgress = (id: string, progress: number, speed: string) => {
    setUploadQueue(prev => prev.map(u => u.id === id ? { ...u, progress, speed } : u));
  };

  const updateUploadStatus = (id: string, status: 'success' | 'error') => {
    setUploadQueue(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newUploads = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0,
      speed: '0 KB/s',
      status: 'uploading' as const
    }));

    setUploadQueue(prev => [...prev, ...newUploads]);
    setIsUploading(true);
    setUploadStatus('uploading');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadId = newUploads[i].id;

        // Validation: Size (2GB)
        if (file.size > 2 * 1024 * 1024 * 1024) {
            toast.error(`File ${file.name} exceeds 2GB limit`);
            updateUploadStatus(uploadId, 'error');
            continue;
        }

        // Validation: Type
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['csv', 'xlsx', 'xls', 'json', 'sql'].includes(ext || '')) {
          toast.error(`${file.name}: Unsupported file type`);
          updateUploadStatus(uploadId, 'error');
          continue;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = await getToken();

            const startTime = Date.now();
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress >= 95) clearInterval(interval);
                const elapsed = (Date.now() - startTime) / 1000;
                const speed = ((file.size * (progress/100)) / (elapsed + 0.1) / 1024).toFixed(1) + ' KB/s';
                updateUploadProgress(uploadId, Math.min(progress, 95), speed);
            }, 300);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            clearInterval(interval);
            if (!res.ok) throw new Error("Upload failed");

            const newDataset = await res.json();
            const enriched: Dataset = {
                ...newDataset,
                type: 'Dataset',
                size: formatSize(newDataset.rows),
                status: 'Ready',
                versionCount: 1
            };
            setDatasets(prev => [enriched, ...prev]);
            updateUploadProgress(uploadId, 100, 'Done');
            updateUploadStatus(uploadId, 'success');
            toast.success(`${file.name} uploaded`);
        } catch (error) {
            updateUploadStatus(uploadId, 'error');
            toast.error(`Failed to upload ${file.name}`);
        }
    }
    
    // Set main status to success if all finished
    setUploadStatus('success');
    setTimeout(() => {
      setUploadStatus('idle');
      setIsUploading(false);
      setUploadQueue([]);
    }, 5000);
  };

  // Drag and Drop Logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Keyboard shortcut Ctrl+U
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

  const parseSize = (sizeStr?: string) => {
    if (!sizeStr) return 0;
    const [val, unit] = sizeStr.split(' ');
    let bytes = parseFloat(val);
    if (unit === 'MB') bytes *= 1024 * 1024;
    if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
    if (unit === 'KB') bytes *= 1024;
    return bytes;
  };

  const filteredFiles = React.useMemo(() => {
    let result = datasets;
    
    if (activeCategory !== 'All') {
      result = result.filter(f => {
          if (activeCategory === 'Datasets') return f.type === 'Dataset' && !f.isArchived;
          if (activeCategory === 'Model Weights') return f.type === 'Model Weight' && !f.isArchived;
          if (activeCategory === 'Logs') return f.type === 'Log' && !f.isArchived;
          if (activeCategory === 'Archived') return f.isArchived;
          return !f.isArchived;
      });
    } else {
      // "All" view shows everything except archived by default, or just everything?
      // Usually "All" doesn't show archived unless requested.
      result = result.filter(f => !f.isArchived);
    }

    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (sortConfig) {
      result = [...result].sort((a: any, b: any) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (sortConfig.key === 'size' as any) {
          valA = parseSize(a.size);
          valB = parseSize(b.size);
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [datasets, activeCategory, searchQuery, sortConfig]);

  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const copyFileLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/files/${id}`);
    toast.success("Link copied to clipboard");
    setActiveMenuId(null);
  };

  const requestSort = (key: keyof Dataset) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const deleteDataset = async (id: string) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      setDatasets(prev => prev.filter(d => d.id !== id));
      setSelectedFiles(prev => prev.filter(fid => fid !== id));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setFileToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedFiles) {
        await deleteDataset(id);
    }
    setSelectedFiles([]);
  };

  const renameFile = (id: string, oldName: string) => {
    const newName = prompt("Enter new name:", oldName);
    if (newName && newName !== oldName) {
        setDatasets(prev => prev.map(d => d.id === id ? { ...d, name: newName } : d));
        toast.success("File renamed");
    }
  };

  const downloadFile = (file: Dataset) => {
    const blob = new Blob([JSON.stringify(file.preview)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.json`;
    a.click();
    toast.success("Download started");
  };

  const handleAnalyze = (file: Dataset, initialTab: 'overview' | 'stats' | 'correlation' | 'preview' = 'overview') => {
    setAnalysisDataset(file);
    setAnalysisInitialTab(initialTab);
    setIsAnalysisModalOpen(true);
  };

  const uploadOptions = [
    { label: 'CSV File', icon: FileText, accept: '.csv' },
    { label: 'Excel Spreadsheet', icon: FileJson, accept: '.xlsx,.xls' },
    { label: 'JSON Data', icon: GitBranch, accept: '.json' },
    { label: 'Database SQL', icon: Database, accept: '.sql' },
    { label: 'Cloud Import', icon: CloudUpload, type: 'link' },
  ];

  const handleOptionClick = (option: any) => {
    if (option.type === 'link') {
       toast.info(`Connecting to ${option.label}...`);
    } else {
       if (fileInputRef.current) {
         fileInputRef.current.accept = option.accept || '*/*';
         fileInputRef.current.click();
       }
    }
    setShowUploadMenu(false);
  };

  const formatSize = (rows: number) => {
    const kb = rows * 0.5; // Mock calculation
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 gap-8 w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileUpload(e.target.files)} 
        className="hidden" 
        multiple
      />
      {/* Folder Sidebar */}
      <aside className="w-full lg:w-64 space-y-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-500" />
            Files
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium italic">Manage cognitive assets</p>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'All', label: 'All Files', icon: LayoutGrid },
            { id: 'Datasets', label: 'Datasets', icon: Database },
            { id: 'Model Weights', label: 'Model Weights', icon: Zap },
            { id: 'Logs', label: 'Logs', icon: FileCode },
            { id: 'Archived', label: 'Archived', icon: Archive },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id as any)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all group",
                activeCategory === item.id 
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800" 
                  : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-900/50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4 transition-colors", activeCategory === item.id ? "text-indigo-500" : "group-hover:text-indigo-400")} />
                {item.label}
              </div>
              <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 rounded-lg">
                {item.id === 'All' ? datasets.filter(d => !d.isArchived).length : 
                 item.id === 'Archived' ? datasets.filter(d => d.isArchived).length :
                 datasets.filter(d => d.type === item.id.replace('s', '') && !d.isArchived).length}
              </Badge>
            </button>
          ))}
        </nav>

        {/* Storage Stats in Sidebar */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Storage</h3>
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
              storagePercentage > 90 ? "bg-red-100 text-red-600" : storagePercentage > 75 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
            )}>
              {storagePercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${storagePercentage}%` }}
              className={cn(
                "h-full rounded-full transition-all",
                storagePercentage > 90 ? "bg-red-500" : storagePercentage > 75 ? "bg-amber-500" : "bg-indigo-500"
              )}
            ></motion.div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{(totalUsedSize / (1024*1024)).toFixed(1)}MB / 2GB used</p>
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="w-full py-2 bg-slate-900 dark:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity active:scale-95"
          >
            Upgrade Plan
          </button>
        </section>

        {/* Optimization Card */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-indigo-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <Rocket className="w-6 h-6 mb-3 opacity-80 group-hover:translate-x-1 transition-transform" />
            <h3 className="text-sm font-bold mb-1">AI Optimization</h3>
            <p className="text-[10px] text-slate-400 dark:text-indigo-100 font-medium leading-relaxed mb-3">Cleaned CSV files process 3x faster.</p>
            <button 
              onClick={() => setShowCleaningPanel(true)}
              className="text-white font-bold text-[10px] uppercase tracking-widest underline underline-offset-4 flex items-center gap-1 group/btn"
            >
              Learn more
              <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" />
            </button>
          </div>
          <Rocket className="absolute -right-4 -bottom-4 opacity-10 w-24 h-24 rotate-12" />
        </section>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Storage Warning Banner */}
        {storagePercentage >= 80 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className={cn(
              "px-4 py-2 rounded-xl flex items-center justify-between gap-4 border text-[11px] font-bold uppercase tracking-widest",
              storagePercentage >= 100 ? "bg-red-500 text-white border-red-600" : "bg-amber-500 text-white border-amber-600"
            )}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 animate-bounce" />
              {storagePercentage >= 100 ? "Storage Full! Uploads disabled." : "Storage almost full. Consider upgrading soon."}
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg backdrop-blur-sm transition-colors"
            >
              Resolve
            </button>
          </motion.div>
        )}

        {/* Upload Zone */}
        <section 
          onClick={() => !isUploading && storagePercentage < 100 && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "bg-white dark:bg-zinc-900 p-8 sm:p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center group transition-all relative overflow-hidden",
            isDragging ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 scale-[1.01]" : "border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600",
            uploadStatus === 'uploading' && "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5",
            uploadStatus === 'success' && "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5",
            uploadStatus === 'error' && "border-red-500 bg-red-50/10 dark:bg-red-500/5",
            (isUploading || storagePercentage >= 100) && "pointer-events-none opacity-80"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all",
            uploadStatus === 'success' ? "bg-emerald-500 text-white" :
            uploadStatus === 'error' ? "bg-red-500 text-white" :
            "bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          )}>
            {uploadStatus === 'uploading' ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : uploadStatus === 'success' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : uploadStatus === 'error' ? (
              <XCircle className="w-8 h-8" />
            ) : (
              <CloudUpload className="w-8 h-8" />
            )}
          </div>
          
          <h3 className={cn(
            "text-xl font-bold mb-2",
            uploadStatus === 'success' ? "text-emerald-600 dark:text-emerald-400" :
            uploadStatus === 'error' ? "text-red-600 dark:text-red-400" :
            "text-slate-900 dark:text-white"
          )}>
            {uploadStatus === 'uploading' ? `Synthesizing Intelligence...` : 
             uploadStatus === 'success' ? "Context Loaded" :
             uploadStatus === 'error' ? "Uplink Failed" :
             storagePercentage >= 100 ? "Capacity Exceeded" : "Upload Files"}
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6 font-medium">
            {uploadStatus === 'idle' ? (
              <>Drag and drop your files here or <span className="text-slate-900 dark:text-white font-bold">browse your computer</span>. Max file size: 2GB.</>
            ) : uploadStatus === 'uploading' ? (
              "Our cognitive engine is indexing your data structure..."
            ) : uploadStatus === 'success' ? (
              "Dataset successfully added to your intelligence pool."
            ) : (
              "There was an error processing your request. Please try again."
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { type: 'CSV', icon: FileText, accept: '.csv' },
              { type: 'JSON', icon: GitBranch, accept: '.json' },
              { type: 'SQL', icon: Database, accept: '.sql' },
            ].map((item) => (
              <button 
                key={item.type}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current!.accept = item.accept;
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-500 transition-colors"
              >
                <item.icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 tracking-wider font-mono">{item.type}</span>
              </button>
            ))}
          </div>

          {/* Individual Progressive Upload Rows */}
          <AnimatePresence>
            {uploadQueue.length > 0 && (
              <div className="mt-8 w-full max-w-lg space-y-3">
                {uploadQueue.map(u => (
                  <motion.div 
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 p-3 rounded-xl flex items-center gap-4 text-left shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                      {u.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : u.status === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                        <span className="text-[10px] font-mono text-slate-400">{u.speed}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${u.progress}%` }}
                          className={cn("h-full", u.status === 'error' ? "bg-red-500" : "bg-indigo-500")}
                        />
                      </div>
                    </div>
                    {u.status === 'uploading' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setUploadQueue(q => q.filter(item => item.id !== u.id)) }}
                        className="p-1 hover:bg-slate-50 dark:hover:bg-zinc-700 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Recently Uploaded / File Table */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recently Uploaded</h3>
              <Badge variant="outline" className="bg-white dark:bg-zinc-900 text-[10px] px-1.5 h-5 font-bold">
                {filteredFiles.length}
              </Badge>
              <div className="relative ml-2">
                <button 
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/10 hover:scale-105 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  New
                </button>
                <AnimatePresence>
                  {showUploadMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5"
                    >
                      {uploadOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                            <opt.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white">{opt.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center transition-all duration-300", isSearchExpanded ? "w-48 sm:w-64" : "w-10")}>
                <div className="relative w-full">
                  <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-opacity", !isSearchExpanded && "opacity-0")} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                    placeholder="Filter by name..."
                    className={cn(
                      "w-full bg-white dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      !isSearchExpanded && "hidden"
                    )}
                  />
                  {!isSearchExpanded && (
                    <button 
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-zinc-600 transition-colors"
                    >
                      <Search className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={fetchDatasets}
                className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-600"
                title="Refresh List"
              >
                <RefreshCcw className="w-4 h-4 text-slate-500" />
              </button>
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-zinc-700 ml-2 pl-2">
                  <button onClick={handleBulkDelete} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Bulk Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all" title="Bulk Move">
                    <FolderOpen className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-100 dark:border-zinc-800 w-10">
                    <input 
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedFiles(filteredFiles.map(f => f.id));
                        else setSelectedFiles([]);
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th 
                    onClick={() => requestSort('name')}
                    className="px-6 py-3 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300"
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Status</th>
                  <th 
                    onClick={() => requestSort('size' as any)}
                    className="px-6 py-3 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right border-b border-slate-100 dark:border-zinc-800 cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Size
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right border-b border-slate-100 dark:border-zinc-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                          <FileSearch className="w-8 h-8 text-slate-200 dark:text-zinc-700" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">No files found</p>
                          <p className="text-xs text-slate-400 dark:text-zinc-500">Try adjusting your filters or upload a new dataset.</p>
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-900 dark:bg-indigo-600 text-white text-[10px] px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                          Upload Context
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (viewAll ? filteredFiles : filteredFiles.slice(0, 10)).map((file) => (
                    <tr 
                      key={file.id} 
                      className={cn(
                        "hover:bg-slate-50/80 dark:hover:bg-zinc-800/80 transition-all group",
                        selectedFiles.includes(file.id) && "bg-indigo-50/50 dark:bg-indigo-900/10"
                      )}
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => {
                            setSelectedFiles(prev => prev.includes(file.id) 
                              ? prev.filter(id => id !== file.id) 
                              : [...prev, file.id]
                            );
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-slate-900 dark:text-white",
                            file.name.endsWith('.csv') ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" :
                            file.name.endsWith('.json') ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                            "bg-slate-100 dark:bg-zinc-800"
                          )}>
                            {file.name.endsWith('.csv') ? <FileText className="w-5 h-5" /> : 
                             file.name.endsWith('.json') ? <FileJson className="w-5 h-5" /> : 
                             <LayoutGrid className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase flex items-center gap-2">
                              {new Date(file.createdAt).toLocaleDateString()} • {new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border",
                            file.status === 'Ready' ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" :
                            file.status === 'Processing' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30" :
                            "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {file.status === 'Ready' ? <CheckCircle2 className="w-3 h-3" /> : file.status === 'Processing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                            {file.status}
                          </div>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400 font-mono text-right font-bold whitespace-nowrap">
                        {file.size}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => handleAnalyze(file)}
                                  className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-500 rounded-xl transition-all"
                                >
                                  <BarChart2 className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Run Polars/Pandas Analysis</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <button 
                            onClick={() => downloadFile(file)}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button onClick={() => downloadFile(file)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all" title="Download">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => renameFile(file.id, file.name)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all" title="Rename">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all" title="Move to Folder">
                              <Folder className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setFileToDelete(file.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="relative">
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === file.id ? null : file.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all" 
                              title="More Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                              {activeMenuId === file.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                                >
                                  {[
                                    { label: 'Preview Rows', icon: Eye, action: () => { handleAnalyze(file, 'preview'); setActiveMenuId(null); } },
                                    { label: 'Analyze with AI', icon: Brain, action: () => { handleAnalyze(file); setActiveMenuId(null); } },
                                    { label: 'Copy Link', icon: Copy, action: () => copyFileLink(file.id) },
                                    { label: 'Version History', icon: History, action: () => { setShowVersionHistory(true); setActiveMenuId(null); } },
                                  ].map((action) => (
                                    <button 
                                      key={action.label}
                                      onClick={action.action}
                                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3"
                                    >
                                      <action.icon className="w-3.5 h-3.5" />
                                      {action.label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/50 dark:bg-zinc-800/50 text-center border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Showing {filteredFiles.length > 10 && !viewAll ? 10 : filteredFiles.length} of {filteredFiles.length} files
            </p>
            <button 
              onClick={() => setViewAll(!viewAll)}
              className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 group"
            >
              {viewAll ? "Collapse List" : "View all files"}
              <ChevronRight className={cn("w-3 h-3 group-hover:translate-x-1 transition-transform", viewAll && "rotate-180")} />
            </button>
          </div>
        </section>

        {/* Footer Info Area */}
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 opacity-80">
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-8">
              {[
                { label: 'AES-256 Encrypted', icon: ShieldCheck, tooltip: 'Your data is encrypted at rest using military-grade AES-256.' },
                { label: 'Redundant Storage', icon: GitBranch, tooltip: 'Triple redundancy across multiple regions ensures zero data loss.' },
                { label: '30-Day Versioning', icon: History, tooltip: 'Accidentally deleted? Every version is kept for 30 days.', action: () => setShowVersionHistory(true) }
              ].map((info) => (
                <Tooltip key={info.label}>
                  <TooltipTrigger>
                    <div 
                      onClick={info.action}
                      className={cn(
                        "flex items-center gap-2 text-slate-400 dark:text-zinc-500 transition-colors",
                        info.action && "cursor-pointer hover:text-indigo-500"
                      )}
                    >
                      <info.icon className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">{info.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-[10px] font-bold bg-slate-900 border-none text-white rounded-lg p-3 shadow-xl">
                    <p>{info.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <p className="text-[10px] font-black text-slate-300 dark:text-zinc-800 uppercase tracking-tighter">Powered by Cognitive S3 Engine v4.0</p>
        </div>
      </main>

      {/* Confirmation Dialogs & Modals */}
      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-8">
          <AlertDialogHeader className="space-y-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center text-slate-900 dark:text-white">Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 dark:text-zinc-400 font-medium">
              This action is permanent for today, although retained in the 30-day vault. All associated cognitive indexes will be purged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3 sm:justify-center">
            <AlertDialogCancel className="rounded-xl px-8 font-bold border-slate-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => fileToDelete && deleteDataset(fileToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-8 font-bold border-none"
            >
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Version History Modal Mock */}
      <AnimatePresence>
        {showVersionHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
             >
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                   <h3 className="text-lg font-bold flex items-center gap-3">
                      <History className="w-5 h-5 text-indigo-500" />
                      Global Version History
                   </h3>
                   <button onClick={() => setShowVersionHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                   </button>
                </div>
                <div className="p-8 space-y-6">
                   <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed italic">All cognitive states are snapshotted daily. You are currently on the Enterprise 30-day retention cycle.</p>
                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl group cursor-pointer hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-indigo-500/20">
                           <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                              <Archive className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-bold">Snapshot: April {26 - i}, 2026</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Automatic Daily Backup • 24.5GB Total</p>
                           </div>
                           <button className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">Restore Now</button>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 flex justify-end">
                   <button onClick={() => setShowVersionHistory(false)} className="px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl">Close</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Plan Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800"
             >
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Expand Your Horizons</h3>
                  <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">Scale your data infrastructure with our enterprise-grade cognitive storage plans.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {[
                      { name: 'Pro', price: '$19', storage: '50GB', features: ['AI Pre-processing', 'Priority Support'] },
                      { name: 'Enterprise', price: '$99', storage: 'Unlimited', features: ['Custom Connectors', 'SLA Guarantee'] }
                    ].map(plan => (
                      <div key={plan.name} className="p-6 border border-slate-100 dark:border-zinc-800 rounded-2xl hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-zinc-800/50 text-left">
                        <p className="text-xs font-black uppercase text-indigo-500 mb-1">{plan.name}</p>
                        <p className="text-2xl font-bold mb-4">{plan.price}<span className="text-xs text-slate-400">/mo</span></p>
                        <div className="space-y-2">
                          <p className="text-sm font-bold">{plan.storage} Storage</p>
                          {plan.features.map(f => <p key={f} className="text-xs text-slate-500">• {f}</p>)}
                        </div>
                        <button className="w-full mt-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl">Selected Plan</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowUpgradeModal(false)} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white pt-4">Maybe Later</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Data Cleaning Panel / Sidebar Drawer */}
      <AnimatePresence>
        {showCleaningPanel && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCleaningPanel(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 z-[70] shadow-2xl p-8 flex flex-col border-l border-slate-200 dark:border-zinc-800"
            >
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                   <Brain className="w-6 h-6 text-indigo-500" />
                   Data Cleaning Agent
                 </h3>
                 <button onClick={() => setShowCleaningPanel(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="flex-1 space-y-6 overflow-y-auto">
                 <div className="p-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700">
                    <p className="text-sm font-bold mb-2">Automated Optimization</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">Our agent uses heuristic analysis to detect anomalies, missing values, and inconsistent formatting before your data hits the processing pipeline.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Capabilities</p>
                    {[
                      { title: 'Deduplication', desc: 'Removes identical or near-identical records.' },
                      { title: 'Schema Normalization', desc: 'Syncs headers across messy CSV files.' },
                      { title: 'Type Correction', desc: 'Auto-casts strings to numbers and dates.' }
                    ].map(cap => (
                      <div key={cap.title} className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-sm font-bold">{cap.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-500">{cap.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
               
               <button className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all">
                 Launch Cleaning Agent
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <DataAnalysisModal 
        isOpen={isAnalysisModalOpen} 
        onClose={() => setIsAnalysisModalOpen(false)} 
        dataset={analysisDataset} 
        initialTab={analysisInitialTab}
      />
    </div>
  );
};
