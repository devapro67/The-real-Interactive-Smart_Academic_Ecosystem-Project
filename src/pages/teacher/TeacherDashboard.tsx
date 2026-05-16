import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Plus,
  BarChart3,
  BrainCircuit,
  ClipboardCheck,
  LucideIcon
} from 'lucide-react';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import gsap from 'gsap';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, unit, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20 flex items-center justify-center`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  </div>
);

interface TeacherActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  stats?: { label: string; value: string }[];
  path: string;
}

const TeacherActionCard = ({ title, description, icon: Icon, color, stats, path }: TeacherActionCardProps) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => path && navigate(path)}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col"
    >
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform`}>
          <Icon className="text-white" size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{description}</p>
        
        {stats && (
          <div className="space-y-3 mb-6">
            {stats.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                <span className="text-xs font-black text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mt-auto">
          Compute Terminal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default function TeacherDashboard() {
  const { user } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.stagger-card');
      gsap.fromTo(cards, 
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

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 overflow-x-hidden min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 stagger-card">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-seafoam" size={20} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-seafoam/70">Faculty Node Active</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
              Greetings, {user?.full_name?.split(' ')[1] || 'Instructor'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Command center status: <span className="text-emerald-500">Synchronized</span></p>
          </div>

          <div className="flex items-center gap-4">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleCreate}
               disabled={isCreating}
               className="nordic-gradient text-obsidian px-6 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-cyan/20 flex items-center gap-3 disabled:opacity-50 transition-all"
             >
               {isCreating ? <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" /> : <Plus size={16} />} 
               {isCreating ? 'Synchronizing Neural Core...' : 'Create Curriculum'}
             </motion.button>
          </div>
        </header>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-card">
          <StatCard title="Total Students" value="156" unit="Active" icon={Users} color="bg-seafoam" />
          <StatCard title="Average Performance" value="84" unit="%" icon={TrendingUp} color="bg-emerald-500" />
          <StatCard title="Submission Rate" value="92" unit="%" icon={CheckCircle} color="bg-cyber-amber" />
          <StatCard title="Interactions" value="1.2k" unit="Session" icon={MessageSquare} color="bg-cyan" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 stagger-card">
          <TeacherActionCard 
            title="AI Assignment Builder"
            description="Generate high-fidelity assignments and assessments using our neural curriculum engine."
            icon={BrainCircuit}
            color="bg-seafoam"
            path="/teacher/assignments"
            stats={[
              { label: 'Active Drafts', value: '4' },
              { label: 'Generated Today', value: '12' }
            ]}
          />
          <TeacherActionCard 
            title="Smart Grading Assistant"
            description="Review AI-suggested grades and feedback packets for immediate student delivery."
            icon={ClipboardCheck}
            color="bg-cyan"
            path="/teacher/grading"
            stats={[
              { label: 'Pending Review', value: '28' },
              { label: 'Accuracy Rating', value: '98.4%' }
            ]}
          />
          <TeacherActionCard 
            title="Performance Insights"
            description="Deep-dive into class-wide metrics and individual student learning trajectories."
            icon={BarChart3}
            color="bg-obsidian"
            path="/teacher/analytics"
            stats={[
              { label: 'Alerts', value: '3 Critical' },
              { label: 'Retention', value: '+12.4%' }
            ]}
          />
          <TeacherActionCard 
            title="Global Conversations"
            description="Broadcast tactical school updates or individual parent messages via secure cipher."
            icon={MessageSquare}
            color="bg-cyber-red"
            path="/teacher/communications"
            stats={[
              { label: 'Open Channels', value: '42' },
              { label: 'Read Rate', value: '92%' }
            ]}
          />
        </div>

        {/* Live Active Feed */}
        <div className="glass-card rounded-[48px] p-12 border border-slate-100 shadow-xl shadow-slate-100 stagger-card overflow-hidden relative">
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Class Node Status</h3>
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">All Systems Normal</span>
          </div>
          
          <div className="relative z-10 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 nordic-gradient rounded-2xl flex items-center justify-center font-black text-obsidian">
                      {i === 1 ? 'CS' : i === 2 ? 'PHYS' : 'MATH'}
                   </div>
                   <div>
                     <p className="text-lg font-black text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors">
                       {i === 1 ? 'Introduction to Quantum Logic' : i === 2 ? 'Advanced Astrophysics V' : 'Linear Algebra Foundations'}
                     </p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section {100 + i} • 54 Students Enrolled</p>
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="text-right hidden md:block">
                      <p className="text-xs font-black text-slate-900">88% Completion</p>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-seafoam rounded-full" style={{ width: '88%' }} />
                      </div>
                   </div>
                   <button className="p-3 bg-white border border-slate-100 rounded-xl transition-colors hover:bg-slate-50">
                      <MoreVertical size={20} className="text-slate-400" />
                   </button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 blur-[120px]" />
        </div>
      </div>
    </div>
  );
}

const MoreVertical = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
