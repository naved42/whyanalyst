import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  Database, 
  RefreshCw, 
  Plus, 
  ChevronRight, 
  Headset, 
  Search,
  HardDrive,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export const ConnectDataView = () => {
  const { getToken, user } = useAuth();
  const [connectingSource, setConnectingSource] = React.useState<string | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleConnect = (name: string) => {
    setConnectingSource(name);
  };

  const finalizeConnection = async () => {
    setIsSyncing(true);
    try {
      const token = await getToken();
      
      // Log to history
      if (user) {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('/api/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: `Connected data source: ${connectingSource}`,
            datasetId: 'external-integration',
            datasetName: connectingSource || 'Unknown Source',
            result: 'Connection established and verified.'
          })
        });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSyncing(false);
      setConnectingSource(null);
      toast.success(`${connectingSource} connected successfully`, {
        description: "Your data is now being indexed for AI analysis."
      });
    } catch (error) {
      toast.error("Failed to connect source");
      setIsSyncing(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Hero Header */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Connect Your Data</h2>
        <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">Integrate your cloud infrastructure and external datasets to fuel your AI models with real-time insights.</p>
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Featured Integration: AWS S3 */}
        <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5 -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700">
             <Cloud className="w-full h-full text-slate-900 dark:text-white" />
          </div>
          <div className="z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-inner">
                <HardDrive className="w-8 h-8 text-slate-600 dark:text-zinc-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Amazon S3 Hub</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">CONNECTED & SECURE</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md font-medium leading-relaxed">Scalable object storage for raw data lakes, documents, and multimedia assets. Syncing 14.2 TB across regions.</p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-6 border-t border-slate-50 dark:border-zinc-800">
            <div className="flex -space-x-3">
              {['PDF', 'CSV', 'JSON', 'SQL'].map((type) => (
                <div key={type} className="w-10 h-10 rounded-xl border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-zinc-400 shadow-sm">{type}</div>
              ))}
            </div>
            <button className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 uppercase tracking-widest">Manage Settings</button>
          </div>
        </div>

        {/* Active Status Summary */}
        <div className="md:col-span-12 lg:col-span-4 bg-slate-900 dark:bg-zinc-950 text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group border border-slate-800 dark:border-zinc-800">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <RefreshCw className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-2">Cloud Connectivity</h3>
            <p className="text-sm text-slate-400 dark:text-zinc-500 font-medium leading-relaxed">Pipelines operating within 120ms latency parameters.</p>
          </div>
          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-end text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600">
              <span>Throughput</span>
              <span className="text-white">88% Capacity</span>
            </div>
            <div className="w-full bg-white/10 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-white dark:bg-indigo-500 h-full w-[88%] shadow-[0_0_10px_rgba(255,255,255,0.4)]"></div>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-600">Last sync verified 4 minutes ago</p>
          </div>
        </div>

        {/* Google Drive Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6 flex flex-col hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-100 dark:border-zinc-700">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[9px] font-black px-2 py-1 rounded-lg tracking-widest border border-slate-100 dark:border-zinc-700 uppercase">Available</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Google Drive</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 flex-grow font-medium leading-relaxed">Import documents and spreadsheets directly from shared team drives.</p>
          <button 
            onClick={() => handleConnect('Google Drive')}
            className="mt-8 w-full border-2 border-slate-900 dark:border-indigo-600 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white uppercase tracking-widest"
          >
            Connect Hub
          </button>
        </div>

        {/* Snowflake Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6 flex flex-col hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-100 dark:border-zinc-700">
               <Database className="w-6 h-6" />
            </div>
            <span className="bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[9px] font-black px-2 py-1 rounded-lg tracking-widest border border-slate-100 dark:border-zinc-700 uppercase">Premium</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Snowflake</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 flex-grow font-medium leading-relaxed">Query enterprise warehouse data through secure SQL tunneling.</p>
          <button 
            onClick={() => handleConnect('Snowflake')}
            className="mt-8 w-full border-2 border-slate-900 dark:border-indigo-600 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white uppercase tracking-widest"
          >
            Link Source
          </button>
        </div>

        {/* Custom API Integration */}
        <div className="md:col-span-12 lg:col-span-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6 flex flex-col shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Rest API</h4>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 flex-grow font-medium leading-relaxed">Set up custom webhooks or poll external endpoints for structured data ingestion.</p>
          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">DOCS</button>
            <button 
              onClick={() => handleConnect('Rest API')}
              className="bg-slate-900 dark:bg-indigo-600 text-white p-2.5 rounded-xl transition-all hover:bg-black dark:hover:bg-indigo-700 shadow-lg shadow-black/10"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Sources Section Header */}
        <div className="col-span-12 mt-12 mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">External Connectors</h3>
            <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full"></div>
          </div>
        </div>

        {/* Row of smaller connectors */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Dropbox', detail: 'Cloud Storage' },
            { name: 'BigQuery', detail: 'Data Warehouse' },
            { name: 'PostgreSQL', detail: 'Database' },
            { name: 'Azure Blob', detail: 'Object Storage' },
          ].map((source) => (
            <div 
              key={source.name} 
              onClick={() => handleConnect(source.name)}
              className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white tracking-tight">{source.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">{source.detail}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Modal Overlay */}
      <AnimatePresence>
        {connectingSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSyncing && setConnectingSource(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-8 sm:p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                    <Database className="w-8 h-8" />
                  </div>
                  {!isSyncing && (
                    <button onClick={() => setConnectingSource(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Connect to {connectingSource}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">Enter your credentials to establish a secure link to your enterprise data source.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Endpoint URL</label>
                    <input 
                      type="text" 
                      placeholder="https://db-cluster-0.aws.com" 
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Client ID</label>
                      <input 
                        type="text" 
                        placeholder="cognite_ai_74" 
                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Region</label>
                      <input 
                        type="text" 
                        placeholder="us-east-1" 
                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSyncing}
                  onClick={finalizeConnection}
                  className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-xl active:scale-[0.98]"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Authenticating Node...
                    </>
                  ) : (
                    <>
                      Verify and Link
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Help Section */}
      <div className="mt-20 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="items-center gap-8 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center shadow-xl text-white shrink-0 group hover:rotate-6 transition-transform">
              <Headset className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Can't find your data source?</h4>
              <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-xl font-medium leading-relaxed">Our infrastructure team builds custom high-performance connectors for proprietary legacy systems. Deployment ready in 48 hours.</p>
            </div>
          </div>
        </div>
        <button className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 active:scale-95 uppercase tracking-widest">Request Custom Node</button>
      </div>
    </div>
  );
};
