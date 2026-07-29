import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight,
  Calculator,
  Brain,
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sem 1', gpa: 3.2 },
  { name: 'Sem 2', gpa: 3.4 },
  { name: 'Sem 3', gpa: 3.1 },
  { name: 'Sem 4', gpa: 3.7 },
  { name: 'Sem 5', gpa: 3.6 },
  { name: 'Sem 6', gpa: 3.8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border-none rounded-2xl p-4 shadow-2xl">
        <p className="text-white text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-indigo-400 text-sm font-bold">GPA: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function GradeAnalyzer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-500 rounded-lg">
                 <BarChart3 className="text-white" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500/70">Performance Metrics</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Grade Analyzer</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">ML-driven probability modeling for academic trajectory optimization.</p>
          </div>

          <div className="flex gap-4">
             <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-sm flex items-center gap-4">
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cumulative GPA</p>
                   <p className="text-2xl font-black text-slate-900">3.64</p>
                </div>
                <div className="w-px h-10 bg-slate-200/50" />
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Rank</p>
                   <p className="text-2xl font-black text-indigo-600">Top 5%</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Section 1: Progress Analytics */}
           <div className="lg:col-span-2 stagger-el bg-white/10 backdrop-blur-md border border-white/20 rounded-4xl p-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic Trend Vector</h3>
                 <select 
                    aria-label="Filter semester results"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none">
                    <option>All Semesters</option>
                    <option>Year 3 only</option>
                 </select>
              </div>

              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                       <defs>
                          <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                       <YAxis hide={true} domain={[0, 4.5]} />
                       <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4f46e5', strokeWidth: 2 }} />
                       <Area type="monotone" dataKey="gpa" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10">
                 {[
                   { label: "Stability", value: "88%", color: "text-emerald-500" },
                   { label: "Velocity", value: "+12.4%", color: "text-indigo-600" },
                   { label: "Target Prob.", value: "94%", color: "text-fuchsia-600" }
                 ].map((metric, i) => (
                   <div key={i} className="text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{metric.label}</p>
                     <p className={`text-xl font-black ${metric.color}`}>{metric.value}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Section 2: AI Alerts & Predictions */}
           <div className="stagger-el flex flex-col gap-8">
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex-1 shadow-2xl">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                       <Brain className="text-indigo-500" size={20} />
                       <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Neural Warnings</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4">
                          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                          <div>
                             <h4 className="text-xs font-black uppercase tracking-widest mb-1">Mathematics Downward Drift</h4>
                             <p className="text-[11px] text-slate-400 font-medium">Model predicts a 8% dip in Semester 7 based on current participation metrics.</p>
                          </div>
                       </div>
                       <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10 flex gap-4">
                          <TrendingUp className="text-emerald-500 shrink-0" size={18} />
                          <div>
                             <h4 className="text-xs font-black uppercase tracking-widest mb-1">Physics Velocity Peak</h4>
                             <p className="text-[11px] text-slate-400 font-medium">Optimal comprehension detected. Recommended: Take Honors Physics next quarter.</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-3xl" />
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 flex flex-col justify-between shadow-sm border-t-8 border-t-indigo-600">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">GPA Simulator</h3>
                    <p className="text-slate-500 text-[11px] font-medium mb-6">Target 4.0? Required Sem 7: <span className="text-slate-900 font-black">3.95</span></p>
                    
                    <div className="space-y-4">
                       <input 
                         type="range" 
                         aria-label="Adjust GPA target slider"
                         className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                       />
                       <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-xl">
                          <Calculator size={16} className="text-slate-400" />
                          <span className="text-lg font-black text-slate-900">3.88</span>
                          <ArrowUpRight size={16} className="text-indigo-600" />
                       </div>
                    </div>
                 </div>
                 <button 
                   aria-label="Commit simulated goal to academic targets"
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] mt-8 hover:bg-black transition-colors">
                    Commit To Target
                 </button>
              </div>
           </div>
        </div>

        {/* Section 3: Subject Matrix */}
        <div className="stagger-el">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cognitive Domain Breakdown</h3>
              <button 
                aria-label="Export grade transcript as PDF"
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Export Transcript</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { subject: "Mathematics", grade: "A-", rank: "Top 12%", color: "text-indigo-600" },
                { subject: "Quantum Physics", grade: "A+", rank: "Top 2%", color: "text-fuchsia-600" },
                { subject: "History", grade: "B+", rank: "Top 25%", color: "text-amber-500" },
                { subject: "Economics", grade: "A", rank: "Top 8%", color: "text-emerald-500" }
              ].map((sub, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:scale-105 transition-all cursor-pointer">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{sub.subject}</p>
                   <div className="flex items-baseline gap-3">
                      <span className={`text-4xl font-black ${sub.color}`}>{sub.grade}</span>
                      <span className="text-xs font-bold text-slate-500">{sub.rank}</span>
                   </div>
                   <div className="h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
                      <div className="h-full bg-slate-200 w-3/4" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
