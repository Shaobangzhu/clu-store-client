import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../api/services';
import { DEMO_TTL, jwtDeadline, readSession, validSession, type Session } from '../auth/session';
import { authError } from '../auth/errors';

export interface SafeUser { id: string; username: string; email: string; role: 'USER' | 'ADMIN' }
function safeUser(value: unknown): SafeUser {
  if (typeof value !== 'object' || !value || !('id' in value) || typeof value.id !== 'string'
    || !('username' in value) || typeof value.username !== 'string'
    || !('email' in value) || typeof value.email !== 'string'
    || !('role' in value) || (value.role !== 'USER' && value.role !== 'ADMIN')) throw new Error('Invalid user');
  return { id: value.id, username: value.username, email: value.email, role: value.role };
}
interface Authenticated extends Session { user: SafeUser }
export interface UserState {
  token: string | null; user: SafeUser | null; expiresAt: number | null;
  status: 'uninitialized' | 'initializing' | 'anonymous' | 'authenticated';
  loading: boolean; error: string | null; requestId: string | null; generation: number;
}
const initialState: UserState = { token: null, user: null, expiresAt: null, status: 'uninitialized',
  loading: false, error: null, requestId: null, generation: 0 };
export const login = createAsyncThunk<Authenticated, { identifier: string; password: string }, { rejectValue: string }>(
  'user/login', async (credentials, { signal, rejectWithValue }) => {
    try {
      const started = Date.now();
      const { data } = await authService.login(credentials, { signal });
      const session = { token: data.token, expiresAt: Math.min(started + DEMO_TTL,
        started + data.expiresIn * 1000, Date.parse(data.expiresAt), jwtDeadline(data.token)) };
      if (data.tokenType !== 'Bearer' || !validSession(session)) throw new Error('Invalid session');
      const { data: user } = await authService.me({ token: session.token, signal });
      if (!validSession(session)) throw new Error('Expired session');
      return { ...session, user: safeUser(user) };
    } catch (error) { return rejectWithValue(authError(error)); }
  });
export const restoreSession = createAsyncThunk<Authenticated | null, void, { state: { user: UserState }; rejectValue: string }>(
  'user/restore', async (_, { signal, rejectWithValue }) => {
    const session = readSession();
    if (!session) return null;
    try {
      const { data } = await authService.me({ token: session.token, signal });
      if (!validSession(session)) throw new Error('Expired session');
      return { ...session, user: safeUser(data) };
    } catch (error) { return rejectWithValue(authError(error)); }
  }, { condition: (_, { getState }) => getState().user.status === 'uninitialized' });
const userSlice = createSlice({ name: 'user', initialState, reducers: {
  logout: state => ({ ...initialState, status: 'anonymous', generation: state.generation + 1 }),
}, extraReducers: builder => {
  for (const thunk of [login, restoreSession]) {
    builder.addCase(thunk.pending, (state, action) => {
      return { ...initialState, status: 'initializing', loading: true, requestId: action.meta.requestId,
        generation: state.generation + 1 };
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.loading = false; state.requestId = null;
      if (action.payload) {
        Object.assign(state, action.payload); state.status = 'authenticated';
      } else { state.status = 'anonymous'; }
    });
    builder.addCase(thunk.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.loading = false; state.requestId = null; state.status = 'anonymous';
      state.error = action.payload ?? 'auth.serverError';
    });
  }
} });
export const { logout } = userSlice.actions;
export default userSlice.reducer;
