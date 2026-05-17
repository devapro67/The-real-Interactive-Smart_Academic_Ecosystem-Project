import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Heart,
  MessageSquare,
  CheckCircle2,
  Bell,
  Library,
  Users,
  LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import gsap from 'gsap';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  color: string;
  stats?: { label: string; value: string }[];
}

const ModuleCard = ({ 
  icon: Icon, 
  title, 
  description, 
  path, 
  color,
  stats
}: ModuleCardProps) => {
  const navigate = useNavigate();
  return (
    <motion.button 
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="stagger-card group text-left glass-card rounded-4xl p-8 hover:bg-white/8 transition-all relative z-10 flex flex-col h-full"
    >
      <div className={`w-14 h-14 rounded-2xl ${color.includes('nordic') ? 'nordic-gradient' : color} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-6`}>
        <Icon className={color.includes('nordic') ? 'text-obsidian' : 'text-white'} size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-700 text-sm font-medium leading-relaxed mb-6 grow">{description}</p>
      
      {stats && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 border border-slate-100">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{s.label}</span>
              <span className="text-[10px] font-black text-slate-900">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-seafoam font-black uppercase tracking-widest text-[10px]">
        Interface Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

export default function StudentDashboard() {
  const { user } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 overflow-x-hidden min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-seafoam" size={20} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-seafoam/70">Scholar Identity Validated</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
              Welcome, {user?.full_name?.split(' ')[0] || 'Scholar'}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Ecosystem status: <span className="text-emerald-500 font-black">Optimal Cluster Health</span></p>
              <div className="h-1 w-1 bg-slate-400 rounded-full" />
              <p className="text-slate-800 font-medium uppercase tracking-widest text-[10px]">Current XP: <span className="text-seafoam font-black">{user?.points || 0}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-4 glass-card p-4 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
              <div className="w-10 h-10 bg-seafoam/10 rounded-2xl flex items-center justify-center border border-seafoam/20">
                <TrendingUp className="text-seafoam" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GPA Index</p>
                <p className="text-sm font-black text-slate-900">3.92</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan/10 rounded-2xl flex items-center justify-center border border-cyan/20">
                <Award className="text-cyan" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance</p>
                <p className="text-sm font-black text-slate-900">98%</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Queue */}
          <div className="lg:col-span-2 stagger-card">
            <div className="glass-card rounded-[48px] p-10 h-full border-slate-100 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 nordic-gradient rounded-xl">
                    <CheckCircle2 className="text-obsidian" size={18} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Task Queue</h3>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-seafoam hover:opacity-70 transition-opacity">Full Schedule</button>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Advanced Quantum Physics Quiz", due: "2 Hours", type: "Urgent", color: "bg-cyber-red" },
                  { title: "Neural Networks Lab Report", due: "Tomorrow", type: "Critical", color: "bg-cyber-amber" },
                  { title: "Applied Mathematics Problem Set", due: "3 Days", type: "Routine", color: "bg-emerald-500" }
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/50 rounded-4xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-center gap-5">
                      <div className={`w-3 h-3 rounded-full ${task.color} shadow-lg`} />
                      <div>
                        <p className="text-slate-900 font-bold tracking-tight">{task.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deadline: {task.due}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`px-3 py-1 rounded-full ${task.color} text-white font-black uppercase tracking-tighter text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                         {task.type}
                       </span>
                       <ArrowRight size={18} className="text-slate-300 group-hover:text-seafoam transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="stagger-card">
            <div className="bg-slate-900 rounded-[48px] p-10 text-white h-full relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Knowledge Velocity</h3>
                </div>
                <p className="text-4xl font-black tracking-tighter mb-6">+124% <span className="text-sm font-bold text-slate-400 tracking-normal ml-2">This session</span></p>
                
                <div className="space-y-6">
                   <div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                       <span>Logical Reasoning</span>
                       <span className="text-indigo-400">88%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full w-[88%]" />
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                       <span>Problem Solving</span>
                       <span className="text-fuchsia-400">72%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-fuchsia-500 rounded-full w-[72%]" />
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                       <span>Creative Output</span>
                       <span className="text-emerald-400">94%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                     </div>
                   </div>
                </div>
              </div>

              <div className="relative z-10 pt-10">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                  Generate Analytical Report
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px]" />
            </div>
          </div>
        </div>

        <section>
          <div className="stagger-card flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Available Neural Clusters</h2>
            <div className="h-px flex-1 bg-slate-200/20 mx-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModuleCard 
              icon={MessageSquare}
              title="Homework Helper"
              description="AI-powered assistance for your toughest assignments with step-by-step cognitive guidance."
              path="/homework-helper"
              color="nordic"
              stats={[
                { label: 'Active Chat', value: 'Quantum Physics' },
                { label: 'Tokens Rem.', value: '1.2k' }
              ]}
            />
            <ModuleCard 
              icon={Calendar}
              title="7-Day Study Planner"
              description="AI generated study schedules tailored to your exams and neural learning pace."
              path="/study-planner"
              color="nordic"
              stats={[
                { label: 'Next Session', value: '14:00 - Math' },
                { label: 'Compliance', value: '94%' }
              ]}
            />
            <ModuleCard 
              icon={CheckCircle2}
              title="Attendance Tracker"
              description="Monitor your presence logs and safety thresholds for academic standing compliance."
              path="/attendance"
              color="bg-emerald-500"
              stats={[
                { label: 'Overall', value: '89%' },
                { label: 'Status', value: 'Secure' }
              ]}
            />
            <ModuleCard 
              icon={Users}
              title="Collaboration Hub"
              description="Real-time peer synchronization and collective project management boards."
              path="/collaboration-hub"
              color="nordic"
              stats={[
                { label: 'Pending Task', value: 'Logic Quiz' }
              ]}
            />
            <ModuleCard 
              icon={Zap}
              title="Grade Analyzer"
              description="Deep analytics on your performance trends and target grade predictors using ML models."
              path="/grade-analyzer"
              color="bg-cyber-amber"
              stats={[
                { label: 'GPA', value: '3.64' }
              ]}
            />
            <ModuleCard 
              icon={Bell}
              title="Global Noticeboard"
              description="Real-time campus alerts, academic symposia, and tactical schedule broadcasts."
              path="/noticeboard"
              color="bg-cyber-red"
              stats={[
                { label: 'New Alerts', value: '2' }
              ]}
            />
            <ModuleCard 
              icon={Library}
              title="Resource Hub"
              description="Decentralized knowledge matrix for sharing crowd-sourced study guides and notes."
              path="/resource-hub"
              color="bg-slate-800"
            />
            <ModuleCard 
              icon={Heart}
              title="Wellness Center"
              description="Emotional recovery and cognitive state synchronization for peak performance."
              path="/wellness"
              color="nordic"
            />
          </div>
        </section>

        <section className="stagger-card glass-card rounded-[48px] p-12 relative overflow-hidden border-slate-100 shadow-2xl shadow-slate-100">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-seafoam/10 rounded-full text-seafoam font-black text-[10px] uppercase tracking-widest mb-6 border border-seafoam/20">
                <Heart size={14} /> Mental Wellness
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 text-slate-900">Ecosystem Balance</h2>
              <p className="text-slate-700 font-medium mb-8 max-w-xl text-lg leading-relaxed">
                Academic success starts with a healthy mind. Access our suite of mindfulness tools and mental health resources to stay at peak performance.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 nordic-gradient text-obsidian rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan/20"
              >
                Initialize Wellness Suite
              </motion.button>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="w-full md:w-72 h-72 nordic-gradient rounded-[40px] flex flex-col items-center justify-center p-8 text-center text-obsidian shadow-2xl relative group cursor-pointer transition-transform"
            >
               <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Sparkles className="mb-6 opacity-60" size={48} />
               <p className="text-xs font-black uppercase tracking-widest mb-1">Consistency Streak</p>
               <p className="text-5xl font-black">5 Days</p>
               <p className="text-[10px] uppercase text-obsidian/60 font-black mt-4 tracking-widest">Level 12 Scholar</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
