import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  BrainCircuit, 
  Plus, 
  Sparkles, 
  FileText, 
  Target, 
  Trash2,
  ChevronRight,
  Brain
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

export default function AssignmentBuilder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const simulateGeneration = () => {
    if (!topic) return;
    setIsGenerating(true);
    setOutput('');
    
    // Initial analysis phase
    setTimeout(() => {
      let fullText = `### Lesson Plan: ${topic}\n\n**Objective:** Analyze core concepts and apply quantum-optimized methodologies.\n\n**Key Questions:**\n1. How does the observer effect influence initial data states?\n2. Map the trajectory of neural drift in a closed loop.\n\n**Grading Rubric:**\n- **A:** 95%+ precision in metric alignment.\n- **B:** Strong conceptual grasp with minor drift.\n\n**Curriculum Alignment:** Optimized for High-Velocity Academic Growth.`;
      
      let i = 0;
      const interval = setInterval(() => {
        setOutput(fullText.substring(0, i));
        i += 3;
        if (i > fullText.length) {
          clearInterval(interval);
          setIsGenerating(false);
        }
      }, 15);
    }, 1200); // Simulated "Analysis Phase"
  };

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-600 rounded-lg">
                 <BrainCircuit className="text-white" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600/70">Neural Curriculum Synthesis</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Assignment Builder</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">AI-accelerated pedagogy for high-fidelity lesson generation.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Parameters Input */}
           <div className="stagger-el bg-white/10 backdrop-blur-md border border-white/20 rounded-[48px] p-10 flex flex-col gap-8 shadow-sm">
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Topic / Subject</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Advanced Quantum Drift Foundations" 
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all shadow-sm"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Target Grade</label>
                       <select className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all">
                          <option>Honors / Level 4</option>
                          <option>A-Level</option>
                          <option>Undergrad</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Complexity Vector</label>
                       <select className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all">
                          <option>Peak State</option>
                          <option>Moderate</option>
                          <option>Baseline</option>
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Pedagogical Goals</label>
                    <textarea 
                       placeholder="Define specific neural outcomes..."
                       className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all h-32 resize-none shadow-sm"
                    />
                 </div>
              </div>

              <div className="flex gap-4 mt-auto">
                 <button 
                  onClick={simulateGeneration}
                  disabled={isGenerating || !topic}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                 >
                    {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Sparkles size={16} />} 
                    Synthesize Content
                 </button>
                 <button className="p-5 border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all">
                    <Trash2 size={20} />
                 </button>
              </div>
           </div>

           {/* Output Viewport */}
           <div className="stagger-el">
              <div className="bg-slate-900 rounded-[48px] p-10 text-white h-full relative overflow-hidden flex flex-col shadow-2xl">
                 <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-500/20 rounded-lg">
                          <FileText className="text-indigo-400" size={16} />
                       </div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Generation Preview</h3>
                    </div>
                    {output && !isGenerating && (
                       <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                          Commit to Portal <ChevronRight size={14} />
                       </button>
                    )}
                 </div>

                 <div className="relative z-10 flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar">
                    {output ? (
                       <div className="whitespace-pre-wrap text-slate-300">
                          {output}
                          {isGenerating && <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse" />}
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                          <Brain size={48} className="mb-6 text-indigo-400" />
                          <p className="text-xs font-black uppercase tracking-widest">Awaiting Neural Logic...</p>
                          <p className="text-[10px] mt-2 max-w-[200px]">Define parameters to start the synthesis process.</p>
                       </div>
                    )}
                 </div>

                 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px]" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
