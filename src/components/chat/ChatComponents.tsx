import React from 'react';
import Plot from 'react-plotly.js';
import { Download, Copy, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChartProps {
  data: any;
  layout: any;
  title?: string;
}

export const ChatPlotly = ({ data, layout, title }: ChartProps) => {
  const downloadChart = () => {
    toast.success("Downloading chart as PNG...");
    // Logic for actual download usually involves Plotly.downloadImage
  };

  return (
    <div className="my-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 group relative">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">{title || 'Data Visualization'}</h4>
        <button 
          onClick={downloadChart}
          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
        <Plot
          data={data}
          layout={{
            ...layout,
            autosize: true,
            margin: { t: 30, r: 20, b: 40, l: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Inter, sans-serif', size: 10, color: '#64748b' }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '300px' }}
          config={{ displayModeBar: false }}
        />
      </div>
    </div>
  );
};

export const ChatTable = ({ data }: { data: any[] }) => {
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);
  
  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="my-4 space-y-2">
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Filter table..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[10px] bg-slate-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-1 focus:ring-1 focus:ring-indigo-500/20 outline-none w-32"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <table className="w-full text-[10px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/50">
              {headers.map(h => (
                <th 
                  key={h} 
                  onClick={() => requestSort(h)}
                  className="px-4 py-2 font-black uppercase text-slate-500 dark:text-zinc-500 tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  {h}
                  {sortConfig?.key === h && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 10).map((row, i) => (
              <tr key={i} className="border-t border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/20">
                {headers.map(h => (
                  <td key={h} className="px-4 py-2 font-medium text-slate-700 dark:text-zinc-300">
                    {String(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedData.length > 10 && (
          <div className="p-2 text-center border-t border-slate-50 dark:border-zinc-800/50">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">+ {sortedData.length - 10} more rows</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatCode = ({ code, language }: { code: string; language: string }) => {
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [output, setOutput] = React.useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const runCode = () => {
    setIsExecuting(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("Success: Analysis complete. Results integrated into session state.");
      setIsExecuting(false);
      toast.success("Code executed successfully");
    }, 1500);
  };

  return (
    <div className="my-4 group relative">
      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">{language}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={copyCode} className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Copy Code">
              <Copy className="w-3.5 h-3.5" />
            </button>
            {language === 'python' && (
              <button onClick={runCode} className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors" title="Run Python Code">
                <Play className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
        {output && (
          <div className="border-t border-slate-800 p-3 bg-black/30">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Execution Output</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400/80 pl-5">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
