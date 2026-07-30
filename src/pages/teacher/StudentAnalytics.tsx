import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  TrendingDown,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

const StudentRow = ({ name, id, gpa, attendance, risk, trend }: any) => (
  <tr className="border-b border-white/5 hover:bg-white/10 transition-colors group">
    <td className="py-6 px-10">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl nordic-gradient flex items-center justify-center font-black text-obsidian text-xs">
             {name[0]}
          </div>
          <div>
             <p className="text-sm font-black text-white leading-none mb-1 group-hover:text-seafoam transition-colors">{name}</p>
             <p className="text-[10px] font-medium text-slate-500">#{id}</p>
          </div>
       </div>
    </td>
    <td className="py-6 px-4">
       <div className="flex items-center gap-2">
          <span className="text-sm font-black text-white">{gpa}</span>
          {trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-cyber-red" />}
       </div>
    </td>
    <td className="py-6 px-4 font-bold text-slate-400 text-sm">{attendance}%</td>
    <td className="py-6 px-4">
       <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-seafoam" style={{ width: `${(gpa / 4) * 100}%` }} />
       </div>
    </td>
    <td className="py-full px-4">
       {risk === 'high' ? (
         <div className="px-3 py-1 bg-cyber-red/10 text-cyber-red rounded-full text-[9px] font-black uppercase tracking-widest border border-cyber-red/10 inline-flex items-center gap-2">
            <AlertTriangle size={10} /> Critical
         </div>
       ) : risk === 'moderate' ? (
         <div className="px-3 py-1 bg-cyber-amber/10 text-cyber-amber rounded-full text-[9px] font-black uppercase tracking-widest border border-cyber-amber/10 inline-flex items-center gap-2">
            <TrendingDown size={10} /> Drifting
         </div>
       ) : (
         <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/10 inline-flex items-center gap-2">
            Stable
         </div>
       )}
    </td>
    <td className="py-6 px-10 text-right">
       <button className="p-3 glass-card border border-white/10 rounded-2xl text-slate-500 hover:text-seafoam hover:border-seafoam transition-all shadow-sm">
          <Activity size={16} />
       </button>
    </td>
  </tr>
);

export default function StudentAnalytics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntervening, setIsIntervening] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleIntervention = () => {
    setIsIntervening(true);
    setTimeout(() => {
      setIsIntervening(false);
      alert('Intervention Packets Transmitted successfully to identified student nodes.');
    }, 2500);
  };

  const students = [
    { name: "John Doe", id: "572918", gpa: 3.8, attendance: 98, risk: "none", trend: "up" },
    { name: "Alice Smith", id: "572922", gpa: 2.1, attendance: 72, risk: "high", trend: "down" },
    { name: "Bob Wilson", id: "572935", gpa: 3.2, attendance: 88, risk: "moderate", trend: "down" },
    { name: "Emma Watson", id: "572944", gpa: 4.0, attendance: 100, risk: "none", trend: "up" },
    { name: "Mike Ross", id: "572951", gpa: 2.9, attendance: 82, risk: "moderate", trend: "down" }
  ];

  const atRiskStudents = students.filter(s => s.risk !== 'none');

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
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Neural Collective Monitor</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Student Analytics</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">Real-time performance monitoring and early warning matrix.</p>
          </div>

          <div className="flex gap-4">
             <div className="glass-card p-2 rounded-2xl flex items-center gap-2">
                <div className="px-4 py-2 nordic-gradient text-obsidian rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-cyan/20">Roster</div>
                <div className="px-4 py-2 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all">Reports</div>
                <div className="px-4 py-2 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all">Matrix</div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Main Ledger */}
           <div className="lg:col-span-8 stagger-el space-y-6">
              <div className="glass-card rounded-[48px] overflow-hidden shadow-sm">
                 <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <h3 className="text-sm font-black uppercase tracking-widest text-white">Student Roster</h3>
                       <div className="flex items-center gap-4 text-slate-500">
                          <Search size={16} className="cursor-pointer hover:text-seafoam transition-colors" />
                          <Filter size={16} className="cursor-pointer hover:text-seafoam transition-colors" />
                       </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total: {students.length} Synchronized</div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">
                             <th className="py-4 px-10">Identity</th>
                             <th className="py-4 px-4">GPA/Trend</th>
                             <th className="py-4 px-4">Presence</th>
                             <th className="py-4 px-4">Academic Lift</th>
                             <th className="py-4 px-4">Status</th>
                             <th className="py-4 px-10 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="px-4">
                          {students.map((student, i) => (
                             <StudentRow key={i} {...student} />
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Side Warning System */}
           <div className="lg:col-span-4 space-y-8">
              {/* Early Warning System Card */}
              <div className="stagger-el bg-obsidian rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 rounded-2xl bg-cyber-red/20 flex items-center justify-center text-cyber-red border border-cyber-red/10">
                          <AlertTriangle size={20} />
                       </div>
                       <div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-cyber-red">Early Warning System</h3>
                          <p className="text-[10px] text-slate-600 font-bold tracking-tight">Drift Detection Active</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {atRiskStudents.map((s, i) => (
                         <div key={i} className="group p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                               <p className="text-sm font-black text-white group-hover:text-seafoam transition-colors">{s.name}</p>
                               <span className="text-[10px] font-black text-cyber-red bg-cyber-red/10 px-2 py-0.5 rounded-full border border-cyber-red/10">-{ (4 - s.gpa).toFixed(1) } Deviation</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">System predicts a -12% grade shift in the next 2 cycles without intervention.</p>
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={handleIntervention}
                      disabled={isIntervening}
                      className="w-full mt-10 py-5 nordic-gradient text-obsidian rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isIntervening ? 'Broadcasting Protocol...' : 'Deploy Mass Intervention'}
                    </button>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 blur-[100px]" />
              </div>

              {/* Achievement Matrix */}
              <div className="stagger-el glass-card p-10 rounded-[48px]">
                 <div className="flex items-center gap-3 mb-8 text-seafoam">
                    <Award size={20} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Global Achievements</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Peak GPA</p>
                       <p className="text-3xl font-black text-white">4.0</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Collective</p>
                       <p className="text-3xl font-black text-seafoam">92%</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
