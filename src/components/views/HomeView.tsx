import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Table, 
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
  Share2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { generateStreamResponse } from '@/src/services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface HomeViewProps {
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export const HomeView = ({ initialPrompt, onClearPrompt }: HomeViewProps) => {
  const { getToken, user } = useAuth();
  const [input, setInput] = React.useState(initialPrompt || '');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdvancedReasoning, setIsAdvancedReasoning] = React.useState(false);
  const [outputCount, setOutputCount] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      // Auto-submit if needed, or just set input
      onClearPrompt?.();
    }
  }, [initialPrompt]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickActions = [
    { label: 'Stock Analysis', icon: TrendingUp, color: 'text-amber-500', question: 'Enter a stock ticker or company name.' },
    { label: 'Excel', icon: Table, color: 'text-green-500', question: 'Paste your data or describe what you need.' },
    { label: 'Slides', icon: Presentation, color: 'text-orange-500', question: 'What is your topic or dataset?' },
    { label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', question: 'Upload or paste your data.' },
    { label: 'Tracker', icon: Target, color: 'text-purple-500', question: 'What do you want to track? (tasks, habits, expenses, goals)' },
    { label: 'Report', icon: FileText, color: 'text-red-500', question: 'What is this report about? Paste your data or topic.' },
  ];

  const handleQuickAction = (action: any) => {
    setInput(action.question);
  };

  const saveToHistory = async (query: string, result: any) => {
    try {
      const token = await getToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('/api/history', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          datasetId: 'chat-session', // Default for chat
          datasetName: 'Chat Interaction',
          result
        })
      });
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (input.trim().toUpperCase() === 'UPGRADE') {
      setOutputCount(0);
      setMessages(prev => [...prev, { role: 'user', content: 'UPGRADE' }, { role: 'assistant', content: 'Plan upgraded! You now have unlimited analysis tokens.' }]);
      setInput('');
      return;
    }

    if (outputCount >= 3) {
      setMessages(prev => [...prev, 
        { role: 'user', content: input }, 
        { role: 'assistant', content: "You've reached the Free Plan limit. Upgrade to unlock unlimited analysis, advanced charts, and priority reasoning.\n\nType **UPGRADE** to continue with full access." }
      ]);
      setInput('');
      return;
    }

    const query = input;
    const userMessage: Message = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];

    // Prepend reasoning if active
    const processedMessages = [...newMessages];
    if (isAdvancedReasoning) {
      const lastMsg = processedMessages[processedMessages.length - 1];
      processedMessages[processedMessages.length - 1] = {
        ...lastMsg,
        content: `[REASONING] ${lastMsg.content}`
      };
    }

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      await generateStreamResponse(processedMessages as any, (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: assistantContent };
          return next;
        });
      });

      setOutputCount(prev => prev + 1);

      // Save to history after successful completion
      if (user) {
        saveToHistory(query, assistantContent);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error processing your request. Please check your API key and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
  };

  if (messages.length > 0) {
    return (
      <div className="w-full flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Brain className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Analysis</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
              title="Clear Session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 sm:gap-6",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                msg.role === 'user' 
                  ? "bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 text-slate-900 dark:text-white" 
                  : "bg-slate-900 dark:bg-indigo-600 border-transparent text-white"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[85%] sm:max-w-[75%] space-y-2",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "p-4 sm:p-5 rounded-3xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-tr-none" 
                    : "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shadow-sm rounded-tl-none markdown-body"
                )}>
                  {msg.role === 'assistant' ? (
                    <div className="space-y-4">
                      {msg.content.includes("⚙ Advanced Reasoning Active") && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-3 rounded-xl mb-4">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                            <Brain className="w-3.5 h-3.5" />
                            ⚙ Advanced Reasoning Active
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 italic font-medium leading-relaxed">
                            {msg.content.split('⚙ Advanced Reasoning Active')[1]?.split('\n\n')[0] || 'Thinking...'}
                          </div>
                        </div>
                      )}
                      <ReactMarkdown>
                        {msg.content.includes("⚙ Advanced Reasoning Active") 
                          ? msg.content.substring(msg.content.indexOf('\n\n', msg.content.indexOf('⚙ Advanced Reasoning Active'))) 
                          : msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {msg.role === 'user' ? 'Me' : 'Julius AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
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
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-3">
             <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask a follow up..."
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-white transition-all resize-none shadow-sm text-slate-900 dark:text-white"
                rows={1}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-4 px-2">
               <button 
                type="button" 
                onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-md transition-all text-[9px] font-black uppercase tracking-widest",
                  isAdvancedReasoning ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Brain className="w-3.5 h-3.5" />
                Advanced Reasoning: {isAdvancedReasoning ? 'ON' : 'OFF'}
              </button>
              <div className="h-3 w-px bg-slate-200 dark:bg-zinc-800" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Outputs: {outputCount}/3 used
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-20 flex flex-col items-center">
      {/* Hero Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          What can I help you analyze today?
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Upload a file or connect a database to get started with AI-driven insights and automated workflows.
        </p>
      </div>

      {/* Free Plan Banner */}
      <div className="w-full mb-8 sm:mb-10 flex justify-center">
        <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm">
          <span className={cn("w-2 h-2 rounded-full", outputCount < 3 ? "bg-emerald-400" : "bg-red-400")}></span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-widest text-center">
            {outputCount < 3 ? `Free plan | ${3 - outputCount} analysis tokens remaining` : "Limit reached | Upgrade for more powers"}
          </span>
          <button 
            onClick={() => { setOutputCount(0); setMessages(prev => [...prev, { role: 'assistant', content: 'Demo: Plan reset to unlimited tokens.' }]) }}
            className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-white hover:underline px-1 uppercase tracking-widest"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Main Prompt Container */}
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 p-3 sm:p-4 transition-all focus-within:ring-4 focus-within:ring-slate-900/5 dark:focus-within:ring-white/5">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full border-0 focus:ring-0 text-base sm:text-lg placeholder-slate-400 font-medium resize-none p-2 min-h-[100px] sm:min-h-[140px] text-slate-900 dark:text-white bg-transparent" 
              placeholder="Clean and transform my dataset..." 
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-50 dark:border-zinc-800 pt-3 mt-2 gap-4">
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-all flex-shrink-0" title="Connectors">
                <Cable className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-all flex-shrink-0" title="Tools">
                <Construction className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-all flex-shrink-0" title="Agent">
                <Headset className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1 flex-shrink-0"></div>
              <button 
                type="button" 
                onClick={() => setIsAdvancedReasoning(!isAdvancedReasoning)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap",
                  isAdvancedReasoning ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
                )}
              >
                <Brain className="w-4 h-4" />
                Advanced Reasoning {isAdvancedReasoning ? 'ON' : 'OFF'}
              </button>
            </div>
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-full sm:w-10 h-10 bg-[#1032CF] dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-black/10"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5 hidden sm:block" />}
              <span className="sm:hidden font-bold">Analyze</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
        {quickActions.map((action) => (
          <button 
            key={action.label}
            onClick={() => handleQuickAction(action)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm whitespace-nowrap active:scale-95 text-slate-700 dark:text-zinc-300"
          >
            <action.icon className={cn("w-4 h-4", action.color)} />
            {action.label}
          </button>
        ))}
      </div>

      {/* Bento Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-16 sm:mt-24">
        {[
          { title: 'Data Sources', desc: 'Connect to Google Sheets, PostgreSQL, or upload CSV files directly for AI-driven analysis.', icon: CloudUpload, bg: 'bg-slate-50 dark:bg-zinc-800', text: 'text-slate-700 dark:text-zinc-300' },
          { title: 'Automated Cleanup', desc: 'Fix missing values, normalize formats, and remove duplicates with one intelligent prompt.', icon: Sparkles, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
          { title: 'Visual Insights', desc: 'Generate publication-quality charts and interactive dashboards in seconds with Plotly.', icon: BarChart, bg: 'bg-green-50 dark:bg-emerald-900/20', text: 'text-green-600 dark:text-emerald-400', wide: true }
        ].map((feat, i) => (
          <div key={i} className={cn(
            "bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col items-center sm:items-start text-center sm:text-left",
            feat.wide && "sm:col-span-2 lg:col-span-1"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feat.bg, feat.text)}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feat.title}</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
