export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface DemoData {
  students: DemoUser[];
  teachers: DemoUser[];
  admins: DemoUser[];
  logs: any[];
}

const DEFAULT_DEMO: DemoData = {
  students: [
    { id: 's-1', name: 'Alex Thompson', email: 'alex.t@edu.vault', role: 'Student', status: 'Active' },
    { id: 's-2', name: 'Maria Garcia', email: 'm.garcia@edu.vault', role: 'Student', status: 'Idle' },
  ],
  teachers: [
    { id: 't-1', name: 'Sarah Miller', email: 's.miller@staff.vault', role: 'Teacher', status: 'Active' },
  ],
  admins: [
    { id: 'a-1', name: 'James Wilson', email: 'j.wilson@admin.vault', role: 'Admin', status: 'Active' },
  ],
  logs: [
    { id: '1', action: 'AUTH_GATEWAY', actor: 'SYSTEM_DAEMON', target: 'SSO_LAYER', status: 'SUCCESS', timestamp: '12:45:00', description: 'Token Verification Success' },
    { id: '2', action: 'GIT_SYNC', actor: 'RES_DEVOPS', target: 'RESOURCE_CORE', status: 'COMPLETED', timestamp: '13:02:15', description: 'GitHub Origin Repository Head Sync' },
  ]
};

const STORAGE_KEY = 'smart_academics_demo_data_v1';

export function loadDemoData(): DemoData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DEMO, ...parsed } as DemoData;
  } catch (e) {
    console.warn('Failed to parse demo data, falling back to defaults', e);
    return DEFAULT_DEMO;
  }
}

export function saveDemoData(data: Partial<DemoData>) {
  try {
    const current = loadDemoData();
    const merged = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.warn('Failed to save demo data', e);
    return loadDemoData();
  }
}

export function clearDemoData() {
  localStorage.removeItem(STORAGE_KEY);
}
