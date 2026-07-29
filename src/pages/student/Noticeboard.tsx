import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Megaphone, 
  Clock, 
  MapPin, 
  Share2, 
  CheckCircle2, 
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import BackgroundUniverse from '../../components/LazyBackgroundUniverse';
import gsap from 'gsap';

interface Notice {
  type: string;
  title: string;
  content: string;
  time: string;
  location: string;
}

const NoticeCard = ({ notice }: { notice: Notice }) => {
  const [read, setRead] = useState(false);
  
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      case 'ACADEMIC': return 'bg-indigo-600';
      case 'CAMPUS LIFE': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <motion.div 
      layout
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-[40px] p-8 shadow-sm transition-all duration-300 relative group overflow-hidden ${read ? 'opacity-60' : 'opacity-100 scale-[1.01] border-indigo-200/50'}`}
    >
      <div className="flex flex-col md:flex-row gap-8">
         <div className="shrink-0">
            <div className={`px-4 py-1.5 rounded-full text-white font-black text-[9px] uppercase tracking-widest inline-block ${getUrgencyStyles(notice.type)}`}>
               {notice.type}
            </div>
            <div className="mt-4 flex flex-col gap-2">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={12} /> {notice.time}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MapPin size={12} /> {notice.location}
               </div>
            </div>
         </div>

         <div className="grow">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
               {notice.title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mb-8">
               {notice.content}
            </p>
            
            <div className="flex items-center gap-6">
               <button 
                  onClick={() => setRead(!read)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${read ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
               >
                  <CheckCircle2 size={14} /> {read ? 'Neural Verified' : 'Acknowledge Receipt'}
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  <Share2 size={14} /> Broadcast
               </button>
            </div>
         </div>

         {!read && (
            <div className="absolute right-8 top-8">
               <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping" />
            </div>
         )}
      </div>
    </motion.div>
  );
};

export default function Noticeboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const notices: Notice[] = [
    { 
      type: "CRITICAL", 
      title: "Network Expansion Downtime", 
      content: "Neural link nodes in Block C will undergo protocol upgrades from 02:00 to 05:00. Biometric scanners may require manual override during this window. Ensure all data-syncs are committed before midnight.",
      time: "2h ago",
      location: "Central Node"
    },
    { 
      type: "ACADEMIC", 
      title: "Applied Calculus Symposium", 
      content: "Guest lecture invitation from high-orbit academic faculty. Mandatory for Level-3 scholars. Deep-dive into multivariate optimization vectors in low-gravity environments.",
      time: "5h ago",
      location: "Auditorium VI"
    },
    { 
      type: "CAMPUS LIFE", 
      title: "Gravity-Free Sports Trials", 
      content: "Registration now open for interstellar ball. No neural kinetic enhancers permitted for first-round qualifiers. Please report to the sports cluster for biometric baseline profiling.",
      time: "Yesterday",
      location: "North Hangar"
    },
    { 
      type: "ACADEMIC", 
      title: "Final Thesis Matrix Layout", 
      content: "Protocols for the digital submission of cognitive verified thesis drafts have been updated. Ensure you are using the Orpheus v4.2 publishing toolkit for 100% compliance.",
      time: "2 days ago",
      location: "Cloud Archive"
    }
  ];

  const filteredNotices = filter === 'ALL' ? notices : notices.filter(n => n.type === filter);

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-rose-500 rounded-lg">
                 <Bell className="text-white" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500/70">Information Flow</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Global Noticeboard</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">Real-time broadcast vectors for academic, tactical, and social updates.</p>
          </div>

          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-sm">
             <Filter size={16} className="ml-2 text-slate-400" />
             <div className="flex gap-1">
                {['ALL', 'CRITICAL', 'ACADEMIC'].map(t => (
                  <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                  {t}
                  </button>
                ))}
             </div>
          </div>
        </header>

        <section className="stagger-el grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-indigo-600 rounded-4xl p-8 text-white flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Safety Alerts</p>
                 <p className="text-3xl font-black tracking-tighter">Zero Threat</p>
              </div>
              <ShieldCheck size={48} className="opacity-20" />
           </div>
           <div className="bg-rose-500 rounded-4xl p-8 text-white flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-rose-200 mb-1">Unread Urgents</p>
                 <p className="text-3xl font-black tracking-tighter">1 Pending</p>
              </div>
              <AlertCircle size={48} className="opacity-20" />
           </div>
           <div className="bg-slate-900 rounded-4xl p-8 text-white flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Neural Synced</p>
                 <p className="text-3xl font-black tracking-tighter">100%</p>
              </div>
              <Megaphone size={48} className="opacity-20" />
           </div>
        </section>

        <div className="stagger-el space-y-6">
           <AnimatePresence mode="popLayout">
              {filteredNotices.map((notice, i) => (
                 <NoticeCard key={notice.title} notice={notice} />
              ))}
           </AnimatePresence>
        </div>

        <div className="stagger-el flex justify-center py-12">
           <button className="px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-4xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 hover:border-indigo-600/50 transition-all">
              Load Archival Broadcasts
           </button>
        </div>
      </div>
    </div>
  );
}
