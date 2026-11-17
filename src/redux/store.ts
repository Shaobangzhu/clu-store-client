import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { i18nSlice } from "./i18nSlice";
import searchReducer from "./searchSlice";
import userReducer, { login, logout } from "./userSlice";
import { clearSession, saveSession, sessionTransport } from '../auth/session';

const sessionCleanup: Middleware = () => next => action => {
  if (login.pending.match(action)) clearSession();
  return next(action);
};
const store = configureStore({
  devTools: false,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sessionCleanup),
  reducer: {
    i18n: i18nSlice.reducer, // 命名空间 i18n, state.i18n.currentLanguage
    search: searchReducer, // 命名空间 search, state.search
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export default store;

let previous = store.getState().user;
let timer: ReturnType<typeof setTimeout> | undefined;
store.subscribe(() => {
  const current = store.getState().user;
  if (current === previous) return;
  const old = previous;
  previous = current;
  if (current.token !== old.token || current.status === 'anonymous') {
    clearTimeout(timer);
    clearSession(Boolean(current.token));
    if (current.token && current.expiresAt) {
      saveSession({ token: current.token, expiresAt: current.expiresAt });
      timer = setTimeout(() => store.dispatch(logout()), Math.max(0, current.expiresAt - Date.now()));
    }
  }
});
sessionTransport.invalid = token => {
  if (store.getState().user.token === token) store.dispatch(logout());
};
sessionTransport.allowed = token => {
  const user = store.getState().user;
  if (user.token !== token) return true; // Candidate tokens still require /auth/me validation.
  if (!user.expiresAt || user.expiresAt <= Date.now()) { store.dispatch(logout()); return false; }
  return true;
};
if (typeof window !== 'undefined') {
  const check = () => {
    const { token, expiresAt } = store.getState().user;
    if (token && expiresAt && expiresAt <= Date.now()) store.dispatch(logout());
  };
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', check);
}
