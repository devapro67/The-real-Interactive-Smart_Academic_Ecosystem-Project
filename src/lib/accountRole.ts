export type AccountRole = 'student' | 'teacher' | 'admin';

const STORAGE_KEY = 'smart_academics_account_roles_v1';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readRoles(): Record<string, AccountRole> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getLocalAccountRole(email: string) {
  return readRoles()[normalizeEmail(email)] || null;
}

export function saveLocalAccountRole(email: string, role: AccountRole) {
  const roles = readRoles();
  roles[normalizeEmail(email)] = role;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

export function roleMismatchMessage(role: AccountRole, existingRole: AccountRole) {
  return `This email is already registered as a ${existingRole}. Use a different email for a ${role} account.`;
}
