import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Table as TableIcon, 
  Presentation, 
  LayoutDashboard, 
  Target, 
  FileText, 
  CloudUpload, 
  Sparkles, 
  BarChart, 
  Cable, 
  Construction, 
  Headset, 
  Brain, 
  ArrowUp,
  User,
  Bot,
  RefreshCw,
  Trash2,
  Share2,
  Paperclip,
  FilePlus,
  Loader2,
  Mic,
  ChevronRight,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Pin,
  Play,
  History,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Database,
  Terminal
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { generateStreamResponse } from '@/src/services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { ChatPlotly, ChatTable, ChatCode } from '../chat/ChatComponents';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  feedback?: 'up' | 'down';
  reasoning?: string;
  suggestedFollowUps?: string[];
  tokensDeducted?: number;
}

interface HomeViewProps {
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export const HomeView = ({ initialPrompt, onClearPrompt }: HomeViewProps) => {
  const { getToken, user } = useAuth();
  const [input, setInput] = React.useState(initialPrompt || '');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdvancedReasoning, setIsAdvancedReasoning] = React.useState(false);
  const [tokens, setTokens] = React.useState(20); // Starting with 20 tokens
  const [isUploading, setIsUploading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [history, setHistory] = React.useState<any[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showUploadMenu, setShowUploadMenu] = React.useState(false);
  const uploadMenuRef = React.useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = React.useState<'connectors' | 'tools' | 'agents' | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    "Clean and transform my dataset",
    "Generate a sales dashboard",
    "Analyze stock trends",
    "Summarize this CSV",
    "Write a SQL query for my database",
    "Build a KPI tracker"
  ];

  const quickActions = [
    { label: 'Stock Analysis', icon: TrendingUp, color: 'text-amber-500', prompt: 'Perform a full stock analysis on the latest market trends for ' },
    { label: 'Excel', icon: TableIcon, color: 'text-green-500', prompt: 'Clean and transform the most recent dataset for optimized analysis. ' },
    { label: 'Slides', icon: Presentation, color: 'text-orange-500', prompt: 'Generate a presentation outline for the data trends observed. ' },
    { label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', prompt: 'Create a high-level KPI dashboard from my data sources. ' },
    { label: 'Tracker', icon: Target, color: 'text-purple-500', prompt: 'Build a project tracker with status updates for ' },
    { label: 'Report', icon: FileText, color: 'text-red-500', prompt: 'Compose a professional report summarizing key findings from ' },
  ];

  React.useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      handleSubmit(undefined, initialPrompt);
      onClearPrompt?.();
    }
  }, [initialPrompt]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % suggestedPrompts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [suggestedPrompts.length]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target as Node)) {
        setShowUploadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Auto submit if needed:
    handleSubmit(undefined, prompt);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Voice recording stopped and processed.");
    } else {
      setIsRecording(true);
      toast.info("Voice input active... (Simulated)");
      // Mock voice to text
      setTimeout(() => {
        setIsRecording(false);
        setInput(prev => prev + " Summarize the latest reports.");
      }, 3000);
    }
  };

  const handleToolClick = (tool: 'connectors' | 'tools' | 'agents') => {
    setActivePanel(activePanel === tool ? null : tool);
  };

  const handleAgentSelect = (agent: string) => {
    setInput(`[AGENT: ${agent}] ` + input);
    setActivePanel(null);
    toast.success(`Agent ${agent} activated`, {
      description: "Ask your question to start the workflow."
    });
  };

  const renderPanel = (type: 'connectors' | 'tools' | 'agents') => {
    const items = {
      connectors: [
        { name: 'Google Drive', icon: CloudUpload, color: 'text-blue-500' },
        { name: 'PostgreSQL', icon: Database, color: 'text-indigo-500' },
        { name: 'Snowflake', icon: Sparkles, color: 'text-sky-500' },
        { name: 'BigQuery', icon: LayoutDashboard, color: 'text-orange-600' },
        { name: 'AWS S3', icon: CloudUpload, color: 'text-amber-500' },
        { name: 'MongoDB', icon: Database, color: 'text-green-500' },
        { name: 'Redis', icon: Database, color: 'text-red-500' },
        { name: 'Salesforce', icon: Target, color: 'text-blue-600' },
        { name: 'HubSpot', icon: Target, color: 'text-orange-500' },
        { name: 'Stripe', icon: Cable, color: 'text-purple-500' },
        { name: 'Shopify', icon: Cable, color: 'text-green-600' },
        { name: 'Zendesk', icon: Headset, color: 'text-blue-400' }
      ],
      tools: [
        { name: 'Python Interpreter', icon: Terminal, color: 'text-yellow-500' },
        { name: 'SQL Runner', icon: Database, color: 'text-slate-500' },
        { name: 'Web Explorer', icon: Search, color: 'text-blue-400' },
        { name: 'Plotly Generator', icon: BarChart, color: 'text-pink-500' },
        { name: 'Grok AI', icon: Brain, color: 'text-purple-400' },
        { name: 'Prophet Forecast', icon: TrendingUp, color: 'text-indigo-500' },
        { name: 'Scikit-learn', icon: Construction, color: 'text-sky-500' },
        { name: 'Pandas Profiler', icon: TableIcon, color: 'text-teal-500' },
        { name: 'Claude Optimizer', icon: Sparkles, color: 'text-orange-400' },
        { name: 'GPT-4 Analyst', icon: Bot, color: 'text-green-500' },
        { name: 'DeepSeek Coder', icon: Construction, color: 'text-blue-700' }
      ],
      agents: [
        { name: 'Data Cleaner', icon: Construction, color: 'text-orange-500' },
        { name: 'ML Builder', icon: Bot, color: 'text-indigo-600' },
        { name: 'Report Generator', icon: FileText, color: 'text-red-500' },
        { name: 'KPI Tracker', icon: Target, color: 'text-emerald-500' }
      ]
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: -8, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
      >
        <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800 mb-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</p>
        </div>
        {items[type].map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (type === 'agents') handleAgentSelect(item.name);
              else {
                toast.success(`${item.name} connected to session context.`);
                setActivePanel(null);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-left"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-slate-50 dark:bg-zinc-800 flex items-center justify-center", item.color.replace('text-', 'bg-').replace('500', '50/50'))}>
              <item.icon className={cn("w-4 h-4", item.color)} />
            </div>
            {item.name}
          </button>
        ))}
      </motion.div>
    );
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload success
    setTimeout(() => {
      setIsUploading(false);
      const userMsg: ChatMessage = { 
        id: Date.now().toString(),
        role: 'user', 
        content: `Attached file: **${file.name}**\n\nAnalyze this dataset please.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      toast.success(`${file.name} attached to context.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  const handleSubmit = async (e?: React.FormEvent, directInput?: string) => {
    e?.preventDefault();
    const finalInput = directInput || input;
    if (!finalInput.trim() || isLoading) return;

    if (tokens <= 0) {
      toast.error("You've run out of tokens!", {
        description: "Upgrade your plan for unlimited data analysis."
      });
      return;
    }

    const query = finalInput;
    const userMessage: ChatMessage = { 
      id: Date.now().toString(),
      role: 'user', 
      content: query,
      timestamp: new Date()
    };
    
    let newMessages: ChatMessage[];
    if (editingMessageId) {
      const idx = messages.findIndex(m => m.id === editingMessageId);
      newMessages = [...messages.slice(0, idx), userMessage];
      setEditingMessageId(null);
    } else {
      newMessages = [...messages, userMessage];
    }

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { 
        id: assistantId,
        role: 'assistant', 
        content: '', 
        timestamp: new Date(),
        reasoning: isAdvancedReasoning ? "⚙ Establishing data pathways...\n⚙ Mapping correlations..." : undefined
      }]);

      await generateStreamResponse(newMessages.map(m => ({ role: m.role, content: m.content })) as any, (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const next = [...prev];
          const assistantMsgIdx = next.findIndex(m => m.id === assistantId);
          if (assistantMsgIdx !== -1) {
            next[assistantMsgIdx] = { ...next[assistantMsgIdx], content: assistantContent };
          }
          return next;
        });
      });

      // Token deduction (1 token per analysis)
      setTokens(prev => Math.max(0, prev - 1));

      // After successful response, maybe suggest follow-ups (Mocked)
      setTimeout(() => {
        setMessages(prev => {
          const next = [...prev];
          const assistIdx = next.findIndex(m => m.id === assistantId);
          if (assistIdx !== -1) {
            next[assistIdx] = { 
              ...next[assistIdx], 
              suggestedFollowUps: ["Show me the raw data", "Pivot by month", "Export this as PDF"]
            };
          }
          return next;
        });
      }, 500);

      // Save to history
      try {
        const token = await getToken();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        await fetch('/api/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: query,
            datasetId: 'default',
            datasetName: 'Chat Interaction',
            result: assistantContent
          })
        });
      } catch (err) {
        console.error("Failed to save history:", err);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to generate response");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePin = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: type } : m));
    toast.success("Thanks for your feedback!");
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setMessages([]);
      setInput('');
      toast.info("Conversation cleared.");
    }
  };

  const renderContent = (content: string) => {
    // Basic logic to detect if we should render a Chart or Table
    // In a real app, the AI would output JSON blocks or special markers.
    // We'll mock detection for "scatter chart", "bar chart", "table"
    
    if (content.includes("```json-chart")) {
      try {
        const parts = content.split("```json-chart");
        const jsonPart = parts[1].split("```")[0];
        const chartData = JSON.parse(jsonPart);
        return (
          <>
            <ReactMarkdown>{parts[0]}</ReactMarkdown>
            <ChatPlotly {...chartData} />
            <ReactMarkdown>{parts[1].split("```")[1]}</ReactMarkdown>
          </>
        );
      } catch (e) { /* ignore */ }
    }

    if (content.includes("```table")) {
       try {
        const parts = content.split("```table");
        const jsonPart = parts[1].split("```")[0];
        const tableData = JSON.parse(jsonPart);
        return (
          <>
            <ReactMarkdown>{parts[0]}</ReactMarkdown>
            <ChatTable data={tableData} />
            <ReactMarkdown>{parts[1].split("```")[1]}</ReactMarkdown>
          </>
        );
      } catch (e) { /* ignore */ }
    }

    return (
      <div className="markdown-body">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <ChatCode code={String(children).replace(/\n$/, '')} language={match[1]} />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const uploadOptions = [
    { label: 'CSV File', icon: TableIcon, accept: '.csv' },
    { label: 'Excel Spreadsheet', icon: FilePlus, accept: '.xlsx,.xls' },
    { label: 'PDF Document', icon: FileText, accept: '.pdf' },
    { label: 'JSON Data', icon: Bot, accept: '.json' },
    { label: 'Google Drive', icon: CloudUpload, type: 'link' },
  ];

  const handleOptionClick = (option: any) => {
    if (option.type === 'link') {
       toast.info(`Connecting to ${option.label}...`);
    } else {
       fileInputRef.current?.click();
    }
    setShowUploadMenu(false);
  };

  if (messages.length > 0) {
    return (
      <div className="w-full h-full flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Active Analysis</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Session: {messages[0].content.slice(0, 30)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Export PDF">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-100 dark:bg-zinc-800 mx-1" />
            <button 
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors" 
              title="Clear Session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pin Area */}
        <AnimatePresence>
          {messages.some(m => m.isPinned) && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 px-6 py-2 overflow-hidden"
            >
               <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1">
                 {messages.filter(m => m.isPinned).map(m => (
                   <div key={m.id} className="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                     <Pin className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                     <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 truncate max-w-[150px]">{m.content}</span>
                     <button onClick={() => togglePin(m.id)} className="ml-1 text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.map((msg, i) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 sm:gap-6 group",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border overflow-hidden",
                msg.role === 'user' 
                  ? "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white" 
                  : "bg-slate-900 dark:bg-indigo-600 border-transparent text-white"
              )}>
                {msg.role === 'user' ? (
                  user?.photoURL ? (
                    <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-5 h-5" />
                  )
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div className={cn(
                "max-w-[85%] sm:max-w-[80%] space-y-2",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "p-4 sm:p-6 rounded-3xl text-sm leading-relaxed relative",
                  msg.role === 'user' 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10 rounded-tr-none" 
                    : "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shadow-sm rounded-tl-none markdown-body text-left"
                )}>
                  {msg.reasoning && (
                    <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[9px] uppercase tracking-widest mb-2">
                        <Brain className="w-3.5 h-3.5" />
                        Analysis Pipeline
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium whitespace-pre-wrap leading-tight">
                        {msg.reasoning}
                      </div>
                    </div>
                  )}
                  {renderContent(msg.content)}
                  
                  {/* Floating Actions */}
                  <div className={cn(
                    "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-1 rounded-xl shadow-lg",
                    msg.role === 'user' ? "right-full mr-2" : "left-full ml-2"
                  )}>
                    <button onClick={() => togglePin(msg.id)} className={cn("p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors", msg.isPinned ? "text-indigo-600" : "text-slate-400")}>
                      <Pin className={cn("w-3.5 h-3.5", msg.isPinned && "fill-indigo-600")} />
                    </button>
                    <button onClick={() => { setInput(msg.content); setEditingMessageId(msg.id); }} className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Response Extras */}
                {msg.role === 'assistant' && (
                  <div className="flex flex-wrap items-center gap-3 px-1">
                    <div className="flex items-center gap-1 border border-slate-100 dark:border-zinc-800 rounded-lg p-0.5">
                      <button 
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={cn("p-1 rounded-md transition-colors", msg.feedback === 'up' ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "text-slate-400 hover:text-emerald-500")}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={cn("p-1 rounded-md transition-colors", msg.feedback === 'down' ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-slate-400 hover:text-red-500")}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                       onClick={() => handleSubmit(undefined, messages[messages.length-1].content)}
                       className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                    <div className="h-3 w-px bg-slate-100 dark:bg-zinc-800" />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {msg.role === 'assistant' && msg.suggestedFollowUps && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.suggestedFollowUps.map(chip => (
                      <button 
                        key={chip}
                        onClick={() => handleSubmit(undefined, chip)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 px-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
           <div className="w-full px-4 sm:px-6 lg:px-10 space-y-3">
              {/* Quick Actions inside Chat */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => setInput(action.prompt)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <action.icon className={cn("w-3 h-3", action.color)} />
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute left-3 top-[18px] flex items-center gap-1" ref={panelRef}>
                    <div className="relative">
                      <button
                        type="button"
                        disabled={isUploading || isLoading}
                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                        className={cn(
                          "w-8 h-8 text-slate-400 hover:text-indigo-600 rounded-lg flex items-center justify-center transition-all",
                          showUploadMenu && "bg-slate-100 dark:bg-zinc-800"
                        )}
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {showUploadMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
                          >
                            {uploadOptions.map((opt, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleOptionClick(opt)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                              >
                                <opt.icon className="w-3.5 h-3.5" />
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleToolClick('connectors')}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                          activePanel === 'connectors' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-indigo-600"
                        )}
                      >
                        <Cable className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activePanel === 'connectors' && renderPanel('connectors')}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleToolClick('tools')}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                          activePanel === 'tools' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-indigo-600"
                        )}
                      >
                        <Construction className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activePanel === 'tools' && renderPanel('tools')}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleToolClick('agents')}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                          activePanel === 'agents' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-indigo-600"
                        )}
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activePanel === 'agents' && renderPanel('agents')}
                      </AnimatePresence>
                    </div>
                </div>
                
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={isUploading ? "Uploading file..." : suggestedPrompts[placeholderIndex]}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 pl-12 pr-28 text-sm font-medium focus:outline-none transition-all resize-none shadow-sm text-slate-900 dark:text-white min-h-[56px] max-h-[200px]"
                  rows={1}
                />

                <div className="absolute right-3 top-[18px] flex items-center gap-1">
                   <button 
                    type="button" 
                    onClick={handleVoiceInput}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isRecording ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-8 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                    className={cn(
                      "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
                      isAdvancedReasoning ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Brain className="w-3 h-3" />
                    Advanced Reasoning {isAdvancedReasoning ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                     {tokens} Tokens Remaining
                   </span>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-20 flex flex-col h-full overflow-y-auto w-full">
      {/* Hero Heading */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full mb-6 font-black uppercase text-[10px] tracking-[0.2em] shadow-sm">
          <Sparkles className="w-4 h-4" />
          Intelligence Platform Activated
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Analyze without <span className="text-indigo-600">limits.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          The expert data analyst in your pocket. Profile datasets, build ML models, and generate insights with natural language.
        </p>
      </motion.div>
      
      {/* Input Box Static */}
      <div className="w-full mb-12 relative px-4 sm:px-6 lg:px-10">
         <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden p-2 group transition-all focus-within:border-transparent">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={suggestedPrompts[placeholderIndex]}
              className="w-full bg-transparent border-none text-xl sm:text-2xl font-medium p-6 sm:p-8 placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 outline-none resize-none text-slate-900 dark:text-white min-h-[160px] placeholder:text-sm sm:placeholder:text-base"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/50 rounded-b-[1.75rem]">
               <div className="flex items-center gap-2" ref={panelRef}>
                  <div className="relative">
                    <button 
                      onClick={() => setShowUploadMenu(!showUploadMenu)}
                      className="p-2.5 bg-white dark:bg-zinc-800 text-slate-500 rounded-xl hover:text-indigo-600 shadow-sm border border-slate-200 dark:border-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Attach Context</span>
                    </button>
                    <AnimatePresence>
                      {showUploadMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-4 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden py-2"
                        >
                          {uploadOptions.map((opt, idx) => (
                            <button key={idx} onClick={() => handleOptionClick(opt)} className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
                              <opt.icon className="w-4 h-4" />
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => handleToolClick('connectors')}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                        activePanel === 'connectors' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                      )}
                    >
                      <Cable className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Connectors</span>
                    </button>
                    <AnimatePresence>
                      {activePanel === 'connectors' && renderPanel('connectors')}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => handleToolClick('tools')}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                        activePanel === 'tools' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                      )}
                    >
                      <Construction className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Tools</span>
                    </button>
                    <AnimatePresence>
                      {activePanel === 'tools' && renderPanel('tools')}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => handleToolClick('agents')}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                        activePanel === 'agents' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                      )}
                    >
                      <Bot className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Agents</span>
                    </button>
                    <AnimatePresence>
                      {activePanel === 'agents' && renderPanel('agents')}
                    </AnimatePresence>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                     className={cn(
                       "flex items-center gap-2 p-2 rounded-xl transition-all",
                       isAdvancedReasoning ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                     )}
                  >
                    <Brain className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Advanced Reasoning</span>
                  </button>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={!input.trim()}
                    className="h-12 w-full sm:w-32 bg-[#1032CF] dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Analyze
                    <ArrowUp className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         <div className="mt-6 flex flex-wrap justify-center gap-4">
            {quickActions.slice(0, 3).map(action => (
              <button 
                key={action.label} 
                onClick={() => setInput(action.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-600/30 transition-all shadow-sm"
              >
                <action.icon className={cn("w-3.5 h-3.5", action.color)} />
                {action.label}
              </button>
            ))}
         </div>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-12 px-4 sm:px-6 lg:px-10">
        {suggestedPrompts.map((prompt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handlePromptClick(prompt)}
            className="group flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-left hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {i === 0 && <Sparkles className="w-5 h-5" />}
                {i === 1 && <LayoutDashboard className="w-5 h-5" />}
                {i === 2 && <TrendingUp className="w-5 h-5" />}
                {i === 3 && <Search className="w-5 h-5" />}
                {i === 4 && <Cable className="w-5 h-5" />}
                {i === 5 && <Target className="w-5 h-5" />}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 pr-4">{prompt}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
