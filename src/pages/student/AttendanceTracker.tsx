import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

const AttendanceRing = ({ percentage, color }: { percentage: number, color: string }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
       <svg className="w-full h-full transform -rotate-90">
         <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
         <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`${color} transition-all duration-1000`} strokeLinecap="round" />
       </svg>
       <div className="absolute flex flex-col items-center">
         <span className={`text-4xl font-black tracking-tighter ${color.replace('text-', 'text-')}`}>{percentage}%</span>
         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Sync</span>
       </div>
    </div>
  );
};

export default function AttendanceTracker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const subjects = [
    { name: "Advanced Neural Networks", attended: 28, total: 30, percent: 93, status: "Secure", color: "bg-emerald-500" },
    { name: "Quantum Computing Lab", attended: 22, total: 24, percent: 91, status: "Secure", color: "bg-emerald-500" },
    { name: "Applied Bio-Ethics", attended: 17, total: 20, percent: 85, status: "Warning", color: "bg-amber-500" },
    { name: "Interstellar Law", attended: 10, total: 15, percent: 66, status: "Critical", color: "bg-rose-500" }
  ];

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-500 rounded-lg">
                 <Users className="text-white" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/70">Compliance Node</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Attendance Matrix</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">Biometric verification logs and academic presence distribution tracking.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-sm">
             <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Baseline Verified</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Section 1: Global Metric */}
           <div className="stagger-el">
              <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden h-full shadow-2xl flex flex-col items-center justify-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-10">Global Presence Vector</h3>
                 <AttendanceRing percentage={89} color="text-emerald-500" />
                 
                 <div className="mt-12 text-center max-w-xs">
                    <p className="text-xs font-bold text-slate-400 leading-relaxed">
                       You are currently <span className="text-emerald-400 font-black">+4%</span> above the mandatory 85% safety threshold. Your academic standing is currently <span className="text-white font-black">STABLE</span>.
                    </p>
                 </div>

                 <div className="absolute bottom-0 left-0 w-full p-8 border-t border-white/5 mt-auto">
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                       Download Compliance Certificate
                    </button>
                 </div>
              </div>
           </div>

           {/* Section 2: Safety Warnings */}
           <div className="lg:col-span-2 stagger-el flex flex-col gap-8">
              <div className="bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 rounded-[48px] p-10 flex items-center justify-between relative overflow-hidden shadow-sm group hover:scale-[1.01] transition-all">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                       <ShieldAlert className="text-rose-500" size={24} />
                       <h3 className="text-sm font-black uppercase tracking-widest text-rose-500">Security Restriction Warning</h3>
                    </div>
                    <p className="text-2xl font-black text-rose-900 tracking-tight mb-2">Interstellar Law is at 66%</p>
                    <p className="text-xs font-medium text-rose-800/60 max-w-md">3 more absences will trigger automatic module suspension. Contact faculty immediately for medical-override protocols.</p>
                 </div>
                 <div className="relative z-10 text-rose-500 flex flex-col items-center">
                    <span className="text-6xl font-black leading-none">-19%</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Below Threshold</span>
                 </div>
                 {/* Decorative */}
                 <div className="absolute right-0 top-0 w-64 h-full bg-rose-500/5 blur-[80px]" />
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[48px] p-10 h-full">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Module Breakdown</h3>
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                       <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Secure</span>
                       <span className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-amber-500" /> Warning</span>
                       <span className="flex items-center gap-1.5"><XCircle size={12} className="text-rose-500" /> Critical</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {subjects.map((sub, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-5">
                          <div className={`w-3 h-3 rounded-full ${sub.color}`} />
                          <div>
                            <p className="text-slate-900 font-bold tracking-tight">{sub.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attended: {sub.attended} / {sub.total} sessions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right">
                              <p className={`text-lg font-black tracking-tighter ${sub.color.replace('bg-', 'text-')}`}>{sub.percent}%</p>
                              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{sub.status}</p>
                           </div>
                           <ArrowUpRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Calendar Matrix Section */}
        <section className="stagger-el bg-white/5 backdrop-blur-md border border-white/10 rounded-[48px] p-12 overflow-hidden">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Historical Presence Log</h3>
              <div className="flex items-center gap-2">
                 <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">May 2026</button>
                 <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><Clock size={16} /></button>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`aspect-square rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all cursor-pointer hover:scale-105 active:scale-95 ${i % 7 === 0 || i % 7 === 6 ? 'bg-slate-100/50 border-slate-100 text-slate-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-sm shadow-emerald-100/20'}`}>
                  {i + 1}
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
