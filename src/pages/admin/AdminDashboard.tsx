import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { 
  Activity, 
  Cpu, 
  Database, 
  Users, 
  Terminal, 
  UserPlus, 
  Edit3, 
  UserMinus, 
  Search,
  RefreshCw,
  LucideIcon,
  Check,
  Clock,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { loadDemoData } from '../../lib/demoData';
import { supabase } from '../../lib/supabase';

// --- Types ---
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface TelemetryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}

interface FeatureToggleCardProps {
  id: string;
  name: string;
  description: string;
  active: boolean;
  onToggle: (id: string) => void;
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  status: 'SUCCESS' | 'DENIED' | 'MODIFIED' | 'COMPLETED';
  timestamp: string;
  description: string;
}

// --- Components ---

const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-12 right-12 z-100 px-6 py-4 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-seafoam/20 flex items-center justify-center">
          <Check size={16} className="text-seafoam" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-seafoam">
          {message}
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

const TelemetryCard = ({ title, value, unit, icon: Icon, color }: TelemetryCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white/60 backdrop-blur-md border border-white rounded-4xl p-8 shadow-xl shadow-slate-100/50 group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-4xl ${color} bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} />
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
        <Activity size={10} className="animate-pulse" /> Real-time
      </div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit}</span>
    </div>
  </motion.div>
);

const FeatureToggleCard = ({ id, name, description, active, onToggle }: FeatureToggleCardProps) => (
  <motion.div 
    layout
    className={`p-8 bg-white/60 backdrop-blur-xl border rounded-4xl transition-all duration-500 ${
      active ? 'border-seafoam/30 shadow-xl shadow-cyan/5 bg-white/80' : 'border-white shadow-lg'
    }`}
  >
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-seafoam shadow-[0_0_12px_#00F2FE]' : 'bg-slate-300'}`} />
          <h4 className={`text-lg font-black tracking-tight ${active ? 'text-slate-900' : 'text-slate-700'}`}>{name}</h4>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      <button 
        aria-label={`Toggle ${name}`}
        onClick={() => onToggle(id)} 
        className={`relative w-16 h-8 rounded-full transition-all duration-500 flex items-center px-1 ${
          active ? 'bg-seafoam/20 ring-4 ring-seafoam/5' : 'bg-slate-100'
        }`}
      >
        <motion.div 
          animate={{ x: active ? 32 : 0 }}
          className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            active ? 'bg-seafoam' : 'bg-white'
          }`}
        >
          {active ? <Check size={12} className="text-slate-900" strokeWidth={4} /> : <div className="w-1 h-1 bg-slate-300 rounded-full" />}
        </motion.div>
      </button>
    </div>
  </motion.div>
);

interface UserRowProps {
  user: User;
  onAction: (type: 'edit' | 'suspend', user: User) => void;
}

const UserRow = ({ user, onAction }: UserRowProps) => (
  <tr className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
    <td className="py-6 px-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-slate-200">
          {user.name.trim().split(/\s+/).map(n => n[0]?.toUpperCase()).join('')}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="py-6 px-8">
      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
        user.role === 'Admin' ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' :
        user.role === 'Teacher' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
        'bg-slate-50 text-slate-600 border-slate-100'
      }`}>
        {user.role}
      </span>
    </td>
    <td className="py-6 px-8">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 blur-[1px]' : 'bg-amber-500 blur-[1px]'}`} />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.status}</span>
      </div>
    </td>
    <td className="py-6 px-8 text-right">
      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <button 
          aria-label={`Edit ${user.name}`}
          onClick={() => onAction('edit', user)} 
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
          <Edit3 size={16} />
        </button>
        <button 
          aria-label={`Suspend ${user.name}`}
          onClick={() => onAction('suspend', user)} 
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
          <UserMinus size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default function AdminDashboard() {
  const location = useLocation();
  const { featureFlags, setFeatureFlags, user: appUser, isAuthenticated } = useAppStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const isFlagsView = location.pathname === '/admin/flags';
  const isAuditView = location.pathname === '/admin/audit-log';
  const isDefaultView = location.pathname === '/admin';

  // Initial Feature Flags Setup
  useEffect(() => {
    if (Object.keys(featureFlags).length === 0) {
      setFeatureFlags({
        'gemini_acceleration': true,
        'high_velocity_indexing': true,
        'compliance_automation': false,
        'neural_caching': true,
        'distributed_auth': true,
        'real_time_telemetry': false
      });
    }
    
    // Load demo data (customizable by storing JSON in localStorage)
    const demo = loadDemoData();
    setLogs(demo.logs as AuditLog[]);
    // populate user table from demo data by default
    setUsers([
      ...demo.admins.map(a => ({ id: a.id, name: a.name, email: a.email, role: a.role, status: a.status })),
      ...demo.teachers.map(t => ({ id: t.id, name: t.name, email: t.email, role: t.role, status: t.status })),
      ...demo.students.map(s => ({ id: s.id, name: s.name, email: s.email, role: s.role, status: s.status })),
    ]);
  }, []);

  // If an authenticated admin is present, try loading real profiles from Supabase
  useEffect(() => {
    if (!isAuthenticated || !appUser) return;
    if (appUser.role !== 'admin') return;

    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id, full_name, email, role').limit(200);
        if (error) {
          console.warn('Failed to fetch real profiles, using demo data', error);
          return;
        }
        if (!data || data.length === 0) return;
        const mapped = data.map((r: any) => ({
          id: String(r.id),
          name: r.full_name || r.email || String(r.id),
          email: r.email || '',
          role: r.role || 'student',
          status: 'Active'
        }));
        setUsers(mapped as User[]);
      } catch (e) {
        console.warn('Error fetching profiles', e);
      }
    };

    fetchProfiles();
  }, [isAuthenticated, appUser]);

  const toggleFlag = (id: string) => {
    const newFlags = { ...featureFlags, [id]: !featureFlags[id] };
    setFeatureFlags(newFlags);
    showToast("System Architecture Flag Parameters Remapped Live");
  };

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleUserAction = (type: 'edit' | 'suspend', user: User) => {
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)}ing access for ${user.name}...`);
  };

  return (
    <div className="relative min-h-screen">
      <Toast visible={toast.visible} message={toast.message} />

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-seafoam text-slate-900 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan/20">
                Root Environment
              </div>
              <div className="h-px w-12 bg-slate-200" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-4">
              {isFlagsView ? 'Module' : isAuditView ? 'Audit' : 'Core'} <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-fuchsia-500">
                {isFlagsView ? 'Architect' : isAuditView ? 'Vault' : 'Telemetry'}
              </span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl text-lg">
              {isFlagsView ? 'Propagate system-wide feature flags across the cloud mesh.' : 
               isAuditView ? 'Index of all high-security transactions within the vault.' : 
               'Real-time visualization of identity flows and system performance.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-white border border-slate-100 text-slate-600 rounded-4xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 transition-all flex items-center gap-3 shadow-xl shadow-slate-100">
              <RefreshCw size={16} className="text-indigo-500" /> Sync Mesh
            </button>
            <button 
              aria-label="Create new user command"
              className="px-8 py-4 bg-slate-900 text-white rounded-4xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3">
              <UserPlus size={16} className="text-seafoam" /> Command User
            </button>
          </div>
        </div>

        {/* View Routing */}
        <AnimatePresence mode="wait">
          {isDefaultView && (
            <motion.div 
              key="default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <TelemetryCard title="Active User Nodes" value="1,492" unit="Peers" icon={Users} color="bg-indigo-500" />
                <TelemetryCard title="API Throughput" value="124.8" unit="Hz" icon={Activity} color="bg-emerald-500" />
                <TelemetryCard title="Storage Pool" value="86%" unit="Cap" icon={Database} color="bg-amber-500" />
                <TelemetryCard title="AI Cluster Load" value="42.5" unit="Eps" icon={Cpu} color="bg-fuchsia-500" />
              </div>

              <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-4xl overflow-hidden shadow-2xl shadow-slate-200">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Identity Matrix</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active session directory and authorization records</p>
                  </div>
                  <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-seafoam transition-colors" size={18} />
                    <input 
                      type="text" 
                      aria-label="Search Identity Matrix"
                      placeholder="Cipher Search..."
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-4xl pl-16 pr-8 py-4 text-sm text-slate-800 outline-none focus:border-seafoam/50 transition-all font-bold placeholder:text-slate-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30">
                        <th scope="col" className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identified Actor</th>
                        <th scope="col" className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Level</th>
                        <th scope="col" className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Health Status</th>
                        <th scope="col" className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Overrides</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <UserRow key={user.id} user={user} onAction={handleUserAction} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {isFlagsView && (
            <motion.div 
              key="flags"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { id: 'gemini_acceleration', name: 'Gemini 3 Cognitive Acceleration Node', description: 'Optimizes LLM context windows for instant synthesis across distributed datasets.' },
                { id: 'high_velocity_indexing', name: 'High-Velocity Search Indices Override', description: 'Switches global search nodes into ultra-low latency sub-10ms bypass mode.' },
                { id: 'compliance_automation', name: 'Automated Compliance Reporting', description: 'Live generation of regulatory snapshots for regional institutional board audits.' },
                { id: 'neural_caching', name: 'Neural Resource Caching', description: 'Intelligent buffering of static visual assets using predictive user behaviors.' },
                { id: 'distributed_auth', name: 'Distributed Mesh Authentication', description: 'Enables high-availability login nodes even during full gateway maintenance cycles.' },
                { id: 'real_time_telemetry', name: 'Raw Telemetry Flux Stream', description: 'Exposes uncompressed websocket throughput logs for hardware diagnostics.' }
              ].map((flag) => (
                <FeatureToggleCard 
                  key={flag.id}
                  id={flag.id}
                  name={flag.name}
                  description={flag.description}
                  active={featureFlags[flag.id]}
                  onToggle={toggleFlag}
                />
              ))}
            </motion.div>
          )}

          {isAuditView && (
            <motion.div 
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between gap-8 mb-4">
                 <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-seafoam transition-colors" size={18} />
                    <input 
                      type="text" 
                      aria-label="Scan system events"
                      placeholder="Scan system events by description..."
                      className="w-full bg-white border-2 border-slate-100 rounded-4xl pl-16 pr-8 py-5 text-sm text-slate-800 outline-none focus:border-seafoam/50 shadow-xl shadow-slate-100 transition-all font-bold placeholder:text-slate-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <button 
                    aria-label="Filter audit logs"
                    className="p-5 bg-white border border-slate-100 rounded-4xl text-slate-400 hover:text-slate-600 transition-all shadow-lg shadow-slate-100">
                    <Filter size={20} />
                 </button>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[48px] overflow-hidden shadow-2xl shadow-slate-100">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-900 border-b border-white/10">
                             <th scope="col" className="py-6 px-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp</th>
                             <th scope="col" className="py-6 px-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">System Event</th>
                             <th scope="col" className="py-6 px-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Security Token</th>
                             <th scope="col" className="py-6 px-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Output Status</th>
                          </tr>
                       </thead>
                       <tbody className="font-mono">
                          {filteredLogs.map((log) => (
                             <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer">
                                <td className="py-5 px-10">
                                   <div className="flex items-center gap-3">
                                      <Clock size={12} className="text-slate-300" />
                                      <span className="text-[11px] font-bold text-slate-500">{log.timestamp}</span>
                                   </div>
                                </td>
                                <td className="py-5 px-10">
                                   <div>
                                      <p className="text-xs font-black text-slate-900 mb-1">{log.description}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.action}</p>
                                   </div>
                                </td>
                                <td className="py-5 px-10">
                                   <div className="flex items-center gap-2">
                                      <Terminal size={12} className="text-seafoam" />
                                      <span className="text-[10px] font-bold text-slate-500">{log.actor}</span>
                                   </div>
                                </td>
                                <td className="py-5 px-10">
                                   <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                      log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                      log.status === 'DENIED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                   }`}>
                                      <div className={`w-1 h-1 rounded-full ${
                                         log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'bg-emerald-500' :
                                         log.status === 'DENIED' ? 'bg-rose-500' : 'bg-amber-500'
                                      }`} />
                                      {log.status}
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
