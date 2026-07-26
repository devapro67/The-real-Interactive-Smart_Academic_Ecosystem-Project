import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Zap } from 'lucide-react';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import GlobalAssistant from './components/GlobalAssistant';
import StudentDashboard from './pages/student/StudentDashboard';
import HomeworkHelper from './pages/student/HomeworkHelper';
import StudyPlanner from './pages/student/StudyPlanner';
import CollaborationHub from './pages/student/CollaborationHub';
import GradeAnalyzer from './pages/student/GradeAnalyzer';
import Noticeboard from './pages/student/Noticeboard';
import AttendanceTracker from './pages/student/AttendanceTracker';
import ResourceHub from './pages/student/ResourceHub';
import WellnessCenter from './pages/student/WellnessCenter';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AssignmentBuilder from './pages/teacher/AssignmentBuilder';
import SmartGrading from './pages/teacher/SmartGrading';
import StudentAnalytics from './pages/teacher/StudentAnalytics';
import TeacherComms from './pages/teacher/TeacherComms';

// Internal Dashboard Layout Wrapper
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isFocusMode } = useAppStore();
  const location = useLocation();
  
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 [&_.fixed.top-6.left-6]:hidden">
      {/* Structural Mesh Gradients */}
      <div className="absolute -top-25 -left-25 w-125 h-125 bg-indigo-50 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute -bottom-25 -right-25 w-150 h-150 bg-fuchsia-50 rounded-full blur-[100px] opacity-40"></div>

      <Sidebar />

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto min-h-full h-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname}
                initial={{ opacity: 0, y: 15, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.99 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-full bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-6 md:p-12"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Global Assistant Component */}
      <GlobalAssistant />
      
      {/* Global Focus Switch Overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => useAppStore.getState().setFocusMode(false)}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-white/20"
          >
            <Zap size={14} className="text-indigo-400" /> Disable Focus Mode
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Force the back button to destroy itself on the landing page AND any inner dashboard panel paths
  if (
    location.pathname === '/' || 
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/teacher') ||
    location.pathname === '/homework-helper' ||
    location.pathname === '/study-planner' ||
    location.pathname === '/collaboration-hub' ||
    location.pathname === '/grade-analyzer' ||
    location.pathname === '/noticeboard' ||
    location.pathname === '/attendance' ||
    location.pathname === '/resource-hub' ||
    location.pathname === '/wellness'
  ) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-100 flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 group text-slate-200 cursor-pointer"
    >
      <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
      Back
    </motion.button>
  );
};

export default function App() {
  const { user, setSession } = useAppStore();

  const handleAuthUser = async (sbUser: any) => {
    if (!sbUser) {
      useAppStore.getState().setUser(null);
      return;
    }

    const pendingRole = localStorage.getItem('pending_role');
    const existingRole = sbUser.user_metadata?.role;
    const finalRole = existingRole || pendingRole || 'student';

    useAppStore.getState().setUser({
      id: sbUser.id,
      email: sbUser.email,
      full_name: sbUser.user_metadata?.full_name || 'Academic User',
      role: finalRole as any,
      focus_mode: false
    });

    if (pendingRole && !existingRole) {
      await supabase.auth.updateUser({
        data: { role: pendingRole }
      });
      localStorage.removeItem('pending_role');
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase session restore failed:', error.message || error);
      }
      if (session) {
        setSession(session);
        await handleAuthUser(session.user);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      handleAuthUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <Router>
      <GlobalBackButton />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Student Suite */}
        <Route path="/dashboard" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><StudentDashboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/homework-helper" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><HomeworkHelper /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/study-planner" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><StudyPlanner /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/collaboration-hub" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><CollaborationHub /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/grade-analyzer" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><GradeAnalyzer /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/noticeboard" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><Noticeboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/attendance" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><AttendanceTracker /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/resource-hub" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><ResourceHub /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/wellness" element={
          user?.role === 'student' || user?.role === 'admin' ? (
            <DashboardLayout><WellnessCenter /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        {/* Admin Suite */}
        <Route path="/admin" element={
          user?.role === 'admin' ? (
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/admin/flags" element={
          user?.role === 'admin' ? (
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/admin/audit-log" element={
          user?.role === 'admin' ? (
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        {/* Teacher Suite */}
        <Route path="/teacher" element={
          user?.role === 'teacher' || user?.role === 'admin' ? (
            <DashboardLayout><TeacherDashboard /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/teacher/assignments" element={
          user?.role === 'teacher' || user?.role === 'admin' ? (
            <DashboardLayout><AssignmentBuilder /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/teacher/grading" element={
          user?.role === 'teacher' || user?.role === 'admin' ? (
            <DashboardLayout><SmartGrading /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/teacher/analytics" element={
          user?.role === 'teacher' || user?.role === 'admin' ? (
            <DashboardLayout><StudentAnalytics /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/teacher/communications" element={
          user?.role === 'teacher' || user?.role === 'admin' ? (
            <DashboardLayout><TeacherComms /></DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}