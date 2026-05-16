import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Users, 
  Terminal, 
  UserPlus, 
  Edit3, 
  UserMinus, 
  Search,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Shield,
  LucideIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TelemetryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}

const TelemetryCard = ({ title, value, unit, icon: Icon, color }: TelemetryCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20 flex items-center justify-center`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
        <Activity size={10} /> Live
      </div>
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  </motion.div>
);

interface FeatureToggleProps {
  name: string;
  id: string;
  active: boolean;
  onToggle: (id: string) => void;
}

const FeatureToggle = ({ name, id, active, onToggle }: FeatureToggleProps) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-300'}`} />
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{name}</span>
    </div>
    <button onClick={() => onToggle(id)} className="transition-transform active:scale-95">
      {active ? (
        <ToggleRight className="text-indigo-600" size={32} />
      ) : (
        <ToggleLeft className="text-slate-300" size={32} />
      )}
    </button>
  </div>
);

interface UserRowProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  onAction: (type: string, user: any) => void;
}

const UserRow = ({ user, onAction }: UserRowProps) => (
  <tr className="group border-b border-slate-100 hover:bg-white/40 transition-colors">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        user.role === 'Admin' ? 'bg-fuchsia-100 text-fuchsia-600' :
        user.role === 'Teacher' ? 'bg-indigo-100 text-indigo-600' :
        'bg-slate-100 text-slate-600'
      }`}>
        {user.role}
      </span>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.status}</span>
      </div>
    </td>
    <td className="py-4 px-6 text-right">
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onAction('edit', user)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
          <Edit3 size={16} />
        </button>
        <button onClick={() => onAction('suspend', user)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors">
          <UserMinus size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default function AdminDashboard() {
  const { featureFlags, setFeatureFlags } = useAppStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Feature Flags Setup
  useEffect(() => {
    if (Object.keys(featureFlags).length === 0) {
      setFeatureFlags({
        'homework_helper': true,
        'noticeboard': true,
        'wellness': true,
        'marketplace': false,
        'peer_tutoring': true,
        'lab_streaming': false
      });
    }
    
    // Initial logs mock
    setLogs([
      { id: 1, action: 'SYS_BOOT', actor: 'ROOT_GATEWAY', target: 'GLOBAL_MESH', status: 'SUCCESS', time: '12:45:00' },
      { id: 2, action: 'FLAG_UPDATE', actor: 'ADMIN_01', target: 'MARKETPLACE_V1', status: 'MODIFIED', time: '13:02:15' },
      { id: 3, action: 'AUTH_CHALLENGE', actor: 'GUEST_NODE', target: 'SSO_LAYER', status: 'DENIED', time: '13:05:42' },
      { id: 4, action: 'DB_SYNC', actor: 'DATALAKE_SYNC', target: 'BACKEND_STK', status: 'COMPLETED', time: '13:10:00' },
    ]);
  }, []);

  const toggleFlag = (id: string) => {
    const newFlags = { ...featureFlags, [id]: !featureFlags[id] };
    setFeatureFlags(newFlags);
    addLog('FLAG_TOGGLE', 'ADMIN_USER', id.toUpperCase(), 'UPDATED');
  };

  const addLog = (action: string, actor: string, target: string, status: string) => {
    const newLog = {
      id: Date.now(),
      action,
      actor,
      target,
      status,
      time: new Date().toLocaleTimeString('en-GB')
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const users = [
    { id: 1, name: 'Alex Thompson', email: 'alex.t@edu.vault', role: 'Student', status: 'Active' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@staff.vault', role: 'Teacher', status: 'Active' },
    { id: 3, name: 'James Wilson', email: 'j.wilson@admin.vault', role: 'Admin', status: 'Active' },
    { id: 4, name: 'Maria Garcia', email: 'm.garcia@edu.vault', role: 'Student', status: 'Idle' },
    { id: 5, name: 'Robert Chen', email: 'r.chen@staff.vault', role: 'Librarian', status: 'Active' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Admin Root Dashboard</h1>
          <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Secure Telemetric System Control & Auditing</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 bg-white/40 border border-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white/60 transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Refresh Mesh
          </button>
          <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
            <UserPlus size={14} /> Invite User
          </button>
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TelemetryCard title="Active User Nodes" value="1,284" unit="Nodes" icon={Users} color="bg-indigo-500" />
        <TelemetryCard title="API Throughput" value="98.2" unit="Req/s" icon={Activity} color="bg-emerald-500" />
        <TelemetryCard title="Storage Pool" value="14.2" unit="TB" icon={Database} color="bg-amber-500" />
        <TelemetryCard title="AI Token Usage" value="4.2" unit="M/day" icon={Cpu} color="bg-fuchsia-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 backdrop-blur-xl border border-white/80 rounded-[40px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Matrix</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Cipher Search..."
                  className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 ring-indigo-100 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identified Actor</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Perms</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <UserRow key={user.id} user={user} onAction={() => {}} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System & Logs */}
        <div className="space-y-8">
          {/* Feature Flags */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/80 rounded-[40px] p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Service Control</h3>
            <div className="space-y-3">
              {Object.entries(featureFlags).map(([id, active]) => (
                <FeatureToggle 
                  key={id} 
                  id={id} 
                  name={id.replace(/_/g, ' ')} 
                  active={active} 
                  onToggle={toggleFlag} 
                />
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Terminal className="text-white" size={64} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-2">
              <Shield size={20} className="text-indigo-400" /> Audit Stream
            </h3>
            <div className="space-y-4 font-mono text-[10px] h-[300px] overflow-y-auto custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="border-l-2 border-indigo-500/30 pl-4 py-1 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between text-indigo-400 font-bold mb-1">
                    <span>{log.action}</span>
                    <span>{log.time}</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">ACTOR:</span> {log.actor}
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">TARGET:</span> {log.target}
                  </div>
                  <div className={`mt-1 font-bold ${log.status === 'DENIED' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    [{log.status}]
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Packet Stream Active</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75" />
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
