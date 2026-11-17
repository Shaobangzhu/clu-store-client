// Demo-only bearer session. No refresh token; the deadline never slides on reload.
export const SESSION_KEY = 'clu.auth.session';
export const DEMO_TTL = 15 * 60 * 1000;
export interface Session { token: string; expiresAt: number }
export function jwtDeadline(token: string): number {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts.every(Boolean)) return 0;
    const payload: unknown = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload !== 'object' || !payload || !('exp' in payload)
      || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return 0;
    return payload.exp * 1000;
  } catch { return 0; }
}
export function validSession(value: unknown): value is Session {
  if (typeof value !== 'object' || !value || !('token' in value) || !('expiresAt' in value)) return false;
  return typeof value.token === 'string' && typeof value.expiresAt === 'number'
    && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now()
    && value.expiresAt <= Date.now() + DEMO_TTL && jwtDeadline(value.token) >= value.expiresAt;
}
export function clearSession(preserveCheckout = false) {
  // Only the legacy unscoped key follows session cleanup. P12.6 account-scoped
  // intents survive expiry/logout so the same user can recover an uncertain order.
  try { sessionStorage.removeItem(SESSION_KEY);
    if (!preserveCheckout) sessionStorage.removeItem('clu.checkout.intent'); } catch { /* Memory-only mode. */ }
  try { localStorage.removeItem('token'); localStorage.removeItem('shoppingCart'); } catch { /* Storage may be disabled. */ }
}
export function readSession(): Session | null {
  try {
    localStorage.removeItem('token'); localStorage.removeItem('shoppingCart');
    const value: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (validSession(value)) return value;
  } catch { /* Corrupt or unavailable storage fails closed. */ }
  clearSession();
  return null;
}
export function saveSession(session: Session) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* Continue in memory only. */ }
}
// Transport hooks are installed by the application store, avoiding a store/API import cycle.
export const sessionTransport: {
  invalid: (token: string) => void;
  allowed: (token: string) => boolean;
} = { invalid: () => {}, allowed: () => true };
