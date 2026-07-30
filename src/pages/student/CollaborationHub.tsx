import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2,
  Calendar,
  Send,
  Paperclip,
  Smile
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

const KanbanColumn = ({ title, tasks, color, onAddTask }: { title: string, tasks: any[], color: string, onAddTask: () => void }) => (
  <div className="flex-1 min-w-75 flex flex-col gap-6">
    <div className="flex items-center justify-between px-4">
       <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{title}</h3>
          <span className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-black text-slate-400">{tasks.length}</span>
       </div>
       <button className="p-1 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
          <MoreHorizontal size={16} />
       </button>
    </div>
    
    <div className="flex flex-col gap-4">
       {tasks.map((task, i) => (
         <div key={i} className="glass-card p-6 rounded-4xl hover:scale-[1.02] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-seafoam transition-colors">
                  {task.tag}
               </span>
               <div className="flex -space-x-2">
                  {[1, 2].map(j => (
                    <div key={j} className="w-6 h-6 rounded-full border-2 border-obsidian bg-slate-800" />
                  ))}
               </div>
            </div>
            <h4 className="text-white font-bold tracking-tight mb-4">{task.title}</h4>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <Clock size={12} /> {task.deadline}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <MessageSquare size={12} /> {task.comments}
               </div>
            </div>
         </div>
       ))}
       <button 
          onClick={onAddTask}
          className="w-full py-4 border-2 border-dashed border-white/10 rounded-4xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-seafoam hover:text-seafoam  transition-colors"
        >
          <Plus size={16} /> Add Strategy
       </button>
    </div>
  </div>
);

export default function CollaborationHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([
    { user: "Davo Scholar", text: "Has anyone verified the quantum drift metrics?", time: "14:02" },
    { user: "Orpheus AI", text: "Analysis suggests a 0.04% variance from base state.", time: "14:03", isAI: true },
    { user: "Sarah J.", text: "I'll update the simulation block now.", time: "14:05" }
  ]);
  const [tasks, setTasks] = useState({
    todo: [
      { title: "Quantum Algorithm Mockup", tag: "Design", deadline: "2d", comments: 12 },
      { title: "Literature Review Sync", tag: "Research", deadline: "5d", comments: 3 }
    ],
    inProgress: [
      { title: "Neural Net Training Loop", tag: "Dev", deadline: "Today", comments: 45 }
    ],
    completed: [
      { title: "Ethics Draft Approved", tag: "Legal", deadline: "Done", comments: 2 }
    ]
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    const newMsg = { user: "You", text: msgInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    setMsgInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        user: "Orpheus AI",
        text: `Query received. Processing "${msgInput}" through the cognitive matrix... Initial data points look synchronized.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      }]);
    }, 1500);
  };

  const addTask = (column: 'todo' | 'inProgress' | 'completed') => {
    const title = prompt("Enter Strategy Title:");
    if (!title) return;
    const newTask = { title, tag: "Strategic", deadline: "Now", comments: 0 };
    setTasks({
      ...tasks,
      [column]: [...tasks[column], newTask]
    });
  };

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 nordic-gradient rounded-lg">
                 <Users className="text-obsidian" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Social Synthesizer</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Collaboration Hub</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-tight">Real-time neural synchronization for distributed academic collectives.</p>
          </div>

          <div className="flex items-center gap-3">
             <button className="px-6 py-4 glass-card border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white shadow-sm hover:bg-white/5 transition-colors flex items-center gap-3">
                <Calendar size={16} /> Schedule Sync
             </button>
             <button className="px-6 py-4 nordic-gradient text-obsidian rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan/20 flex items-center gap-3 active:scale-95 transition-transform">
                <Plus size={16} /> New Collective
             </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 min-h-150">
           {/* Section 1: Project Board */}
           <div className="flex-2 stagger-el glass-card rounded-[48px] p-10 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black text-white tracking-tight">Active Operation Board</h3>
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 font-black text-[9px] uppercase tracking-widest border border-emerald-500/10">
                    <CheckCircle2 size={12} /> Sync Stable
                 </div>
              </div>

              <div className="flex gap-8 overflow-x-auto pb-6 custom-scrollbar">
                 <KanbanColumn title="Strategic Backlog" tasks={tasks.todo} color="bg-slate-400" onAddTask={() => addTask('todo')} />
                 <KanbanColumn title="Active Execution" tasks={tasks.inProgress} color="bg-seafoam" onAddTask={() => addTask('inProgress')} />
                 <KanbanColumn title="Cognitive Verified" tasks={tasks.completed} color="bg-emerald-500" onAddTask={() => addTask('completed')} />
              </div>
           </div>

           {/* Section 2: Group Chat Mockup */}
           <div className="flex-1 stagger-el bg-obsidian rounded-[48px] p-8 flex flex-col shadow-2xl relative overflow-hidden border border-white/10">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                       <MessageSquare size={20} />
                    </div>
                    <div>
                       <h4 className="text-white font-black tracking-tight">Cluster Communications</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 12 Mentors Online
                       </p>
                    </div>
                 </div>

                 <div className="flex-1 space-y-6 overflow-y-auto mb-6 custom-scrollbar pr-2 h-100">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.isAI ? 'items-center' : 'items-start'}`}>
                         <div className={`px-4 py-3 rounded-2xl text-xs max-w-[90%] ${msg.isAI ? 'nordic-gradient text-obsidian w-full text-center italic font-bold' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                            {msg.text}
                         </div>
                         <span className="mt-1 text-[8px] font-black uppercase tracking-widest text-slate-500">{msg.user} • {msg.time}</span>
                      </div>
                    ))}
                 </div>

                 <div className="relative">
                    <input 
                       type="text" 
                       value={msgInput}
                       onChange={(e) => setMsgInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       placeholder="Transmit query..."
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-seafoam transition-all pr-12"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-seafoam hover:text-white transition-colors"
                    >
                       <Send size={18} />
                    </button>
                    <div className="flex gap-2 mt-4 px-2">
                       <button className="p-1 text-slate-500 hover:text-white transition-colors"><Paperclip size={14} /></button>
                       <button className="p-1 text-slate-500 hover:text-white transition-colors"><Smile size={14} /></button>
                    </div>
                 </div>
              </div>

              {/* Decorative */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
           </div>
        </div>
      </div>
    </div>
  );
}
