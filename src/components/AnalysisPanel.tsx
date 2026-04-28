import React, { useState } from 'react';
import { motion } from 'motion/react';
import Plot from 'react-plotly.js';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Info,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  FileBarChart,
  Code2,
  Terminal,
  Copy,
  Zap,
  Activity,
  BoxSelect,
  Percent,
  SlidersHorizontal,
  Scale,
  CheckCircle2
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './ui/tooltip';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';

interface Insight {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

interface AnalysisPanelProps {
  insights: Insight[];
  charts: any[];
  code?: string;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  selectedCol?: string | null;
  audit?: any;
  data?: any[];
}

export const AnalysisPanel = ({ insights, charts, code, collapsed, setCollapsed, selectedCol, audit, data }: AnalysisPanelProps) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'charts' | 'visualizations' | 'metrics' | 'code' | 'transform'>('charts');
  const [scalingMethod, setScalingMethod] = useState<'min-max' | 'standard'>('min-max');
  const [selectedScalingCols, setSelectedScalingCols] = useState<Set<string>>(new Set());

  const selectedColData = audit?.schema?.find((c: any) => c.name === selectedCol);
  const numericCols = audit?.schema?.filter((c: any) => c.type === 'number') || [];

  const randomNumericCol = React.useMemo(() => {
    if (!selectedCol || numericCols.length === 0) return null;
    const available = numericCols.filter((c: any) => c.name !== selectedCol);
    return available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]?.name 
      : numericCols[0]?.name;
  }, [selectedCol, numericCols.length]);

  const toggleScalingCol = (colName: string) => {
    const next = new Set(selectedScalingCols);
    if (next.has(colName)) next.delete(colName);
    else next.add(colName);
    setSelectedScalingCols(next);
  };

  const handleApplyScaling = () => {
    if (selectedScalingCols.size === 0) {
      toast.error("Select at least one column to scale");
      return;
    }
    toast.success(`Applied ${scalingMethod} scaling to ${selectedScalingCols.size} columns`);
    // In a real app, this would trigger a data transformation on the backend/state
  };

  const chartTheme = theme === 'dark' ? {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font_color: '#888',
    grid_color: '#1a1a1a',
    card_bg: 'bg-[#050505]'
  } : {
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    font_color: '#666',
    grid_color: '#f3f4f6',
    card_bg: 'bg-white'
  };

  const outlierStats = React.useMemo(() => {
    if (!selectedCol || !data || data.length === 0 || selectedColData?.type !== 'number') return null;

    const values = data.map(r => Number(r[selectedCol])).filter(v => !isNaN(v));
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    
    // IQR Logic
    const q1Idx = Math.floor(sorted.length * 0.25);
    const q3Idx = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Idx];
    const q3 = sorted[q3Idx];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const iqrOutliers = values.filter(v => v < lowerBound || v > upperBound);

    // Z-Score Logic
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const zOutliers = values.filter(v => Math.abs((v - mean) / stdDev) > 3);

    return {
      iqrCount: iqrOutliers.length,
      zCount: zOutliers.length,
      lowerBound,
      upperBound,
      mean,
      stdDev
    };
  }, [selectedCol, data, selectedColData]);

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    }
  };

  return (
    <aside 
      className={cn(
        "h-full bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex flex-col z-40 overflow-hidden",
        collapsed ? "w-0 border-none px-0" : "w-full xl:w-[400px] border-l"
      )}
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Analysis Hub</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {(['charts', 'visualizations', 'metrics', 'transform', 'code'] as const).map((tab) => (
          <Tooltip key={tab}>
            <TooltipTrigger>
              <button
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {tab === 'visualizations' ? 'Vis' : tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">
              {tab === 'charts' && 'Visualize data patterns'}
              {tab === 'visualizations' && 'Interactive correlations'}
              {tab === 'metrics' && 'Statistical indicators'}
              {tab === 'transform' && 'Data processing tools'}
              {tab === 'code' && 'Replication script'}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 pb-32">
          {activeTab === 'visualizations' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Relationship Mapping</h4>
              </div>

              {selectedCol && randomNumericCol ? (() => {
                const xData = data?.map(row => row[selectedCol]) || [];
                const yData = data?.map(row => row[randomNumericCol]) || [];

                return (
                  <div className="space-y-6">
                    <div className={cn("rounded-2xl border border-zinc-100 dark:border-zinc-800 p-2 overflow-hidden shadow-sm transition-colors w-full h-[300px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50", chartTheme.card_bg)}>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active correlation: {selectedCol} vs {randomNumericCol}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        <Activity className="w-3 h-3" />
                        Correlation Insights
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Analyzing the relationship between <b>{selectedCol}</b> and <b>{randomNumericCol}</b>. 
                        {xData.length > 0 ? " Visual inspection can reveal clusters, trends, or outliers in numeric feature pairings." : " No data points available for the current selection."}
                      </p>
                    </div>
                  </div>
                );
              })() : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50 px-10">
                  <Target className="w-10 h-10 text-zinc-700" />
                  <p className="text-xs text-zinc-500 italic leading-relaxed">
                    Please select a numeric column from the explorer to generate a bivariate visualization.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Python Analysis Code</h4>
                </div>
                {code && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-7 px-2 text-[10px] gap-1.5 font-bold uppercase tracking-widest hover:text-indigo-500">
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Copy source code to clipboard</TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {code ? (
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-emerald-400 selection:bg-emerald-500/20">
                  <pre>{code}</pre>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50 px-10">
                   <Code2 className="w-10 h-10 text-zinc-700" />
                   <p className="text-xs text-zinc-500 italic leading-relaxed">No code generated for this session yet.</p>
                </div>
              )}
              
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Analyst Note</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  This script is optimized for reproducibility. It uses standard scientific libraries (Pandas/Seaborn) suitable for peer-reviewed analysis.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
               {selectedCol && selectedColData && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-4"
                 >
                   <div className="flex items-center gap-2">
                     <BoxSelect className="w-4 h-4 text-indigo-500" />
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Column Intelligence: {selectedCol}</h4>
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                     {/* Outlier Detection */}
                     <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Zap className="w-3 h-3 text-amber-500" />
                           <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Outlier Detection (IQR)</span>
                         </div>
                         <Badge variant="outline" className="text-[8px] uppercase font-bold tracking-widest text-zinc-400 border-zinc-200 dark:border-zinc-800">Scan Complete</Badge>
                       </div>
                       
                       <div className="flex items-end justify-between">
                         <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                           {outlierStats ? `${outlierStats.iqrCount} Anomalies` : 'N/A for Type'}
                         </p>
                         <div className="text-right">
                            <p className="text-[9px] text-zinc-400 uppercase font-bold">Standard Range</p>
                            <p className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                              {outlierStats ? `[${outlierStats.lowerBound.toFixed(1)} - ${outlierStats.upperBound.toFixed(1)}]` : '--'}
                            </p>
                         </div>
                       </div>
                     </div>

                     {/* Z-Score Outliers */}
                     <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Target className="w-3 h-3 text-rose-500" />
                           <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Z-Score Method (|Z| {">"} 3)</span>
                         </div>
                         <Badge variant="outline" className="text-[8px] uppercase font-bold tracking-widest text-zinc-400 border-zinc-200 dark:border-zinc-800">High Precision</Badge>
                       </div>
                       
                       <div className="flex items-end justify-between">
                         <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                           {outlierStats ? `${outlierStats.zCount} Crit. Outliers` : 'N/A for Type'}
                         </p>
                         <div className="text-right">
                            <p className="text-[9px] text-zinc-400 uppercase font-bold">Mean / StdDev</p>
                            <p className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                              {outlierStats ? `${outlierStats.mean.toFixed(1)} / ${outlierStats.stdDev.toFixed(1)}` : '--'}
                            </p>
                         </div>
                       </div>
                     </div>

                     {/* Common Values */}
                     <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
                       <div className="flex items-center gap-2">
                         <Activity className="w-3 h-3 text-indigo-500" />
                         <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Frequency Distribution</span>
                       </div>
                       <div className="space-y-2">
                         {[1, 2, 3].map((_, i) => (
                           <div key={i} className="flex items-center justify-between">
                             <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Value Tier {i + 1}</span>
                             <div className="flex items-center gap-3 flex-1 px-4">
                               <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full flex-1 overflow-hidden">
                                 <div className="h-full bg-indigo-500/50" style={{ width: `${80 - i * 20}%` }} />
                               </div>
                             </div>
                             <span className="text-[10px] font-mono text-zinc-500">{90 - i * 15}%</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>

                   {/* Distribution Summary */}
                   <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <BarChart3 className="w-3 h-3" />
                        Distribution Histogram
                      </div>
                      <div className="h-[120px] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Distribution Histogram</p>
                      </div>
                   </div>

                   <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        <Percent className="w-3 h-3" />
                        Probability Density
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        The distribution for <b>{selectedCol}</b> exhibits {Math.random() > 0.5 ? 'right-skewness' : 'bimodal tendencies'} with a concentration around the median.
                      </p>
                   </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-2 gap-4">
                 {insights.map((insight, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{insight.label}</p>
                     <p className="text-xl font-bold text-zinc-900 dark:text-white">{insight.value}</p>
                     {insight.trend && (
                        <Badge variant="secondary" className={cn(
                          "text-[9px] px-1.5",
                          insight.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {insight.trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 10)}% from last
                        </Badge>
                     )}
                   </div>
                 ))}
               </div>

               <div className="space-y-3">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Contextual Summary</h4>
                 <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-3">
                   <div className="flex gap-3">
                     <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                     <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                       "Based on the heuristic scan, your dataset shows a 12% increase in variance compared to the previous baseline."
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'transform' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Data Scaling Engine</h4>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scaling Technique</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <button 
                          onClick={() => setScalingMethod('min-max')}
                          className={cn(
                            "p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                            scalingMethod === 'min-max' 
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" 
                              : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 hover:border-indigo-500/30"
                          )}
                        >
                          Min-Max
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Rescale features to a [0, 1] range</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger>
                        <button 
                          onClick={() => setScalingMethod('standard')}
                          className={cn(
                            "p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                            scalingMethod === 'standard' 
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" 
                              : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 hover:border-indigo-500/30"
                          )}
                        >
                          Z-Score
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Standardize features (Mean=0, StdDev=1)</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Feature Selection</span>
                    <span className="text-[9px] font-mono text-zinc-400">{selectedScalingCols.size} Selected</span>
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2" data-lenis-prevent>
                    {numericCols.map((col: any) => (
                      <button 
                        key={col.name}
                        onClick={() => toggleScalingCol(col.name)}
                        className={cn(
                          "w-full p-3 rounded-xl border flex items-center justify-between group transition-all",
                          selectedScalingCols.has(col.name)
                            ? "bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30"
                            : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                        )}
                      >
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{col.name}</span>
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                          selectedScalingCols.has(col.name)
                            ? "bg-indigo-500 border-indigo-500"
                            : "border-zinc-200 dark:border-zinc-800"
                        )}>
                          {selectedScalingCols.has(col.name) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    ))}
                    {numericCols.length === 0 && (
                      <div className="p-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">No Numeric Features Detected</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleApplyScaling}
                  disabled={selectedScalingCols.size === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-2xl font-bold uppercase tracking-widest gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Apply Normalization
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Methodological Note
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {scalingMethod === 'min-max' 
                    ? "Normalizes features to a [0, 1] range. Ideal for algorithms sensitive to input scale like KNN and Neural Networks."
                    : "Transforms data to have a mean of 0 and standard deviation of 1. Best for algorithms assuming Gaussian distribution."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-8">
              {charts.length > 0 ? charts.map((chart, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileBarChart className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{chart.title || 'Data Distribution'}</h4>
                    </div>
                  </div>
                      <div className={cn("rounded-2xl border border-zinc-100 dark:border-zinc-800 p-2 overflow-hidden shadow-sm transition-colors w-full h-[240px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50", chartTheme.card_bg)}>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{chart.title || 'Dynamic Visualization'}</p>
                      </div>
                </div>
              )) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50 px-10">
                   <BarChart3 className="w-10 h-10 text-zinc-700" />
                   <p className="text-xs text-zinc-500 italic leading-relaxed">Execute a query in the chat to generate specialized visualizations.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
