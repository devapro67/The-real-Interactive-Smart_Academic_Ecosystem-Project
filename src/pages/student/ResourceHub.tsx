import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  Flag, 
  User, 
  Loader2, 
  X,
  FileBox,
  FileIcon,
  ShieldAlert,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundUniverse } from '../../components/VisualEcosystem';

// --- Types ---
interface Resource {
  id: string;
  title: string;
  author: string;
  type: 'PDF' | 'DOCX' | 'PPTX';
  subject: string;
  downloads: number;
  timestamp: string;
  rating: number;
  size: string;
}

const SUBJECTS = ['All Subjects', 'Mathematics', 'Physics', 'Biology', 'History', 'Computer Science'];
const FILE_TYPES = ['All Types', 'PDF', 'DOCX', 'PPTX'];

// --- Helper Components ---

const FlagModal = ({ 
  isOpen, 
  onClose, 
  resourceTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  resourceTitle: string;
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [reasons, setReasons] = useState<string[]>([]);

  const toggleReason = (reason: string) => {
    setReasons(prev => prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('form');
      setReasons([]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[40px] border border-white shadow-2xl overflow-hidden"
      >
        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Flag Resource</h3>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-8">
                  You are reporting: <span className="font-bold text-slate-800">"{resourceTitle}"</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {['Inaccurate Content', 'Copyright Infringement', 'Improper Subject Classification'].map((reason) => (
                    <label 
                      key={reason}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        reasons.includes(reason) 
                          ? 'border-[#00F2FE] bg-[#00F2FE]/5' 
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        reasons.includes(reason) ? 'bg-[#00F2FE] border-[#00F2FE] text-white' : 'border-slate-300'
                      }`}>
                        {reasons.includes(reason) && <Check size={12} strokeWidth={4} />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={reasons.includes(reason)}
                        onChange={() => toggleReason(reason)}
                      />
                      <span className="text-sm font-bold text-slate-700">{reason}</span>
                    </label>
                  ))}
                  <button 
                    disabled={reasons.length === 0}
                    className="w-full mt-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:shadow-none"
                  >
                    Submit Flag
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Flag Registered</h3>
                <p className="text-sm text-slate-500">Moderation nodes synchronized.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

interface ResourceCardProps {
  resource: Resource;
  onFlag: () => void;
}

const ResourceCard = ({ 
  resource, 
  onFlag 
}: ResourceCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(resource.title);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group relative bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border transition-all duration-300 ${
        isHovered ? 'border-[#00F2FE]/40 shadow-[0_20px_50px_rgba(0,242,254,0.1)]' : 'border-white shadow-xl shadow-slate-100'
      }`}
    >
      {/* Flag Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onFlag(); }}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <Flag size={16} />
      </button>

      <div className="flex flex-col h-full">
        <div className="mb-6 relative h-16 w-16">
          <motion.div 
            animate={{ 
              x: mousePos.x * 20, 
              y: mousePos.y * 20,
              rotateX: mousePos.y * -10,
              rotateY: mousePos.x * 10
            }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              resource.type === 'PDF' ? 'bg-red-50 text-red-500' : 
              resource.type === 'DOCX' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
            }`}
          >
            <FileIcon size={32} />
          </motion.div>
          {/* Shadow Parallax Effect */}
          <motion.div 
            animate={{ 
              x: mousePos.x * 10, 
              y: mousePos.y * 10,
            }}
            className="absolute inset-0 w-16 h-16 bg-black/5 rounded-2xl blur-lg -z-10"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                {resource.subject}
             </span>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">• {resource.size}</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight group-hover:text-cyan-600 transition-colors">
            {resource.title}
          </h3>
          <div className="flex items-center gap-2 text-slate-500 mb-8">
            <User size={14} />
            <span className="text-[11px] font-bold">{resource.author}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-95">
            <Download size={14} />
            Download
          </button>
          
          <button 
            onClick={handleCopy}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center min-w-[50px] ${
              isCopied ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            {isCopied ? (
              <div className="flex items-center gap-2 px-1">
                <Check size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Copied!</span>
              </div>
            ) : <Copy size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function ResourceHub() {
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', title: 'Advanced Quantum Mechanics Vol I', author: 'Dr. Sarah Chen', type: 'PDF', subject: 'Physics', downloads: 1240, timestamp: '2h ago', rating: 4.8, size: '24.5 MB' },
    { id: '2', title: 'Late 20th Century Geopolitics', author: 'Prof. Marcus Vane', type: 'DOCX', subject: 'History', downloads: 856, timestamp: '5h ago', rating: 4.5, size: '1.2 MB' },
    { id: '3', title: 'Calculus III Comprehensive Guide', author: 'Alex Rivera', type: 'PPTX', subject: 'Mathematics', downloads: 3421, timestamp: '1d ago', rating: 4.9, size: '48.1 MB' },
    { id: '4', title: 'Neural Networks & Deep Learning', author: 'AI Research Lab', type: 'PDF', subject: 'Computer Science', downloads: 5620, timestamp: '3h ago', rating: 5.0, size: '12.8 MB' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [flaggingResource, setFlaggingResource] = useState<Resource | null>(null);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreResources();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isLoadingMore]);

  const loadMoreResources = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const timestamp = Date.now();
      const newResources: Resource[] = [
        { id: `res-${timestamp}-1`, title: 'Linear Algebra for Machine Learning', author: 'Gilbert S.', type: 'PDF', subject: 'Mathematics', downloads: 1020, timestamp: 'Just now', rating: 4.7, size: '15.2 MB' },
        { id: `res-${timestamp}-2`, title: 'Thermodynamics Problem Sets', author: 'Physics Dept', type: 'DOCX', subject: 'Physics', downloads: 450, timestamp: '10m ago', rating: 4.2, size: '0.8 MB' },
        { id: `res-${timestamp}-3`, title: 'Cellular Biology High-Res Slides', author: 'Bio Team', type: 'PPTX', subject: 'Biology', downloads: 890, timestamp: '1h ago', rating: 4.6, size: '65.4 MB' },
        { id: `res-${timestamp}-4`, title: 'OS Kernel Architecture Deep Dive', author: 'Unix Guru', type: 'PDF', subject: 'Computer Science', downloads: 2100, timestamp: '2h ago', rating: 4.9, size: '32.1 MB' },
      ];
      setResources(prev => [...prev, ...newResources]);
      setIsLoadingMore(false);
    }, 600);
  };

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All Subjects' || r.subject === selectedSubject;
      const matchesType = selectedType === 'All Types' || r.type === selectedType;
      return matchesSearch && matchesSubject && matchesType;
    });
  }, [resources, searchQuery, selectedSubject, selectedType]);

  return (
    <div className="relative min-h-full pb-20">
      <BackgroundUniverse />

      {/* Header Section */}
      <div className="relative z-10 p-12 lg:p-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-[#00F2FE] text-obsidian rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan/20">
                  Global Resource Nodes
                </div>
                <div className="h-px w-12 bg-slate-200" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800 leading-[0.85] mb-8">
                Resource <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Hub Repository</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                 Access an elite matrix of academic assets synchronized via the Gemini 3 telemetry system. Indexing over 1.2M files.
              </p>
            </div>
            
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00F2FE] transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search high-fidelity assets..."
                className="w-full bg-white border-2 border-slate-100 rounded-3xl pl-16 pr-8 py-6 text-sm text-slate-800 outline-none focus:border-[#00F2FE]/50 shadow-2xl shadow-slate-100 transition-all font-bold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Filters Row 1: Subject */}
          <div className="flex flex-wrap gap-4 mb-6">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedSubject === subject 
                    ? 'bg-slate-800 text-white shadow-xl shadow-slate-200 scale-105' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Filters Row 2: File Extension */}
          <div className="flex flex-wrap gap-3 mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4 self-center">Format Extension:</span>
            {FILE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                  selectedType === type 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onFlag={() => setFlaggingResource(resource)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={loaderRef} className="py-24 text-center">
            {isLoadingMore ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 size={32} className="animate-spin text-[#00F2FE]" />
                  <div className="absolute inset-0 blur-lg bg-[#00F2FE]/40 animate-pulse" />
                </div>
                <div className="flex flex-col">
                   <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Indexing Cloud Nodes...</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fetching High-Fidelity Data</p>
                </div>
              </div>
            ) : (
              <div className="px-8 py-4 bg-slate-50 rounded-full inline-flex items-center gap-4 text-slate-400">
                <FileBox size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">End of synchronous buffer reached</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Modal */}
      <AnimatePresence>
        {flaggingResource && (
          <FlagModal 
            isOpen={!!flaggingResource} 
            onClose={() => setFlaggingResource(null)} 
            resourceTitle={flaggingResource.title}
          />
        )}
      </AnimatePresence>

      {/* Analytics Banner */}
      <div className="container mx-auto px-12 mb-20">
         <div className="bg-slate-800 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="text-[#00F2FE]" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest text-[#00F2FE]">Security Protocol Active</span>
               </div>
               <h2 className="text-3xl font-black text-white tracking-tight mb-4">Vault Authentication Level 4</h2>
               <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
                  All transactions and interactions within the Resource Hub are logged and verified via the Gemini 3 security matrix. 
               </p>
            </div>
            <div className="flex flex-wrap gap-8 relative z-10">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Encrypted</p>
                  <p className="text-2xl font-black text-white">AES-256</p>
               </div>
               <div className="h-10 w-px bg-white/10 hidden md:block" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Status</p>
                  <p className="text-2xl font-black text-emerald-400">Stable</p>
               </div>
               <div className="h-10 w-px bg-white/10 hidden md:block" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Peer Latency</p>
                  <p className="text-2xl font-black text-white">4ms</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
