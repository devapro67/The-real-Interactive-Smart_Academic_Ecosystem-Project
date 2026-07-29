const STORAGE_KEY_PREFIX = 'smart_academics_email_rate_';

interface WindowRecord {
  timestamps: number[];
}

const DEFAULT_LIMIT = 10; // allow 10 sends
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

function storageKey(action: string, identifier: string) {
  return `${STORAGE_KEY_PREFIX}${action}:${identifier}`;
}

export function canSend(action: string, identifier = 'global', limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS) {
  try {
    const key = storageKey(action, identifier);
    const raw = localStorage.getItem(key);
    const now = Date.now();
    const record: WindowRecord = raw ? JSON.parse(raw) : { timestamps: [] };
    // prune old
    record.timestamps = record.timestamps.filter(ts => now - ts <= windowMs);
    if (record.timestamps.length >= limit) return false;
    // allow and record
    record.timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(record));
    return true;
  } catch (e) {
    // if storage unavailable, be permissive to avoid blocking users
    console.warn('emailRateLimiter storage failure, allowing send', e);
    return true;
  }
}

export function remainingQuota(action: string, identifier = 'global', limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS) {
  try {
    const key = storageKey(action, identifier);
    const raw = localStorage.getItem(key);
    const now = Date.now();
    const record: WindowRecord = raw ? JSON.parse(raw) : { timestamps: [] };
    record.timestamps = record.timestamps.filter(ts => now - ts <= windowMs);
    return Math.max(0, limit - record.timestamps.length);
  } catch (e) {
    return limit;
  }
}

export function resetQuota(action: string, identifier = 'global') {
  try {
    localStorage.removeItem(storageKey(action, identifier));
  } catch (e) {
    // ignore
  }
}
