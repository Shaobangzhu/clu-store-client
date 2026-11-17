import { ApiError } from '../helpers/api';
export function authError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'auth.duplicate';
    if (error.status === 429) return 'auth.rateLimit';
    if (error.status === 401) return 'auth.invalidCredentials';
  }
  return 'auth.serverError';
}
