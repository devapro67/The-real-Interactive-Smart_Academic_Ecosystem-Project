import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Zap, 
  Layers, 
  FileSearch, 
  Brain,
  LucideIcon,
  Minimize2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QuickChip = ({ label, onClick, icon: Icon }: { label: string, onClick: () => void, icon: LucideIcon }) => (
  <button 
    onClick={onClick}
    aria-label={`Quick query: ${label}`}
    className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-400/5 transition-all text-left group"
  >
    <Icon size={14} className="group-hover:rotate-12 transition-transform" />
    {label}
  </button>
);

export default function GlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Gemini 3 response
    setTimeout(() => {
      let response = "";
      if (text.toLowerCase().includes('summarize')) {
        response = "Scanning active workspace modules... \n\nI have identified 3 academic bottlenecks and 1 critical deadline. Your current cognitive load is balanced, but direct intervention in 'Advanced Physics' is recommended before tomorrow's 09:00 sync.";
      } else if (text.toLowerCase().includes('flashcards')) {
        response = "Generating neural flashcard set from recently accessed lecture packets... \n\n1. Fermi Paradox variables \n2. Great Filter hypotheses \n3. Type III civilization energy metrics. \n\nSynchronized to your personal study buffer.";
      } else if (text.toLowerCase().includes('telemetry')) {
        response = "Retrieving system telemetry data... \n\n*   **Network Sync**: 99.8%\n*   **Neural Cache**: 4.2GB used\n*   **Peer Connectivity**: High\n*   **Global Ecosystem Health**: Optimal";
      } else {
        response = "I have processed your query through the Gemini 3 core. For specific academic assistance, please navigate to the Homework Helper module, or ask me for a high-level summary of your current progress metrics.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Close Global Assistant" : "Open Global Assistant"}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-200 w-16 h-16 rounded-full bg-linear-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-xl shadow-cyan-400/40 transition-all cursor-pointer group"
      >
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X className="text-cyan-400" size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                className="relative"
              >
                <Sparkles className="text-cyan-400" size={28} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-950 animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping [animation-duration:3000ms] pointer-events-none" />
      </motion.button>

      {/* Side Intelligence Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-24 bottom-24 right-6 w-96 max-w-[calc(100vw-48px)] z-190 glass-card rounded-4xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl nordic-gradient flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-400/20">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">Global Assistant</h3>
                    <p className="text-[10px] font-black tracking-widest text-cyan-400 mt-1.5 uppercase">Gemini 3 Integrated</p>
                  </div>
                </div>
                <button 
                  aria-label="Minimize drawer"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"
                >
                  <Minimize2 size={18} />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl -mr-16 -mt-16" />
            </div>

            {/* Content / Chat Log */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="py-10 text-center">
                  <div className="w-20 h-20 rounded-4xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <Brain size={40} />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2">Neural Link Ready</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed px-10">
                    Access high-fidelity insights across the entire ecosystem. How can I augment your focus today?
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-4xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-950 border border-white/10 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-4xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]" />
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:400ms]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gemini 3 Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Overlay / Quick Actions */}
            <div className="p-8 border-t border-white/5 bg-white/5">
              {messages.length === 0 && !inputValue && (
                <div className="grid grid-cols-1 gap-2 mb-6">
                  <QuickChip 
                    icon={Layers}
                    label="Summarize this workspace view" 
                    onClick={() => handleSend("Summarize this workspace view")} 
                  />
                  <QuickChip 
                    icon={Sparkles}
                    label="Generate study flashcards" 
                    onClick={() => handleSend("Generate study flashcards")} 
                  />
                  <QuickChip 
                    icon={FileSearch}
                    label="Explain system telemetry data" 
                    onClick={() => handleSend("Explain system telemetry data")} 
                  />
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Ask the Global Ecosystem..."
                  aria-label="Query input for AI assistant"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-xs text-white outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 transition-all placeholder:text-slate-600 font-bold"
                />
                <button 
                  aria-label="Send message"
                  onClick={() => handleSend(inputValue)}
                  className="absolute right-2 top-2 h-10 w-10 nordic-gradient text-slate-950 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-400/40"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
