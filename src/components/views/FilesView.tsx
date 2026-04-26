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
  FileCode
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  schema: any[];
  preview: any[];
  createdAt: string;
}

export const FilesView = () => {
  const { getToken, user } = useAuth();
  const [datasets, setDatasets] = React.useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('/api/datasets');
      const data = await res.json();
      setDatasets(data);
    } catch (error) {
      console.error("Failed to fetch datasets", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDatasets();
  }, []);

  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setIsUploading(true);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98;
        }
        return prev + 2;
      });
    }, 150);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = await getToken();
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus('success');

      const newDataset = await res.json();
      setDatasets(prev => [newDataset, ...prev]);
      
      // Log to history
      if (user) {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('/api/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: `Uploaded dataset: ${file.name}`,
            datasetId: newDataset.id,
            datasetName: file.name,
            result: `Processed ${newDataset.rows} rows.`
          })
        });
      }

      toast.success(`${file.name} uploaded successfully`, {
        description: `Processed ${newDataset.rows} rows and ${newDataset.columns} columns.`
      });
      
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      clearInterval(interval);
      setUploadStatus('error');
      toast.error("Failed to upload file");
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      setDatasets(prev => prev.filter(d => d.id !== id));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const formatSize = (rows: number) => {
    const kb = rows * 0.5; // Mock calculation
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Files Management</h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Manage your datasets, model outputs, and cognitive assets.</p>
      </div>

      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.xls"
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Storage Stats */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Storage Usage</h3>
              <span className="text-slate-900 dark:text-white font-bold text-xs">{datasets.length > 0 ? '12%' : '0%'}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-slate-900 dark:bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                style={{ width: datasets.length > 0 ? '12%' : '0%' }}
              ></div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Datasets', count: datasets.length, size: formatSize(datasets.reduce((acc, curr) => acc + curr.rows, 0)), color: 'bg-slate-900 dark:bg-indigo-500' },
                { name: 'Model Weights', count: 0, size: '0 GB', color: 'bg-slate-400 dark:bg-zinc-600' },
                { name: 'Logs', count: 0, size: '0.4 MB', color: 'bg-slate-200 dark:bg-zinc-700' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                    <span className="text-sm text-slate-600 dark:text-zinc-400 font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 font-mono">{item.size}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              Upgrade Storage
            </button>
          </section>

          <section className="bg-slate-900 dark:bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <Rocket className="w-8 h-8 mb-4 opacity-80 group-hover:translate-y-[-4px] transition-transform" />
              <h3 className="text-lg font-bold mb-2">Optimize for AI</h3>
              <p className="text-xs text-slate-400 dark:text-indigo-100 font-medium leading-relaxed mb-4">Cleaned CSV files process 3x faster. Use our data cleaning agent before uploading massive datasets.</p>
              <button className="text-white font-bold text-xs underline underline-offset-4 flex items-center gap-1 group/btn">
                Learn more
                <Plus className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Rocket className="w-32 h-32" />
            </div>
          </section>
        </div>

        {/* Right Column: Upload Zone & File List */}
        <div className="md:col-span-12 lg:col-span-8 space-y-6">
          <section 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "bg-white dark:bg-zinc-900 p-8 sm:p-12 lg:p-16 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all relative overflow-hidden",
              uploadStatus === 'idle' && "border-slate-200 dark:border-zinc-800 hover:border-slate-900 dark:hover:border-white",
              uploadStatus === 'uploading' && "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5",
              uploadStatus === 'success' && "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5",
              uploadStatus === 'error' && "border-red-500 bg-red-50/10 dark:bg-red-500/5",
              isUploading && "pointer-events-none"
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
              {uploadStatus === 'uploading' ? `Processing Pipeline (${uploadProgress}%)` : 
               uploadStatus === 'success' ? "File Synced" :
               uploadStatus === 'error' ? "Upload Failed" :
               "Upload Files"}
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

            {uploadStatus === 'uploading' && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                />
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { type: 'CSV', icon: FileText },
                { type: 'JSON', icon: GitBranch },
                { type: 'SQL', icon: Database },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-700">
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 tracking-wider font-mono">{item.type}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recently Uploaded</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-600">
                  <Search className="w-4 h-4 text-slate-500" />
                </button>
                <button 
                  onClick={fetchDatasets}
                  className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-600"
                >
                  <RefreshCcw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50/50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right border-b border-slate-100 dark:border-zinc-800">Size</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right border-b border-slate-100 dark:border-zinc-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                  {datasets.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-xs">No datasets uploaded yet</td>
                    </tr>
                  ) : datasets.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white")}>
                            <LayoutGrid className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{file.name}</div>
                            <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-tighter">
                              {new Date(file.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30"
                        )}>
                          <CheckCircle2 className="w-3 h-3" />
                          Analyzed
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400 font-mono text-right font-bold">{file.rows} rows</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => deleteDataset(file.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-white dark:hover:bg-zinc-700 shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-zinc-600"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-white dark:hover:bg-zinc-700 shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-zinc-600">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-zinc-800/50 text-center border-t border-slate-100 dark:border-zinc-800">
              <button className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest hover:underline">View all files</button>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Info Area */}
      <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 py-8 border-t border-slate-200 dark:border-zinc-800">
        {[
          { label: 'AES-256 Encrypted', icon: Lock },
          { label: 'Redundant Storage', icon: GitBranch },
          { label: '30-Day Versioning', icon: History }
        ].map((info) => (
          <div key={info.label} className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
            <info.icon className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">{info.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
