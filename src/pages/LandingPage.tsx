import BackgroundUniverse from '../components/LazyBackgroundUniverse';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Layers,
  Monitor,
  Code,
  Globe,
  Cpu,
  Lock,
  LucideIcon
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  features: string[];
  color: string;
}

const FeatureCard = ({ icon: Icon, title, features, color }: FeatureCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -10, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      className="feature-card opacity-0 bg-white/40 backdrop-blur-xl border border-white/60 rounded-4xl p-8 shadow-sm hover:shadow-2xl hover:bg-white/60 transition-all duration-500 group cursor-pointer"
    >
      <motion.div 
        whileHover={{ rotate: 12, scale: 1.1 }}
        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg transition-transform duration-500`}
      >
        <Icon className="text-white" size={28} />
      </motion.div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{title}</h3>
      <ul className="space-y-3 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            {f}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
        Explore Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUser, setSession, addNotification } = useAppStore();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.from(titleRef.current, {
        y: 150,
        opacity: 0,
        scale: 0.9,
        skewX: 10,
        duration: 2,
        ease: 'expo.out',
        delay: 0.2,
      });

      gsap.fromTo('.landing-actions', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.2 }
      );

      gsap.from('.hero-card', {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: 30,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.8,
      });

      gsap.from('nav button', {
        y: -50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.75)',
        delay: 1.2,
      });

      if (showcaseRef.current) {
        gsap.from('.showcase-card', {
          opacity: 0,
          scale: 0.5,
          y: 100,
          rotationY: 45,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;
        gsap.to('.parallax-bg', { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
        gsap.to('.parallax-deep', { x: xPos * 0.5, y: yPos * 0.5, duration: 1.5, ease: 'power2.out' });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleStudentLogin = () => {
    setUser({
      id: 'mock-student-id',
      email: 'student@stjohnedusolver.com',
      full_name: 'Davo Scholar',
      role: 'student',
      focus_mode: false,
    });
    setSession({ user: { id: 'mock-student-id' } });
    addNotification({
      type: 'ai',
      title: 'Session Initialized',
      content: 'Welcome back, Davo. Your dashboard is ready.'
    });
    navigate('/student');
  };

  const handleAdminTrap = () => {
    setUser({
      id: 'hardcoded-admin-id',
      email: 'admin@stjohnedusolver.com',
      full_name: 'System Admin',
      role: 'admin',
      focus_mode: false,
    });
    setSession({ user: { id: 'hardcoded-admin-id' } });
    navigate('/admin');
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans overflow-x-hidden">
      <div className="fixed -top-25 -left-25 w-125 h-125 bg-indigo-100 rounded-full blur-[120px] opacity-60 z-0 parallax-deep"></div>
      <div className="fixed -bottom-25 -right-25 w-150 h-150 bg-fuchsia-100 rounded-full blur-[120px] opacity-60 z-0 parallax-deep"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-white opacity-40 rounded-full blur-[150px] z-0 parallax-bg"></div>

      <BackgroundUniverse />

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-60 pointer-events-none">
        <div className="text-[10px] font-mono tracking-[0.3em] text-seafoam bg-seafoam/10 border border-seafoam/20 px-3 py-1 rounded-full uppercase backdrop-blur-sm animate-pulse">
          POWERED BY GEMINI 3
        </div>
      </div>

      <section ref={heroRef} className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl flex flex-col items-center text-center relative z-10">
          <h1 ref={titleRef} className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-8">
            <span className="text-slate-800">Smart Academic</span> <br/>
            <span className="text-seafoam items-baseline">Ecosystem</span>
          </h1>

          <div className="landing-actions mt-8 flex justify-center gap-6 items-center z-50 relative mb-16">
            <Link 
              to="/login" 
              className="px-8 py-3 text-sm font-semibold tracking-wide uppercase bg-white/80 border border-white text-slate-800 backdrop-blur-md rounded-2xl transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-seafoam hover:text-seafoam hover:scale-105 active:scale-95"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-3 text-sm font-semibold tracking-wide uppercase bg-linear-to-r from-seafoam to-seafoam text-slate-900 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-105 hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStudentLogin} 
              className="hero-card bg-white/40 backdrop-blur-xl border border-white/60 rounded-4xl p-8 text-left shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
            >
               <h3 className="text-2xl font-black text-slate-900 mb-2">Student Suite Cluster</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Interactive R3F workspace for high-performance learning.</p>
               <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                 Initialize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')} 
              className="hero-card bg-white/40 backdrop-blur-xl border border-white/60 rounded-4xl p-8 text-left shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
            >
               <h3 className="text-2xl font-black text-slate-900 mb-2">Teacher Command Node</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">AI-driven instruction tools for curriculum excellence.</p>
               <div className="flex items-center gap-2 text-fuchsia-600 font-bold text-[10px] uppercase tracking-widest">
                 Sync Node <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdminTrap} 
              className="hero-card bg-white/40 backdrop-blur-xl border border-white/60 rounded-4xl p-8 text-left shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
            >
               <h3 className="text-2xl font-black text-slate-900 mb-2">Admin Root Dashboard</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Telemetric system control and academic auditing.</p>
               <div className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase tracking-widest">
                 System Root <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-between px-12 w-full pointer-events-none">
          <div className="status-pill flex items-center gap-3 bg-white/2 backdrop-blur-md border border-white/8 text-slate-800 text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg pointer-events-auto">
            <Sparkles size={14} className="text-seafoam" />
            <span>14.2K+ Academic Queries Automated via Gemini 3 Deep Core</span>
          </div>

          <div className="status-pill flex items-center gap-3 bg-white/2 backdrop-blur-md border border-white/8 text-slate-800 text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg pointer-events-auto">
            <Zap size={14} className="text-seafoam" />
            <span>Sub-60ms Architecture Latency. Optimized for Institutional Scale</span>
          </div>
        </div>
      </section>

      <section ref={showcaseRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-indigo-600" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Unified Architecture</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">One Core. Infinite Possibilities.</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Smart Academic Ecosystem replaces fragmented legacy tools with a unified biometric and AI-enhanced platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="bg-white/40 p-8 rounded-[40px] border border-white/60">
            <Globe className="text-indigo-600 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-4">Global Sync</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Real-time data synchronization across mobile, desktop, and campus terminals.</p>
          </div>
          <div className="bg-white/40 p-8 rounded-[40px] border border-white/60">
            <Cpu className="text-fuchsia-600 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-4">Compute Optimized</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Edge processing ensures AI tools are always responsive, even during peak campus hours.</p>
          </div>
          <div className="bg-white/40 p-8 rounded-[40px] border border-white/60">
            <Lock className="text-slate-900 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-4">Quantum Grade Security</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">End-to-end encrypted academic records with biometric verification protocols.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="showcase-card">
            <FeatureCard 
              icon={BookOpen}
              title="Student Suite"
              features={["AI Homework Assistant", "Dynamic Study Planner", "Peer Collaboration Network", "Visual Campus Tracker"]}
              color="bg-indigo-600"
            />
          </div>
          <div className="showcase-card">
            <FeatureCard 
              icon={Monitor}
              title="Teacher Node"
              features={["Automated Grading Engine", "Curriculum Builder AI", "Parent Direct-Link Hub", "Student Trend Analytics"]}
              color="bg-fuchsia-600"
            />
          </div>
          <div className="showcase-card">
            <FeatureCard 
              icon={Shield}
              title="Admin Root"
              features={["Institutional Telemetry", "Module Permission Flags", "Financial Token Monitor", "Crisis Response Center"]}
              color="bg-slate-900"
            />
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-white/40 backdrop-blur-md border border-white p-12 md:p-20 rounded-[64px] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-6">
              <Zap size={14} /> Ecosystem v4.0.2
            </div>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 leading-none">Intelligence as a Standard</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
              Unlike traditional management systems, our core engine is predictive. It identifies learning gaps before exams occur and streamlines administrative hurdles through automated logic.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="px-6 py-4 bg-white/80 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <Code className="text-indigo-400" size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600 text-nowrap">API First Architecture</span>
               </div>
               <div className="px-6 py-4 bg-white/80 rounded-2xl border border-fuchsia-100 flex items-center gap-3">
                  <Monitor className="text-fuchsia-400" size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600 text-nowrap">Retina Optimized UI</span>
               </div>
            </div>
          </div>
          <div className="relative aspect-square bg-white/20 backdrop-blur-3xl rounded-[64px] overflow-hidden flex items-center justify-center border border-white/40 shadow-inner">
             <Layers className="text-indigo-100 opacity-20" size={300} />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-linear-to-tr from-indigo-500/20 to-fuchsia-500/20 rounded-full animate-pulse blur-3xl" />
             </div>
             <Sparkles className="text-indigo-600 relative z-10" size={80} />
          </div>
        </div>
      </section>

      <footer className="relative z-10 w-full py-24 px-6 border-t border-slate-200/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">SMART ACADEMIC ECOSYSTEM</h3>
              <p className="text-slate-500 font-medium max-w-sm mb-8 leading-relaxed">
                Pioneering the next generation of academic environments through unified data and artificial intelligence.
              </p>
              <div className="flex items-center gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer" />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Ecosystem Nodes</h4>
              <ul className="space-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Student Cluster</li>
                <li className="hover:text-fuchsia-600 cursor-pointer transition-colors">Teacher Terminal</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Admin Root</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Parent Node</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Resources</h4>
              <ul className="space-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">API Keys</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">System Status</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Help Center</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-200 font-bold uppercase tracking-widest text-[8px] text-slate-400">
             <p>© 2026 Smart Academic Ecosystem. All rights reserved.</p>
             <div className="flex items-center gap-8 mt-6 md:mt-0">
                <span className="cursor-pointer hover:text-slate-900">Privacy Cipher</span>
                <span className="cursor-pointer hover:text-slate-900">Access Terms</span>
                <span className="cursor-pointer hover:text-slate-900">Compliance Audit</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}