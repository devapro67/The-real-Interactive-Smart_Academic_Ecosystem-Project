import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  ShieldCheck, 
  ToggleLeft as Toggle, 
  ToggleRight as ToggleActive,
  Activity,
  Check,
  Search,
  Plus
} from 'lucide-react';
import { BackgroundUniverse } from '../../components/VisualEcosystem';
import gsap from 'gsap';

export default function TeacherComms() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [readReceipts, setReadReceipts] = useState(true);
  const [deliveryAnalytics, setDeliveryAnalytics] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sentLogs, setSentLogs] = useState([
    { id: "Broadcast-12", status: "Delivered", time: "2m ago" },
    { id: "Grade Report-A", status: "Read", time: "14m ago" },
    { id: "Emergency-01", status: "Acknowledged", time: "2h ago" }
  ]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-el'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSend = () => {
    if (!message) return;
    setIsSending(true);
    
    setTimeout(() => {
      setIsSending(false);
      setSentLogs(prev => [{
        id: `TX-${Math.floor(Math.random() * 1000)}`,
        status: "Transmitted",
        time: "Just Now"
      }, ...prev]);
      setMessage('');
      setRecipient('');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pb-20" ref={containerRef}>
      <BackgroundUniverse />
      
      <div className="relative z-10 space-y-12">
        <header className="stagger-el flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 nordic-gradient rounded-lg">
                 <MessageSquare className="text-obsidian" size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-seafoam/70">Parent-Faculty Synapse</h2>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">Communications</h1>
            <p className="text-slate-400 mt-2 font-medium tracking-tight">Deploy high-priority broadcasts and peer-to-peer messages.</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="p-4 glass-card rounded-[24px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl nordic-gradient flex items-center justify-center text-obsidian">
                   <Activity size={24} />
                </div>
                <div className="pr-4">
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Channels</p>
                   <p className="text-xl font-black text-white leading-none mt-1">42</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Message Composer */}
           <div className="lg:col-span-7 stagger-el">
              <div className="glass-card rounded-[48px] p-10 flex flex-col shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 ml-2">New Broadcast Cipher</h3>
                 
                 <div className="space-y-8">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Recipients</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Select Grade level or individual Parent ID..." 
                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-seafoam transition-all shadow-sm"
                          />
                          <Plus className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Signal Payload</label>
                       <textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your strategic update here..."
                          className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-8 text-sm font-bold text-white outline-none focus:border-seafoam transition-all h-64 resize-none shadow-sm leading-relaxed"
                       />
                    </div>

                    <div className="flex flex-wrap items-center gap-8 px-2">
                       <div className="flex items-center gap-3">
                          <button onClick={() => setReadReceipts(!readReceipts)} className="text-seafoam">
                             {readReceipts ? <ToggleActive size={32} /> : <Toggle size={32} className="text-slate-700" />}
                          </button>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-white">Read Receipts</p>
                             <p className="text-[9px] text-slate-500 font-bold">Track visual engagement</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button onClick={() => setDeliveryAnalytics(!deliveryAnalytics)} className="text-seafoam">
                             {deliveryAnalytics ? <ToggleActive size={32} /> : <Toggle size={32} className="text-slate-700" />}
                          </button>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-white">Delivery Analytics</p>
                             <p className="text-[9px] text-slate-500 font-bold">Real-time status monitoring</p>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleSend}
                      disabled={isSending || !message}
                      className="w-full py-6 nordic-gradient text-obsidian rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isSending ? (
                         <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
                           <span>Analyzing Payload Architecture...</span>
                         </div>
                       ) : (
                         <>
                           <Send size={18} />
                           <span>Deploy Message</span>
                         </>
                       )} 
                    </button>
                 </div>
              </div>
           </div>

           {/* Activity Feed */}
           <div className="lg:col-span-5 stagger-el space-y-8">
              {/* Stats Card */}
              <div className="bg-obsidian rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                       <div className="p-3 bg-seafoam/10 rounded-2xl text-seafoam">
                          <Activity size={24} />
                       </div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-seafoam">Tactical Engagement</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Read Rate</p>
                          <p className="text-4xl font-black text-white">92.4%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Latency</p>
                          <p className="text-4xl font-black text-emerald-400">0.2s</p>
                       </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 space-y-4">
                       {sentLogs.map((log, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                               <ShieldCheck size={14} className="text-seafoam" />
                               <span className="text-xs font-bold text-slate-300">{log.id}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{log.status}</span>
                               <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{log.time}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
              </div>

              {/* Quick Contacts */}
              <div className="bg-white/40 backdrop-blur-md border border-white/20 p-10 rounded-[48px] shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center justify-between">
                    Strategic Contacts
                    <Search size={14} className="text-slate-400" />
                 </h3>
                 <div className="space-y-6">
                    {['Mr. Smith', 'Mrs. Johnson', 'Global Admin', 'Board of Education'].map((name, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               {name[0]}
                            </div>
                            <span className="text-sm font-black text-slate-900 leading-none">{name}</span>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
