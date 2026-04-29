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
  Terminal,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RobotAvatar } from '../RobotAvatar';
import { generateStreamResponse } from '@/src/services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { ChatPlotly, ChatTable, ChatCode } from '../chat/ChatComponents';
import { ReactLenis } from 'lenis/react';

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
  const userId = user?.uid;
  const [input, setInput] = React.useState(initialPrompt || '');
  // Restore messages from localStorage on mount (user-scoped)
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    try {
      const key = userId ? `ct_chat_messages_${userId}` : 'ct_chat_messages';
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {}
    return [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdvancedReasoning, setIsAdvancedReasoning] = React.useState(false);
  // Restore tokens from localStorage (default 20, user-scoped)
  const [tokens, setTokens] = React.useState<number>(() => {
    try {
      const key = userId ? `ct_tokens_${userId}` : 'ct_tokens';
      return parseInt(localStorage.getItem(key) || '20', 10);
    } catch { return 20; }
  });
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
  const [activeAgent, setActiveAgent] = React.useState<string | null>(null);
  const [activeTools, setActiveTools] = React.useState<string[]>([]);
  const [activeConnectors, setActiveConnectors] = React.useState<string[]>([]);
  const [pendingFile, setPendingFile] = React.useState<{ name: string, summary: string } | null>(null);
  
  // Rate limiting logic: 5 messages per hour for free users
  const [isPro, setIsPro] = React.useState(localStorage.getItem('ct_user_tier') === 'pro');
  const [recentMessagesCount, setRecentMessagesCount] = React.useState(0);

  React.useEffect(() => {
    const handleStorage = () => {
      setIsPro(localStorage.getItem('ct_user_tier') === 'pro');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  React.useEffect(() => {
    const checkRateLimit = () => {
      try {
        const key = userId ? `ct_msg_history_${userId}` : 'ct_msg_history';
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        const oneHourAgo = Date.now() - 3600000;
        const recent = history.filter((ts: number) => ts > oneHourAgo);
        setRecentMessagesCount(recent.length);
        localStorage.setItem(key, JSON.stringify(recent));
      } catch {
        setRecentMessagesCount(0);
      }
    };
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [messages, userId]);

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

  // Persist messages to localStorage whenever they change (user-scoped)
  React.useEffect(() => {
    try {
      const key = userId ? `ct_chat_messages_${userId}` : 'ct_chat_messages';
      localStorage.setItem(key, JSON.stringify(messages));
    } catch {}
  }, [messages, userId]);

  // Persist tokens to localStorage whenever they change (user-scoped)
  React.useEffect(() => {
    try {
      const key = userId ? `ct_tokens_${userId}` : 'ct_tokens';
      localStorage.setItem(key, tokens.toString());
    } catch {}
  }, [tokens, userId]);
  // Persist active tools and connectors to localStorage (user-scoped)
  React.useEffect(() => {
    try {
      const toolsKey = userId ? `ct_active_tools_${userId}` : 'ct_active_tools';
      const connectorsKey = userId ? `ct_active_connectors_${userId}` : 'ct_active_connectors';
      localStorage.setItem(toolsKey, JSON.stringify(activeTools));
      localStorage.setItem(connectorsKey, JSON.stringify(activeConnectors));
    } catch {}
  }, [activeTools, activeConnectors, userId]);

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
    setActiveAgent(agent);
    setActivePanel(null);
    toast.success(`Agent ${agent} activated`);
  };

  const handleToggleTool = (tool: string) => {
    setActiveTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
    toast.success(activeTools.includes(tool) ? `Tool ${tool} removed` : `Tool ${tool} added`);
  };

  const handleToggleConnector = (connector: string) => {
    setActiveConnectors(prev => 
      prev.includes(connector) ? prev.filter(c => c !== connector) : [...prev, connector]
    );
    toast.success(activeConnectors.includes(connector) ? `Connector ${connector} removed` : `Connector ${connector} added`);
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
        { name: 'Zendesk', icon: Headset, color: 'text-blue-400' },
        { name: 'MySQL', icon: Database, color: 'text-blue-500' },
        { name: 'Firebase', icon: Database, color: 'text-amber-500' },
        { name: 'Slack', icon: MessageSquare, color: 'text-purple-600' }
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
        { name: 'DeepSeek Coder', icon: Construction, color: 'text-blue-700' },
        { name: 'Data Visualizer', icon: Presentation, color: 'text-indigo-400' },
        { name: 'Jupyter Env', icon: Terminal, color: 'text-orange-500' },
        { name: 'D3.js Builder', icon: BarChart, color: 'text-orange-400' },
        { name: 'API Tester', icon: Cable, color: 'text-emerald-500' }
      ],
      agents: [
        { name: 'Data Cleaner', icon: Construction, color: 'text-orange-500' },
        { name: 'ML Builder', icon: Bot, color: 'text-indigo-600' },
        { name: 'Report Generator', icon: FileText, color: 'text-red-500' },
        { name: 'KPI Tracker', icon: Target, color: 'text-emerald-500' },
        { name: 'Web Scraper', icon: Search, color: 'text-blue-500' },
        { name: 'SQL Expert', icon: Database, color: 'text-slate-500' },
        { name: 'SEO Analyst', icon: TrendingUp, color: 'text-green-500' },
        { name: 'Email Marketer', icon: Share2, color: 'text-pink-500' },
        { name: 'Fin Modeler', icon: BarChart, color: 'text-amber-500' },
        { name: 'Research Bot', icon: Search, color: 'text-indigo-400' },
        { name: 'Code Reviewer', icon: CheckCircle2, color: 'text-emerald-600' },
        { name: 'Copywriter', icon: Presentation, color: 'text-purple-500' },
        { name: 'Groq LPU', icon: Brain, color: 'text-orange-600' },
        { name: 'Llama 3', icon: Bot, color: 'text-indigo-500' },
        { name: 'Mixtral', icon: Sparkles, color: 'text-pink-500' }
      ]
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: -8, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
      >
        <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800 mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-2 max-h-[300px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
          {items[type].map((item, i) => {
            const isActive = type === 'agents' 
              ? activeAgent === item.name 
              : type === 'tools' 
                ? activeTools.includes(item.name)
                : activeConnectors.includes(item.name);

            return (
              <button
                key={i}
                onClick={() => {
                  if (type === 'agents') handleAgentSelect(item.name);
                  else if (type === 'tools') handleToggleTool(item.name);
                  else if (type === 'connectors') handleToggleConnector(item.name);
                }}
                className={cn(
                  "flex flex-col items-center justify-start gap-2 p-2 rounded-xl transition-all text-center group",
                  isActive ? "bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500/50" : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform", 
                  isActive ? "bg-indigo-600 text-white" : cn("bg-slate-50 dark:bg-zinc-800/80", item.color.replace('text-', 'bg-').replace('500', '50/50'))
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : item.color)} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold leading-tight",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-zinc-400"
                )}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const accept = fileInputRef.current?.accept;
    if (accept) {
       const extensions = accept.split(',').map(ext => ext.trim().toLowerCase());
       let isValid = false;
       
       if (accept.includes('/*')) {
         const typePrefix = accept.split('/')[0];
         isValid = file.type.startsWith(typePrefix);
       } else {
         const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
         isValid = extensions.includes(fileExt) || extensions.some(ext => file.type === ext);
       }

       if (!isValid) {
         toast.error(`Invalid file type. Please upload a valid ${accept} file.`);
         if (fileInputRef.current) fileInputRef.current.value = '';
         return;
       }
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }

      const dataset = await response.json();
      const summary = `Attached file: **${file.name}**\n\nDataset uploaded successfully — **${dataset.rows} rows**, **${dataset.columns} columns**.`;
      
      setPendingFile({ name: file.name, summary });
      toast.success(`${file.name} attached as context.`);
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e?: React.FormEvent, directInput?: string) => {
    e?.preventDefault();
    const finalInput = directInput || input;
    if (!finalInput.trim() || isLoading) return;

    if (!isPro && recentMessagesCount >= 5) {
      toast.error("Message limit reached!", {
        description: "You have reached the limit of 5 messages per hour. Upgrade to PRO for unlimited analysis.",
        action: {
          label: "Upgrade",
          onClick: () => {
            localStorage.setItem('ct_user_tier', 'pro');
            toast.success("Account upgraded to PRO!");
            window.dispatchEvent(new Event('storage'));
            window.location.reload();
          }
        }
      });
      return;
    }

    if (tokens <= 0) {
      toast.error("You've run out of tokens!", {
        description: "Upgrade your plan for unlimited data analysis."
      });
      return;
    }

    const query = pendingFile ? `${pendingFile.summary}\n\nUser Question: ${finalInput}` : finalInput;
    
    const userMessage: ChatMessage = { 
      id: Date.now().toString(),
      role: 'user', 
      content: query,
      timestamp: new Date()
    };
    
    setPendingFile(null);
    
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

    // Track for rate limiting (user-scoped)
    if (!isPro) {
      try {
        const key = userId ? `ct_msg_history_${userId}` : 'ct_msg_history';
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        history.push(Date.now());
        localStorage.setItem(key, JSON.stringify(history));
        setRecentMessagesCount(history.length);
      } catch {}
    }

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

      await generateStreamResponse(
        newMessages.map(m => ({ role: m.role, content: m.content })) as any,
        (chunk) => {
          assistantContent += chunk;
          setMessages(prev => {
            const next = [...prev];
            const assistantMsgIdx = next.findIndex(m => m.id === assistantId);
            if (assistantMsgIdx !== -1) {
              next[assistantMsgIdx] = { ...next[assistantMsgIdx], content: assistantContent };
            }
            return next;
          });
        },
        getToken,
        activeAgent,
        activeTools,
        activeConnectors
      );

      // Token deduction (1 token per analysis) — persisted to localStorage via useEffect
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
        if (!token) {
          console.warn("No auth token available, skipping history save");
        } else {
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          headers['Authorization'] = `Bearer ${token}`;
          
          const res = await fetch('/api/history', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: query,
              datasetId: 'default',
              datasetName: 'Chat Interaction',
              result: assistantContent
            })
          });
          
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error("Failed to save history:", res.status, error);
          }
        }
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
      const chatMsgKey = userId ? `ct_chat_messages_${userId}` : 'ct_chat_messages';
      const toolsKey = userId ? `ct_active_tools_${userId}` : 'ct_active_tools';
      const connectorsKey = userId ? `ct_active_connectors_${userId}` : 'ct_active_connectors';
      localStorage.removeItem(chatMsgKey);
      localStorage.removeItem(toolsKey);
      localStorage.removeItem(connectorsKey);
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
    { label: 'Database URL', icon: Database, type: 'link' },
    { label: 'Audio File', icon: Mic, accept: 'audio/*' },
    { label: 'Notion Docs', icon: FileText, type: 'link' },
    { label: 'Github Repo', icon: Terminal, type: 'link' }
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

  if (messages.length > 0) {
    return (
      <div className="w-full h-full flex flex-col h-[calc(100vh-140px)]">
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleChatFileUpload} 
        />
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

        {/* Pro Banner if not Pro */}
        {!isPro && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-20 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-16 h-16" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-1">Unlock Pro Power</h4>
            <p className="text-[10px] opacity-80 mb-3 font-medium">Remove the 5 msg/hr limit and get advanced reasoning.</p>
            <button 
              onClick={() => {
                const newTier = 'pro';
                localStorage.setItem('ct_user_tier', newTier);
                toast.success("Account upgraded to PRO tier!");
                window.dispatchEvent(new Event('storage'));
                window.location.reload();
              }}
              className="w-full py-2 bg-white text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all"
            >
              Upgrade Now
            </button>
          </div>
        )}

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

        <ReactLenis className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth" ref={scrollRef}>
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
                  <RobotAvatar className="w-full h-full" />
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
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <RobotAvatar className="w-full h-full" />
              </div>
              <div className="flex items-center gap-2 px-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </ReactLenis>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
           <div className="w-full px-4 sm:px-6 lg:px-10 space-y-3">
              {/* Quick Actions inside Chat */}
              {/* Quick action pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => setInput(action.prompt)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-600/30 transition-all shadow-sm"
                  >
                    <action.icon className={cn("w-3 h-3", action.color)} />
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Chat input — same style as home */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-zinc-800 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
                {/* Active Context Badges */}
                <div className="flex flex-wrap items-center gap-2 px-5 pt-3 pb-0">
                  <AnimatePresence>
                    {activeAgent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full px-3 py-1 text-[10px] font-bold"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Agent: {activeAgent}</span>
                        <button onClick={() => setActiveAgent(null)} className="ml-1 text-indigo-400 hover:text-indigo-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                    {activeConnectors.map(conn => (
                      <motion.div
                        key={conn}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-[10px] font-bold"
                      >
                        <Cable className="w-3 h-3" />
                        <span>{conn}</span>
                        <button onClick={() => handleToggleConnector(conn)} className="ml-1 text-emerald-400 hover:text-emerald-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    {activeTools.map(tool => (
                      <motion.div
                        key={tool}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-full px-3 py-1 text-[10px] font-bold"
                      >
                        <Construction className="w-3 h-3" />
                        <span>{tool}</span>
                        <button onClick={() => handleToggleTool(tool)} className="ml-1 text-amber-400 hover:text-amber-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    {pendingFile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-[10px] font-bold"
                      >
                        <FilePlus className="w-3 h-3" />
                        <span>File: {pendingFile.name}</span>
                        <button onClick={() => setPendingFile(null)} className="ml-1 text-blue-400 hover:text-blue-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {(activeAgent || activeTools.length > 0 || activeConnectors.length > 0 || pendingFile) && (
                    <span className="text-[10px] text-slate-400 font-medium">context active</span>
                  )}
                  {!isPro && (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Messages: {recentMessagesCount}/5 per hour</span>
                      <div className="w-16 h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", recentMessagesCount >= 4 ? "bg-red-500" : "bg-indigo-500")} 
                          style={{ width: `${(recentMessagesCount / 5) * 100}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={isUploading ? "Uploading file..." : suggestedPrompts[placeholderIndex]}
                  className="w-full bg-transparent border-none text-base sm:text-lg font-medium p-5 placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 outline-none resize-none text-slate-900 dark:text-white min-h-[56px] max-h-[300px]"
                  rows={1}
                />

                {/* Toolbar */}
                <div className="flex flex-row items-center justify-between gap-2 p-3 border-t border-slate-50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/50 rounded-b-[1.75rem]">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-1" ref={panelRef}>

                    {/* Attach Context */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        disabled={isUploading || isLoading}
                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                        className="p-2 sm:p-2.5 bg-white dark:bg-zinc-800 text-slate-500 rounded-xl hover:text-indigo-600 shadow-sm border border-slate-200 dark:border-zinc-700 transition-all flex items-center gap-2"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Attach Context</span>
                      </button>
                      <AnimatePresence>
                        {showUploadMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                          >
                            <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800 mb-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attach Context</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 px-3 pb-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                              {uploadOptions.map((opt, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleOptionClick(opt)}
                                  className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-center group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <opt.icon className="w-5 h-5 text-slate-500" />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Connectors */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => handleToolClick('connectors')}
                        className={cn("p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                          activePanel === 'connectors' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                        )}
                      >
                        <Cable className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Connectors</span>
                      </button>
                      <AnimatePresence>{activePanel === 'connectors' && renderPanel('connectors')}</AnimatePresence>
                    </div>

                    {/* Tools */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => handleToolClick('tools')}
                        className={cn("p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                          activePanel === 'tools' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                        )}
                      >
                        <Construction className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Tools</span>
                      </button>
                      <AnimatePresence>{activePanel === 'tools' && renderPanel('tools')}</AnimatePresence>
                    </div>

                    {/* Agents */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => handleToolClick('agents')}
                        className={cn("p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
                          activePanel === 'agents' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700"
                        )}
                      >
                        <Bot className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Agents</span>
                      </button>
                      <AnimatePresence>{activePanel === 'agents' && renderPanel('agents')}</AnimatePresence>
                    </div>

                  </div>

                  {/* Right: Advanced Reasoning + Submit */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pl-2 border-l border-slate-200 dark:border-zinc-700/50">
                    <button
                      onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                      className={cn("flex items-center gap-2 p-2 rounded-xl transition-all flex-shrink-0",
                        isAdvancedReasoning ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Brain className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Advanced Reasoning</span>
                    </button>
                    <button
                      onClick={() => handleSubmit()}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1032CF] dark:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                    >
                      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-20 flex flex-col h-full overflow-y-auto w-full">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChatFileUpload} 
      />
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
         <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-zinc-800 p-2 group transition-all focus-within:border-transparent">
            <div className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-0">
              <AnimatePresence>
                {activeAgent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full px-3 py-1 text-xs font-bold"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Agent: {activeAgent}</span>
                    <button
                      onClick={() => setActiveAgent(null)}
                      className="ml-1 text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
                {pendingFile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-bold"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>File: {pendingFile.name}</span>
                    <button
                      onClick={() => setPendingFile(null)}
                      className="ml-1 text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {(activeAgent || pendingFile) && (
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">context active</span>
              )}
            </div>
            <textarea 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={suggestedPrompts[placeholderIndex]}
              className="w-full bg-transparent border-none text-lg sm:text-2xl font-medium p-5 sm:p-8 placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 outline-none resize-none text-slate-900 dark:text-white min-h-[56px] sm:min-h-[64px] placeholder:text-sm sm:placeholder:text-base max-h-[300px]"
              rows={1}
            />
            <div className="flex flex-row items-center justify-between gap-2 p-3 sm:p-4 border-t border-slate-50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/50 rounded-b-[1.75rem]">
               <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-1" ref={panelRef}>
                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => setShowUploadMenu(!showUploadMenu)}
                      className="p-2 sm:p-2.5 bg-white dark:bg-zinc-800 text-slate-500 rounded-xl hover:text-indigo-600 shadow-sm border border-slate-200 dark:border-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Paperclip className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Attach Context</span>
                    </button>
                    <AnimatePresence>
                      {showUploadMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-4 w-72 sm:w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                        >
                          <div className="px-4 py-2 border-b border-slate-50 dark:border-zinc-800 mb-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attach Context</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 px-3 pb-2 max-h-[300px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
                            {uploadOptions.map((opt, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => handleOptionClick(opt)} 
                                className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-center group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <opt.icon className="w-5 h-5 text-slate-500" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">
                                  {opt.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => handleToolClick('connectors')}
                      className={cn(
                        "p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
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

                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => handleToolClick('tools')}
                      className={cn(
                        "p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
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

                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => handleToolClick('agents')}
                      className={cn(
                        "p-2 sm:p-2.5 rounded-xl transition-all shadow-sm border flex items-center gap-2",
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

               <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pl-2 border-l border-slate-200 dark:border-zinc-700/50">
                  <button 
                     onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                     className={cn(
                       "flex items-center gap-2 p-2 rounded-xl transition-all flex-shrink-0",
                       isAdvancedReasoning ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                     )}
                  >
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Advanced Reasoning</span>
                  </button>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={!input.trim()}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1032CF] dark:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
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
