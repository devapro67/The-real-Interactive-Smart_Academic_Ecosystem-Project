import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Send, 
  Book, 
  Sparkles, 
  Brain, 
  Loader2, 
  Info, 
  Plus, 
  MessageSquare, 
  Edit3, 
  Trash2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Thread {
  id: string;
  title: string;
  subject: string;
  messages: Message[];
  updatedAt: number;
}

export default function HomeworkHelper() {
  const { user, addNotification } = useAppStore();
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      title: 'Quantum Physics Problems',
      subject: 'Physics',
      messages: [],
      updatedAt: Date.now(),
    },
    {
      id: '2',
      title: 'Calculus Integration Help',
      subject: 'Mathematics',
      messages: [],
      updatedAt: Date.now() - 1000 * 60 * 60,
    }
  ]);
  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  const handleCreateThread = () => {
    const newThread: Thread = {
      id: Math.random().toString(36).slice(2, 11),
      title: 'New Neural Thread',
      subject: 'General',
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    addNotification({
      type: 'announcement',
      title: 'Active Link Established',
      content: 'New cognitive buffer initialized and synchronized.'
    });
  };

  const handleRename = (id: string, newTitle: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
    setIsRenaming(null);
  };

  const handleDeleteThread = (id: string) => {
    if (threads.length <= 1) return;
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeThreadId === id) {
        setActiveThreadId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setApiError('');

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setThreads(prev => prev.map(t => 
      t.id === activeThreadId 
        ? { ...t, messages: [...t.messages, userMsg], updatedAt: Date.now() } 
        : t
    ));
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/homework-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          history: activeThread?.messages ?? [],
          subject: activeThread?.subject || 'General',
          depth: 'full'
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `AI service returned ${response.status}`);
      }

      const result = await response.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.answer || 'Sorry, the AI did not return a valid response. Please try again.',
        timestamp: Date.now(),
      };

      setThreads(prev => prev.map(t => 
        t.id === activeThreadId 
          ? { ...t, messages: [...t.messages, assistantMsg], updatedAt: Date.now() } 
          : t
      ));
    } catch (error: any) {
      const assistantMsg: Message = {
        role: 'assistant',
        content: `⚠️ AI service error: ${error?.message || 'Unable to fetch response.'} Please retry or try a different prompt.`,
        timestamp: Date.now(),
      };

      setThreads(prev => prev.map(t => 
        t.id === activeThreadId 
          ? { ...t, messages: [...t.messages, assistantMsg], updatedAt: Date.now() } 
          : t
      ));
      setApiError(error?.message || 'Unable to contact the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-full gap-8 relative">
      <BackgroundUniverse />

      {/* Sidebar - Threads Canvas */}
      <aside className="relative z-10 w-full lg:w-80 h-full flex flex-col gap-6 stagger-el">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 nordic-gradient rounded-lg shadow-lg shadow-cyan/20">
              <MessageSquare className="text-obsidian" size={16} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-seafoam/70">Neural Threads</h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Create new neural thread"
            onClick={handleCreateThread}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all font-bold"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {threads.map((thread) => (
            <motion.div
              layout
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`group flex items-center justify-between p-5 rounded-4xl border transition-all cursor-pointer relative overflow-hidden ${
                activeThreadId === thread.id 
                  ? 'nordic-gradient border-seafoam shadow-xl shadow-cyan/20' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <Book size={16} className={activeThreadId === thread.id ? 'text-obsidian' : 'text-slate-600'} />
                {isRenaming === thread.id ? (
                  <input
                    autoFocus
                    aria-label="Rename thread"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(thread.id, renameValue)}
                    className="bg-transparent border-b border-obsidian/20 outline-none text-obsidian text-[11px] font-black uppercase tracking-widest w-24"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-widest truncate max-w-30 ${activeThreadId === thread.id ? 'text-obsidian' : 'text-white'}`}>
                      {thread.title}
                    </p>
                    <p className={`text-[8px] font-bold uppercase tracking-widest ${activeThreadId === thread.id ? 'text-obsidian/60' : 'text-slate-600'}`}>
                      {new Date(thread.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  aria-label="Rename thread"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(thread.id);
                    setRenameValue(thread.title);
                  }}
                  className={`p-1.5 rounded-lg hover:bg-black/10 ${activeThreadId === thread.id ? 'text-obsidian' : 'text-slate-400'}`}
                >
                  <Edit3 size={12} />
                </button>
                {threads.length > 1 && (
                  <button 
                    aria-label="Delete thread"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteThread(thread.id);
                    }}
                    className={`p-1.5 rounded-lg hover:bg-black/10 ${activeThreadId === thread.id ? 'text-obsidian' : 'text-slate-400'}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-6 rounded-4xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-cyber-amber" size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Gemini 3 Insights</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            Neural bandwidth prioritized for current academic clusters. latency: <span className="text-seafoam font-black">12ms</span>.
          </p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10 stagger-el">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-cyan text-obsidian rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan/20">
                GEMINI 3 CORE NODE ACTIVE
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Session Monitoring</h2>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
              {activeThread?.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 glass-card px-6 py-4 rounded-3xl">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol</p>
                <p className="text-sm font-black text-white">Full Depth Analysis</p>
             </div>
             <div className="w-10 h-10 rounded-full nordic-gradient flex items-center justify-center text-obsidian">
                <Brain size={20} />
             </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 glass-card rounded-5xl overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {activeThread?.messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 nordic-gradient rounded-4xl flex items-center justify-center shadow-2xl shadow-cyan/20 mb-10 animate-pulse relative">
                  <Sparkles className="text-obsidian" size={48} />
                  <div className="absolute inset-0 bg-white/20 rounded-4xl animate-ping [animation-duration:3s]" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Buffer Initialized</h3>
                <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                  Establish a cognitive handshake by providing your first query. Gemini 3 is on standby for high-fidelity output.
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  {['Deconstruct black hole thermodynamics', 'Derive the Navier-Stokes equations', 'Analyze Nietzsche\'s Ubermensch'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setInput(t)}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-seafoam transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {activeThread?.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <div 
                      className={`px-10 py-8 rounded-5xl shadow-2xl transition-all relative overflow-hidden ${
                        msg.role === 'user' 
                          ? 'bg-obsidian text-white rounded-tr-none border border-white/10' 
                          : 'glass-card text-white rounded-tl-none border border-white/10'
                      }`}
                    >
                      <div className="markdown-body text-sm leading-relaxed relative z-10">
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.role === 'assistant' && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-[60px] -mr-16 -mt-16" />
                      )}
                    </div>
                    <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 opacity-60 flex items-center gap-2">
                      {msg.role === 'user' ? (user?.full_name?.split(' ')[0] || 'User') : 'GEMINI 3 ENGINE'} 
                      <div className="w-1 h-1 bg-slate-700 rounded-full" /> 
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {apiError && (
              <div className="px-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-4xl text-rose-100 text-[11px] font-black uppercase tracking-[0.2em]">
                {apiError}
              </div>
            )}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="glass-card px-10 py-8 rounded-5xl rounded-tl-none border border-white/10 flex items-center gap-4">
                  <div className="relative">
                    <Loader2 size={24} className="animate-spin text-seafoam" />
                    <div className="absolute inset-0 blur-md bg-seafoam/30 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Gemini 3 Thinking...</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generating High-Fidelity Response</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} className="h-4" />
          </div>

          <div className="p-10 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="relative group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Transmit your query to Gemini 3...`}
                aria-label="Homework query input"
                className="w-full bg-obsidian/40 hover:bg-obsidian/60 border border-white/10 rounded-4xl px-10 py-6 text-sm text-white outline-none focus:border-seafoam/50 focus:ring-4 focus:ring-seafoam/5 transition-all shadow-2xl placeholder:text-slate-600 font-medium"
              />
              <div className={`absolute right-4 top-4 flex items-center gap-3 transition-opacity ${input.trim() ? 'opacity-100' : 'opacity-0'}`}>
                 <motion.button 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send query to Gemini 3"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-14 w-14 nordic-gradient text-obsidian rounded-2xl flex items-center justify-center hover:shadow-cyan/40 transition-all disabled:opacity-50 shadow-2xl"
                >
                  <Send size={24} />
                </motion.button>
              </div>
            </div>
            <div className="flex justify-between mt-6 px-6">
              <div className="flex items-center gap-6">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Brain size={14} className="text-seafoam" /> Neural Core Synced
                </p>
                <div className="h-1.5 w-1.5 bg-white/10 rounded-full" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-cyber-amber" /> Full LaTeX Engine Active
                </p>
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest opacity-40">
                Quantum Session Secure • 512-bit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
