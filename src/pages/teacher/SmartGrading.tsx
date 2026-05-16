import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  User, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  BarChart2,
  Brain
} from 'lucide-react';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import gsap from 'gsap';

const SubmissionCard = ({ student, status, score, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group ${active ? 'nordic-gradient border-seafoam text-obsidian shadow-xl shadow-cyan/10' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
  >
    <div className="flex items-center gap-4">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-obsidian/10' : 'bg-white/5'}`}>
          <User className={active ? 'text-obsidian' : 'text-slate-500'} size={20} />
       </div>
       <div>
          <h4 className={`text-sm font-black tracking-tight ${active ? 'text-obsidian' : 'text-white'}`}>{student}</h4>
          <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-obsidian/60' : 'text-slate-500'}`}>{status}</p>
       </div>
    </div>
    {score && (
       <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${active ? 'bg-obsidian/10 text-obsidian' : 'bg-seafoam/10 text-seafoam border border-seafoam/20'}`}>
          {score}%
       </div>
    )}
  </button>
);

export default function SmartGrading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSubmission, setSelectedSubmission] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [approvedList, setApprovedList] = useState<number[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setApprovedList([...approvedList, selectedSubmission]);
    }, 1500);
  };

  const submissions = [
    { student: "Davo Scholar", status: "Neural Verified", score: 98, content: "The quantum drift was calculated using a base-12 matrix. The observed variance matched the theoretical peak exactly.", feedback: "Exceptional metric alignment. Your derivation of the base-12 logic shows peak conceptual synthesis." },
    { student: "Sarah J.", status: "Pending Review", score: 85, content: "Initial states were stable but drifted significantly during the training loop. I attempted to stabilize via manual override.", feedback: "Your stabilization approach is novel, but you missed the covariance factor in the third loop. Focus on drift automation." },
    { student: "Mark R.", status: "Needs Rework", score: 42, content: "I don't understand the observer effect. The data just looks like white noise in the simulation.", feedback: "Significant conceptual block detected. Please review the 'Observer Foundations' module before attempting the next lab." }
  ];

  const currentSub = submissions[selectedSubmission];
  const isApproved = approvedList.includes(selectedSubmission);

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 nordic-gradient rounded-lg">
                 <ClipboardCheck className="text-obsidian" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Academic Validation Node</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Smart Grading</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-tight">AI-assisted evaluation matrix for precision feedback delivery.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Grading Velocity</p>
                   <p className="text-xl font-black text-white">12 Sub/Hr</p>
                </div>
                <div className="w-10 h-10 rounded-full nordic-gradient flex items-center justify-center text-obsidian">
                   <Sparkles size={20} />
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left: Submission List */}
           <div className="lg:col-span-4 stagger-el flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Submissions (Block 7)</h3>
              {submissions.map((sub, i) => (
                <SubmissionCard 
                  key={i} 
                  student={sub.student} 
                  status={approvedList.includes(i) ? "Validated" : sub.status} 
                  score={sub.score}
                  active={selectedSubmission === i}
                  onClick={() => setSelectedSubmission(i)}
                />
              ))}
           </div>

           {/* Right: Review Pane */}
           <div className="lg:col-span-8 stagger-el grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Student Work View */}
              <div className="glass-card rounded-[40px] p-8 flex flex-col shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-slate-500" size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Student Artifact</h3>
                 </div>
                 <div className="flex-1 bg-white/5 rounded-3xl p-6 text-sm text-slate-300 leading-relaxed font-medium border border-white/10">
                    {currentSub.content}
                 </div>
              </div>

              {/* AI Analysis View */}
              <div className="bg-obsidian rounded-[40px] p-8 text-white flex flex-col shadow-2xl relative overflow-hidden border border-white/10">
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <Brain className="text-seafoam" size={20} />
                          <h3 className="text-xs font-black uppercase tracking-widest text-seafoam">AI Evaluation Node</h3>
                       </div>
                       <div className="px-3 py-1 bg-seafoam/10 rounded-full text-seafoam font-black text-[9px] uppercase tracking-widest border border-seafoam/10">
                          Confidence: 98%
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Automated Grading Draft</p>
                          <div className="text-4xl font-black text-white">{currentSub.score ? `${currentSub.score}%` : '---'}</div>
                       </div>

                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[9px] font-black uppercase tracking-widest text-seafoam mb-2">Suggesting Feedback</p>
                          <p className="text-xs text-slate-400 leading-relaxed italic">
                             "{currentSub.feedback}"
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Clarity</p>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-seafoam w-[90%]" />
                             </div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Complexity</p>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan w-[85%]" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 flex gap-4 mt-auto pt-8">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApprove}
                      disabled={isApproving || isApproved}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isApproved ? 'bg-emerald-500 text-obsidian' : 'nordic-gradient text-obsidian shadow-xl shadow-cyan/10'}`}
                    >
                       {isApproving ? (
                         <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
                            <span>Validating Neural Sync...</span>
                         </div>
                       ) : isApproved ? (
                         <>
                           <CheckCircle2 size={14} />
                           <span>Validated & Deployed</span>
                         </>
                       ) : (
                         <>
                           Approve & Deploy <ArrowRight size={14} />
                         </>
                       )}
                    </motion.button>
                 </div>

                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
              </div>
           </div>
        </div>

        {/* Global Stats Section */}
        <section className="stagger-el grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Total Assignments", value: "142", icon: ClipboardCheck, color: "text-seafoam" },
             { label: "Needs Grading", value: "28", icon: AlertCircle, color: "text-cyber-amber" },
             { label: "Average Score", value: "82.4%", icon: BarChart2, color: "text-cyan" },
             { label: "Synched Today", value: "12", icon: CheckCircle2, color: "text-emerald-500" }
           ].map((stat, i) => (
             <div key={i} className="glass-card p-8 rounded-[32px] flex items-center gap-6 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center bg-white/5 ${stat.color}`}>
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                </div>
             </div>
           ))}
        </section>
      </div>
    </div>
  );
}
