import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'teacher' | 'admin' | null;
  focus_mode: boolean;
  avatar_url?: string;
  force_password_reset?: boolean;
  points?: number;
}

interface Notification {
  id: string;
  type: 'assignment' | 'deadline' | 'announcement' | 'ai';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface AppState {
  // Auth State
  user: UserProfile | null;
  session: any | null;
  isAuthenticated: boolean;
  
  // UI State
  isFocusMode: boolean;
  isSidebarOpen: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // System State
  featureFlags: Record<string, boolean>;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setSession: (session: any | null) => void;
  setFocusMode: (active: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setFeatureFlags: (flags: Record<string, boolean>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isFocusMode: false,
  isSidebarOpen: true,
  notifications: [
    {
      id: '1',
      type: 'announcement',
      title: 'Welcome to Smart Academic',
      content: 'Your ecosystem is now active. Explore the AI-powered modules.',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Math Physics Lab',
      content: 'Report submission due in 4 hours.',
      timestamp: new Date().toISOString(),
      isRead: false
    }
  ],
  featureFlags: {},

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isFocusMode: user?.focus_mode ?? false 
  }),
  setSession: (session) => set({ session }),
  setFocusMode: (active) => set({ isFocusMode: active }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setFeatureFlags: (flags) => set({ featureFlags: flags }),
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        isRead: false
      },
      ...state.notifications
    ]
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] }),
  logout: () => set({ 
    user: null, 
    session: null, 
    isAuthenticated: false, 
    isFocusMode: false,
    notifications: []
  }),
}));
