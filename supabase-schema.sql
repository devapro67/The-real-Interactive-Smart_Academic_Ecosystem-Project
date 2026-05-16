-- Smart Academic Ecosystem: Advanced Supabase PostgreSQL Schema

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  focus_mode BOOLEAN DEFAULT false,
  force_password_reset BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOMEWORK & AI SESSIONS
CREATE TABLE IF NOT EXISTS public.homework_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  depth TEXT CHECK (depth IN ('hint', 'guided', 'full')) DEFAULT 'hint',
  token_usage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDY MODULES
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_data JSONB NOT NULL,
  current_pomodoros INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEACHER SUITE: ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  subject TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CAMPUS MODULES: LOST & FOUND
CREATE TABLE IF NOT EXISTS public.lost_found (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  status TEXT CHECK (status IN ('lost', 'found', 'returned')) DEFAULT 'lost',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN SUITE: SYSTEM CONTROLS
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Dynamic Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Student session access" ON public.homework_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin Audit Access" ON public.admin_audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_homework_user ON public.homework_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON public.assignments(teacher_id);
