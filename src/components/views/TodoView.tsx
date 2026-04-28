import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Search,
  LayoutGrid,
  ListTodo,
  Calendar,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Flag
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export const TodoView = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('ct_todos');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Initialize quantum neural interface', completed: true, priority: 'high', createdAt: Date.now() - 86400000 },
      { id: '2', text: 'Optimize vector database indexing', completed: false, priority: 'medium', createdAt: Date.now() - 3600000 },
      { id: '3', text: 'Review agent safety protocols', completed: false, priority: 'high', createdAt: Date.now() }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('ct_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputValue.trim(),
      completed: false,
      priority: 'medium',
      createdAt: Date.now()
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setIsAdding(false);
    toast.success("Task added to queue");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.error("Task purged from system");
  };

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'active') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return true;
  });

  const completionRate = Math.round((todos.filter(t => t.completed).length / todos.length) * 100) || 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-[#050505] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-wider">Mission Log</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Coordinate your development vectors and cognitive tasks.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none mb-1">Efficiency Level</p>
                 <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">{completionRate}% Protocol Completion</p>
              </div>
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" /> New Mission
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {[
               { label: 'Pending Missions', value: todos.filter(t => !t.completed).length, icon: ListTodo, color: 'text-amber-500' },
               { label: 'Completed Missions', value: todos.filter(t => t.completed).length, icon: CheckCircle2, color: 'text-emerald-500' },
               { label: 'High Priority', value: todos.filter(t => t.priority === 'high' && !t.completed).length, icon: AlertCircle, color: 'text-rose-500' }
             ].map((stat, i) => (
               <div key={i} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{stat.label}</p>
                     <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                     <stat.icon className="w-6 h-6" />
                  </div>
               </div>
             ))}
          </div>

          {/* Main Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
             <div className="flex gap-1 p-1 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                {['all', 'active', 'completed'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === t ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {t}
                  </button>
                ))}
             </div>
             
             <div className="flex items-center gap-2">
                <Button variant="ghost" className="rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 gap-2">
                   <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
                </Button>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                   <input 
                     type="text" 
                     placeholder="Search vectors..." 
                     className="bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none w-48"
                   />
                </div>
             </div>
          </div>

          {/* Todo List */}
          <div className="space-y-3">
             <AnimatePresence mode="popLayout">
                {isAdding && (
                  <motion.form 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={addTodo}
                    className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 flex items-center gap-4"
                  >
                     <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                     </div>
                     <input 
                       autoFocus
                       type="text"
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Define new mission objective..."
                       className="flex-1 bg-transparent border-none text-lg font-black placeholder:text-white/40 outline-none"
                     />
                     <Button type="submit" className="bg-white text-indigo-600 hover:bg-white/90 rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                        Deploy
                     </Button>
                     <Button type="button" onClick={() => setIsAdding(false)} variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl px-3">
                        Cancel
                     </Button>
                  </motion.form>
                )}

                {filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "group p-5 rounded-[2rem] border transition-all flex items-center justify-between",
                      todo.completed 
                        ? "bg-slate-50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800 opacity-60" 
                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => toggleTodo(todo.id)}
                         className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                           todo.completed ? "bg-emerald-500 text-white" : "bg-slate-50 dark:bg-zinc-800 text-slate-300 hover:text-indigo-600"
                         )}
                       >
                          {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                       </button>
                       <div>
                          <p className={cn("text-sm font-black uppercase tracking-tight", 
                            todo.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"
                          )}>
                             {todo.text}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                             <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ring-1", 
                               todo.priority === 'high' ? "ring-rose-500/20 text-rose-500 bg-rose-500/5" : "ring-zinc-500/20 text-zinc-400"
                             )}>
                                {todo.priority} Priority
                             </span>
                             <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(todo.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800"><Flag className="w-4 h-4 text-zinc-400" /></Button>
                       <Button onClick={() => deleteTodo(todo.id)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>

             {filteredTodos.length === 0 && (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-center mx-auto text-zinc-300">
                     <ListTodo className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">No Active Vectors</h3>
                     <p className="text-xs text-zinc-500 font-medium tracking-tight">Your mission queue is currently empty. Define new objectives.</p>
                  </div>
                  <Button onClick={() => setIsAdding(true)} variant="outline" className="rounded-xl text-[9px] font-black uppercase tracking-widest h-9 px-6 border-zinc-200 dark:border-zinc-800">New Mission</Button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
