import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Wind, 
  Coffee, 
  Headphones, 
  MessageSquare, 
  Plus, 
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Brain
} from 'lucide-react';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import gsap from 'gsap';

export default function WellnessCenter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [breakTimer, setBreakTimer] = useState(0); // in minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer((prev) => prev - 1);
      }, 60000); // decrement every minute
    } else if (breakTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, breakTimer]);

  const handleTransfer = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      alert('Secure Link Established. Cipher transmitted to local counselor node.');
    }, 2000);
  };

  const moods = [
    { label: "Focused", icon: Brain, color: "text-seafoam", bg: "bg-seafoam/10" },
    { label: "Anxious", icon: Heart, color: "text-cyber-red", bg: "bg-cyber-red/10" },
    { label: "Calm", icon: Wind, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Exhausted", icon: Coffee, color: "text-cyber-amber", bg: "bg-cyber-amber/10" },
    { label: "Inspired", icon: Sparkles, color: "text-cyan", bg: "bg-cyan/10" }
  ];

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 nordic-gradient rounded-lg">
                 <Heart className="text-obsidian" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Bio-Metric Balance</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Wellness Center</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-tight">Emotional synchronization and cognitive recovery protocols.</p>
          </div>

          <div className="flex items-center gap-4 glass-card px-6 py-4 rounded-3xl">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cognitive State</p>
                <p className="text-sm font-black text-emerald-400">Optimal Recovery</p>
             </div>
             <div className="w-10 h-10 rounded-full nordic-gradient flex items-center justify-center text-obsidian shadow-sm">
                <Wind size={20} />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Section 1: Mood Tracking Wheel */}
           <div className="stagger-el glass-card rounded-[48px] p-10 flex flex-col items-center">
              <h3 className="text-xl font-black text-white tracking-tight mb-10">Emotional Vector Sync</h3>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                 {moods.map((mood, i) => (
                   <button 
                      key={i}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3 active:scale-95 ${selectedMood === mood.label ? 'nordic-gradient border-seafoam text-obsidian shadow-xl shadow-cyan/20' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                   >
                      <mood.icon size={24} className={selectedMood === mood.label ? 'text-obsidian' : mood.color} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{mood.label}</span>
                   </button>
                 ))}
                 <button className="p-6 rounded-[2.5rem] border border-dashed border-white/10 text-slate-500 hover:border-seafoam hover:text-seafoam transition-all flex flex-col items-center justify-center gap-2">
                    <Plus size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Custom</span>
                 </button>
              </div>

              <div className="mt-10 w-full p-6 bg-white/5 rounded-3xl border border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-seafoam mb-2">AI Observation</p>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Analysis indicates you've been in a <span className="text-white font-black">High Performance Focused</span> state for 4.2 hours. Neural fatigue probability: <span className="text-cyber-red font-black">High</span>.
                 </p>
              </div>
           </div>

           {/* Section 2: Study Break Protocols */}
           <div className="stagger-el flex flex-col gap-8">
              <div className="bg-obsidian rounded-[40px] p-8 text-white relative overflow-hidden flex-1 shadow-2xl flex flex-col justify-between border border-white/10">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                       <Clock className="text-seafoam" size={20} />
                       <h3 className="text-sm font-black uppercase tracking-widest text-seafoam">Break Counter</h3>
                    </div>
                    
                    <div className="text-center py-6">
                       <p className="text-6xl font-black tracking-tighter mb-2">{breakTimer} <span className="text-2xl text-slate-500">m</span></p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Remaining Recovery Time</p>
                    </div>
                 </div>

                 <div className="relative z-10 grid grid-cols-2 gap-3 pb-4">
                    <button 
                       onClick={() => { setBreakTimer(5); setIsTimerRunning(true); }}
                      className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Micro (5m)
                    </button>
                    <button 
                       onClick={() => { setBreakTimer(20); setIsTimerRunning(true); }}
                       className="py-4 nordic-gradient text-obsidian rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan/20"
                    >
                       Deep (20m)
                    </button>
                 </div>

                 <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px]" />
              </div>

              <div className="glass-card rounded-[40px] p-8 flex flex-col gap-6 ">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Suggested Recovery Protocols</h3>
                 <div className="space-y-4">
                    {[
                      { icon: Headphones, title: "Alpha Waves Hub", desc: "432Hz focus enhancement." },
                      { icon: Wind, title: "Box Breathing", desc: "Regulate pulse variability." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="p-3 nordic-gradient rounded-xl text-obsidian">
                           <item.icon size={18} />
                        </div>
                        <div>
                           <h4 className="text-xs font-black text-white uppercase tracking-widest transition-colors group-hover:text-seafoam">{item.title}</h4>
                           <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-seafoam group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section 3: Counselor Text-Portal */}
           <div className="stagger-el glass-card rounded-[48px] p-10 flex flex-col shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-14 h-14 nordic-gradient rounded-2xl flex items-center justify-center text-obsidian shadow-lg shadow-cyan/20">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Confidential Portal</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End-to-End Encrypted</p>
                 </div>
              </div>

              <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col h-full min-h-75">
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                    <Zap className="text-slate-500 mb-4" size={32} />
                    <p className="text-xs font-black uppercase text-white tracking-widest">Neural Link Offline</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-2">Counselor status: <span className="text-white">Available 09:00 - 17:30</span></p>
                 </div>
                 
                 <div className="relative mt-auto pt-6">
                    <textarea 
                       placeholder="Draft a confidential query..."
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-seafoam h-32 resize-none transition-all shadow-sm placeholder:text-slate-500"
                    />
                    <button 
                      onClick={handleTransfer}
                      disabled={isTransferring}
                      className="w-full py-4 nordic-gradient text-obsidian rounded-2xl font-black uppercase tracking-widest text-[10px] mt-4 shadow-xl shadow-cyan/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isTransferring ? 'Initializing Cipher...' : 'Secure Transfer'}
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-600 mt-4 uppercase tracking-[0.2em]">Zero-Knowledge Privacy Guaranteed</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Circadian Rhythm Analyzer */}
        <section className="stagger-el bg-obsidian rounded-[48px] p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                 <h2 className="text-4xl font-black tracking-tighter mb-6">Circadian Performance Matrix</h2>
                 <div className="flex gap-4 mb-8">
                    <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                       <Sun className="text-cyber-amber" size={20} />
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awake Duration</p>
                          <p className="text-xl font-black">14.2 Hours</p>
                       </div>
                    </div>
                    <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                       <Moon className="text-cyan" size={20} />
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last SLEEP SYNC</p>
                          <p className="text-xl font-black">6.5 Hours</p>
                       </div>
                    </div>
                 </div>
                 <p className="text-slate-400 font-medium max-w-sm">Neural baseline suggests a critical rest node is approaching. Probability of academic error increases <span className="text-cyber-red font-black">+240%</span> after midnight.</p>
              </div>

              <div className="flex-1 h-32 relative">
                 <div className="absolute inset-0 flex items-end gap-2">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div 
                        key={i} 
                    className={`flex-1 rounded-full transition-all ${i > 7 && i < 22 ? 'bg-seafoam' : 'bg-white/5'} h-[${Math.random() * 60 + 20}%] opacity-[${(i / 24) + 0.2}]`}
                      />
                    ))}
                 </div>
                 <div className="absolute -bottom-6 w-full flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                    <span>00:00</span>
                    <span className="text-cyber-amber">Current Phase</span>
                    <span>23:59</span>
                 </div>
              </div>
           </div>

           {/* Decorative */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px]" />
        </section>
      </div>
    </div>
  );
}
