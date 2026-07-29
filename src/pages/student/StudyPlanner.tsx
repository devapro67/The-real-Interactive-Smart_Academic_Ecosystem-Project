import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Simple notification
      if (Notification.permission === 'granted') {
          new Notification(mode === 'work' ? 'Break Time!' : 'Back to Work!');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 rounded-4xl p-10 text-white relative overflow-hidden h-full flex flex-col justify-between shadow-2xl">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-1 h-4 bg-fuchsia-500 rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-fuchsia-400">Neural Focus Module</h3>
        </div>

        <div className="text-center py-10">
          <div className="text-7xl font-black tracking-tighter mb-4 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="inline-flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
            <button 
              aria-label="Set Focus Mode"
              onClick={() => { setMode('work'); resetTimer(); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'work' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Focus
            </button>
            <button 
              aria-label="Set Break Mode"
              onClick={() => { setMode('break'); resetTimer(); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Break
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-6 pt-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Reset Pomodoro Timer"
          onClick={resetTimer}
          className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white"
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isActive ? "Pause Focus Session" : "Start Focus Session"}
          onClick={toggleTimer}
          className="w-20 h-20 bg-white text-slate-900 rounded-4xl flex items-center justify-center shadow-xl shadow-white/10"
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </motion.button>
        <div className="w-14 h-14" /> {/* Spacer */}
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
    </div>
  );
};

export default function StudyPlanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [isOptimizing, setIsOptimizing] = useState(false);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dates = [12, 13, 14, 15, 16, 17, 18]; // Mock dates

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.stagger-card');
      gsap.fromTo(elements, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power3.out' 
        }
      );
    }
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-card flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 nordic-gradient rounded-lg">
                 <Calendar className="text-obsidian" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Temporal Optimization</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Intelligence Planner</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-tight">AI-synced 7-day curriculum trajectory for maximum peak state.</p>
          </div>

          <div className="flex items-center gap-3">
             <button 
              aria-label="Add new curriculum event"
              className="p-4 glass-card border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors">
                <Plus size={20} className="text-white" />
             </button>
             <button 
              onClick={handleOptimize}
              aria-label="Optimize temporal schedule"
              disabled={isOptimizing}
              className="px-6 py-4 nordic-gradient text-obsidian rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan/20 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
             >
                {isOptimizing ? <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" /> : <Sparkles size={16} />} 
                {isOptimizing ? 'Recalculating Matrix...' : 'Optimize Schedule'}
             </button>
          </div>
        </header>

        {/* 7-Day Matrix */}
        <div className="stagger-card glass-card rounded-5xl p-10 overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Current Academic Cycle</h3>
            <div className="flex items-center gap-2 text-white">
              <button 
                aria-label="Previous week"
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"><ChevronLeft size={20} /></button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">May 12 - May 18</span>
              <button 
                aria-label="Next week"
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
             {days.map((day, i) => (
               <button 
                key={day}
                aria-label={`Select ${day}`}
                onClick={() => setSelectedDay(i)}
                className={`p-6 rounded-5xl border transition-all flex flex-col items-center gap-2 group ${selectedDay === i ? 'nordic-gradient border-seafoam text-obsidian shadow-xl shadow-cyan/10' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
               >
                 <span className={`text-[10px] font-black uppercase tracking-widest ${selectedDay === i ? 'opacity-60' : 'opacity-40'}`}>{day.substring(0, 3)}</span>
                 <span className="text-2xl font-black">{dates[i]}</span>
                 {i === 2 && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${selectedDay === i ? 'bg-obsidian' : 'bg-seafoam'}`} />
                 )}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Schedule List */}
           <div className="lg:col-span-2 stagger-card">
              <div className="glass-card rounded-5xl p-10 h-full">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white tracking-tight">Daily Itinerary: {days[selectedDay]}</h3>
                    <span className="px-3 py-1 bg-seafoam/10 text-seafoam text-[10px] font-black uppercase tracking-widest rounded-full border border-seafoam/20">4 Target Blocks</span>
                 </div>

                 <div className="space-y-6">
                    {[
                      { time: "09:00 - 11:30", subject: "Quantum Computing Foundations", activity: "Deep Work Session", color: "border-seafoam" },
                      { time: "13:00 - 14:30", subject: "Applied Statistics", activity: "Problem Lab", color: "border-cyan" },
                      { time: "15:00 - 16:30", subject: "Advanced Literature", activity: "Critique Sync", color: "border-cyber-amber" },
                      { time: "17:00 - 18:00", subject: "Office Hours", activity: "Consultation", color: "border-emerald-500" }
                    ].map((block, i) => (
                      <div key={i} className={`flex gap-6 p-6 bg-white/5 rounded-4xl border border-white/5 border-l-4 ${block.color} shadow-sm group hover:scale-[1.01] transition-transform cursor-pointer`}>
                        <div className="shrink-0 pt-1">
                          <Clock className="text-slate-600 group-hover:text-seafoam transition-colors" size={20} />
                        </div>
                        <div className="grow">
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{block.time}</p>
                                <h4 className="text-lg font-black text-white tracking-tight">{block.subject}</h4>
                                <p className="text-sm font-medium text-slate-400">{block.activity}</p>
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  aria-label="Mark block as synchronized"
                                  className="p-2 hover:bg-white/5 rounded-lg"><CheckCircle2 size={16} className="text-emerald-500" /></button>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Pomodoro Widget */}
           <div className="stagger-card">
              <PomodoroTimer />
           </div>
        </div>

        {/* Analytics Section */}
        <section className="stagger-card bg-slate-900 rounded-5xl p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-6 border border-indigo-500/20">
                    <Brain size={14} /> Cognitive Load
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter mb-6">Efficiency Analytics</h2>
                 <div className="space-y-6 max-w-sm">
                    <div>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                          <span>Focus Stability</span>
                          <span>92%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full w-[92%]" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                          <span>Task Velocity</span>
                          <span>78%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-fuchsia-500 rounded-full w-[78%]" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex-1 flex justify-center">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 * 0.15} className="text-indigo-500" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-4xl font-black tracking-tighter text-white">85%</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Decorative */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/10 blur-[120px]" />
        </section>
      </div>
    </div>
  );
}
