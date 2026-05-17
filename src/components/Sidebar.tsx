import { useAppStore } from '../store/useAppStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Heart, 
  Zap,
  Bell,
  Folder,
  CheckCircle2,
  LogOut,
  Shield,
  MessageSquare,
  Clock,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  onClick: (path: string) => void;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  active, 
  onClick 
}: SidebarItemProps) => (
  <motion.button
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(path)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
      active 
        ? 'nordic-gradient text-obsidian shadow-lg shadow-cyan/10' 
        : 'text-slate-500 hover:bg-white/5 hover:text-seafoam'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
      <Icon size={20} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-indicator"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-obsidian"
      />
    )}
  </motion.button>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isFocusMode, isSidebarOpen } = useAppStore();

  const studentItems = [
    { icon: LayoutDashboard, label: 'Control Center', path: '/dashboard' },
    { icon: BookOpen, label: 'Homework AI', path: '/homework-helper' },
    { icon: Calendar, label: 'Study Grid', path: '/study-planner' },
    { icon: Users, label: 'Collaboration', path: '/collaboration-hub' },
    { icon: Zap, label: 'Grade Analytics', path: '/grade-analyzer' },
    { icon: Bell, label: 'Noticeboard', path: '/noticeboard' },
    { icon: CheckCircle2, label: 'Attendance', path: '/attendance' },
    { icon: Folder, label: 'Resource Hub', path: '/resource-hub' },
    { icon: Heart, label: 'Wellness', path: '/wellness' },
  ];

  const teacherItems = [
    { icon: LayoutDashboard, label: 'Faculty Hub', path: '/teacher' },
    { icon: Zap, label: 'AI Builder', path: '/teacher/assignments' },
    { icon: BookOpen, label: 'Smart Grading', path: '/teacher/grading' },
    { icon: Users, label: 'Performance', path: '/teacher/analytics' },
    { icon: MessageSquare, label: 'Communications', path: '/teacher/communications' },
  ];

  const adminItems = [
    { icon: Shield, label: 'Core Metrics', path: '/admin' },
    { icon: Zap, label: 'Module Flags', path: '/admin/flags' },
    { icon: Clock, label: 'Audit Vault', path: '/admin/audit-log' },
  ];

  const menuItems = user?.role === 'admin' 
    ? adminItems 
    : user?.role === 'teacher' 
    ? teacherItems 
    : studentItems;

  return (
    <AnimatePresence>
      {!isFocusMode && isSidebarOpen && (
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-40 w-72 h-screen glass-card hidden md:flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
              {/* FIXED: Replaced the old "S" letter block with your micro brand logo image element */}
              <div className="w-35 h-30 nordic-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-cyan/20 group-hover:scale-105 transition-transform overflow-hidden p-0">
              <img 
              src="/logo.png"
              alt="Smart Academic Ecosystem Logo"
              className="w-full h-full object-cover"/>
</div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter text-white mb-0 leading-none">Smart Academic</h1>
                <span className="text-[10px] font-bold text-seafoam uppercase tracking-widest">Ecosystem v4.0</span>
              </div>
            </div>
            
            <nav className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-4">Operations</p>
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  {...item}
                  active={location.pathname === item.path}
                  onClick={(p) => navigate(p)}
                />
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-8 space-y-6">
            <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-seafoam uppercase tracking-widest">Wellness Level</p>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full w-3/4 nordic-gradient"></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase text-center">75% Mindset Optima</p>
            </div>

            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-cyber-red hover:bg-cyber-red/5 transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logout Session</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}