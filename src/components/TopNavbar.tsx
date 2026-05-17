import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  Maximize2, 
  Minimize2, 
  Menu,
  ChevronRight,
  User
} from 'lucide-react';

export default function TopNavbar() {
  const location = useLocation();
  const { isFocusMode, setFocusMode, isSidebarOpen, setSidebarOpen, user, notifications, markNotificationAsRead } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className={`sticky top-0 z-60 w-full transition-all duration-500 flex items-center justify-between px-6 py-4 ${
      scrolled ? 'bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-4">
        {!isFocusMode && (
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/40 rounded-xl transition-colors text-slate-500"
          >
            <Menu size={20} />
          </motion.button>
        )}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {location.pathname.includes('/dashboard') && (
            <span>Dashboard</span>
          )}
          <span>Academic Hub</span>
          <ChevronRight size={12} />
          <span className="text-indigo-600">{user?.role} Suite</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-full px-4 py-2 text-slate-400 focus-within:text-indigo-600 focus-within:border-indigo-200 transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-slate-400 w-48"
          />
        </div>

        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/40 rounded-xl transition-colors text-slate-500"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(211,38,211,0.5)]"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-6 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">System Feed</h3>
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  
                  <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                    {notifications.length > 0 ? notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`group relative p-4 rounded-2xl transition-all cursor-pointer ${
                          n.isRead ? 'bg-slate-50/50 opacity-60' : 'bg-white shadow-sm hover:shadow-md border border-indigo-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            n.type === 'deadline' ? 'bg-red-500' : 
                            n.type === 'ai' ? 'bg-fuchsia-500' : 'bg-indigo-500'
                          }`} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.type}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{n.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{n.content}</p>
                      </div>
                    )) : (
                      <div className="text-center py-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed is quiet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setFocusMode(!isFocusMode)}
          className={`p-2 rounded-xl transition-all ${
            isFocusMode ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/40 text-slate-500'
          }`}
          title="Toggle Focus Mode"
        >
          {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3 pl-2">
          <div className="flex flex-col items-end sm:flex">
            <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{user?.full_name?.split(' ')[0]}</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Level 12 Scholar</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-slate-200 to-slate-100 border border-white shadow-sm flex items-center justify-center overflow-hidden">
             {user?.avatar_url ? (
               <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User className="text-slate-400" size={20} />
             )}
          </div>
        </div>
      </div>
    </nav>
  );
}
