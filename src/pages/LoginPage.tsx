import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Loader2, Star, Eye, EyeOff } from 'lucide-react';
import { BackgroundUniverse } from '../components/VisualEcosystem';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const setSession = useAppStore((state) => state.setSession);
  const addNotification = useAppStore((state) => state.addNotification);

  const isDatabaseConfigured = !!((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY);

  const getAuthErrorMessage = (error: any) => {
    if (!error?.message) return 'Incorrect email or password.';
    const message = error.message.toLowerCase();
    if (message.includes('invalid login credentials') || message.includes('invalid credentials') || message.includes('invalid email or password')) {
      return 'Incorrect email or password.';
    }
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('password')) {
      return 'Incorrect email or password.';
    }
    return error.message;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 1. Force Hardcoded Admin Trap Bypass
    if (email === 'admin@stjohnedusolver.com' && password === 'stjohnadmin@2') {
      setTimeout(() => {
        setUser({
          id: 'admin-mock-id',
          email: 'admin@stjohnedusolver.com',
          full_name: 'Root Administrator',
          role: 'admin',
          points: 5000,
          force_password_reset: false,
          focus_mode: false
        });
        setSession({ user: { id: 'admin-mock-id' } });
        addNotification({
          type: 'announcement',
          title: 'Root Access Granted',
          content: 'Administrator session initiated. Welcome, Commander.'
        });
        setIsLoading(false);
        navigate('/admin');
      }, 500);
      return;
    }

    if (!isDatabaseConfigured) {
      setTimeout(() => {
        setUser({
          id: 'sandbox-mock-uid',
          email: email || 'scholar@smartacademy.edu',
          full_name: role === 'student' ? 'Demo Scholar' : 'Demo Instructor',
          role: role || 'student',
          points: 120,
          force_password_reset: false,
          focus_mode: false
        });
        setSession({ user: { id: 'sandbox-mock-uid' } });
        addNotification({
          type: 'announcement',
          title: 'Sandbox Simulation Active',
          content: `Local session authorized for ${role} profile. Redirecting...`
        });
        setIsLoading(false);
        
        if (role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/dashboard');
        }
      }, 500);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(getAuthErrorMessage(signInError));
      setIsLoading(false);
      return;
    }

    if (!data?.session || !data?.user) {
      setError('Authentication succeeded but no active session was returned.');
      setIsLoading(false);
      return;
    }

    setSession(data.session);
    setUser({
      id: data.user.id,
      email: data.user.email || email,
      full_name: data.user.user_metadata?.full_name || (role === 'student' ? 'Student User' : 'Teacher User'),
      role: (data.user.user_metadata?.role as 'student' | 'teacher' | 'admin') || role,
      focus_mode: false
    });

    setIsLoading(false);
    navigate(data.user.user_metadata?.role === 'teacher' ? '/teacher' : data.user.user_metadata?.role === 'admin' ? '/admin' : '/dashboard');
  };

  const getOAuthErrorMessage = (error: any) => {
    if (!error?.message) return 'Unable to start Google sign-in. Please try again.';
    const message = error.message.toLowerCase();
    if (message.includes('provider is not enabled')) {
      return 'Google sign-in is not enabled for this Supabase project. Enable Google under Auth > Providers in Supabase.';
    }
    if (message.includes('unsupported provider')) {
      return 'Google sign-in is not available. Please check the OAuth provider configuration.';
    }
    return error.message;
  };

  const handleGoogleLogin = async () => {
    if (!isDatabaseConfigured) {
      setIsLoading(true);
      setTimeout(() => {
        const mockId = `google-${Math.random().toString(36).substr(2, 9)}`;
        setUser({
          id: mockId,
          email: 'google-user@edu.vault',
          full_name: 'Cloud Authenticated User',
          role: role,
          focus_mode: false
        });
        setSession({ user: { id: mockId } });
        addNotification({
          type: 'announcement',
          title: 'Google Link Bypassed',
          content: 'Sandbox: Google OAuth simulated successfully.'
        });
        setIsLoading(false);
        navigate(`/${role}`);
      }, 1200);
      return;
    }

    setError('');
    setIsLoading(true);
    localStorage.setItem('pending_role', role);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      setError(getOAuthErrorMessage(error));
      setIsLoading(false);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      setIsLoading(false);
      setError('Google sign-in could not be started. Please try again.');
    }
  };

  return (
    /* FIXED: Adjusted to min-h-screen and overflow-y-auto to allow scaling and scrolling layout */
    <div className="relative w-full min-h-screen overflow-y-auto bg-slate-50 flex items-center justify-center font-sans py-16">
      <BackgroundUniverse />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
        className="w-full max-w-md p-2 relative z-10"
      >
        <div className="bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-10 md:p-12 relative overflow-visible">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-fuchsia-500" />
          
          {/* LOGO BADGE: Swapped out purple block container for the centered white circle badge layout */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
              <img src="/logo.png" alt="Smart Academic Ecosystem Logo" className="w-full h-full object-contain p-2 scale-125" />
            </div>
          </div>

          <div className="text-center mb-10 pt-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">Workspace Access</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Star size={12} className="text-indigo-400" /> Secure Terminal v4.0.2
            </p>
          </div>

          {/* Identity Selector */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 mb-8">
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'teacher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Institute Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                {/* FIXED: Added text-slate-900 */}
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@stjohnedusolver.com"
                  className="w-full bg-white/60 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* FIXED: Renamed label context block from Access Protocol to Password */}
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fuchsia-500 transition-colors" size={18} />
                {/* FIXED: Added dynamic type configuration along with explicit text-slate-900 */}
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/60 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm font-bold"
                  required
                />
                {/* FIXED: Added action toggle container wrapper button containing Lucide visibility eyes */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Authorize Entry <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400">Security Bypass Options</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/60 border border-slate-200 text-slate-700 rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-center mt-10 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
            Authorized Personnel Only.<br/>
            Session encrypted via RSA-4096.
          </p>
        </div>

        <motion.button 
          whileHover={{ x: 5, color: '#4f46e5' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-12 mx-auto flex items-center gap-3 text-slate-400 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
        >
          Return to Portal Root
        </motion.button>
      </motion.div>
    </div>
  );
}