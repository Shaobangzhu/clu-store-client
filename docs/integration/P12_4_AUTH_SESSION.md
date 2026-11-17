# P12.4 — Authentication and Session

## Preconditions and scope

Verified 2026-11-17: exact branch `feat/p12-auth-session-integration`, clean client
working tree before edits. Client HEAD was `6338cdf`; P12.2 commit `0310b17` is an
ancestor. The P12.2 integration record identifies completed P12.1 backend commit
`288b6ac1f4d35501c4ab4ab3a4a39e153767ae69`; read-only checks confirmed that commit
is an ancestor of the sibling backend HEAD and its working tree was clean.

No Git writes, backend edits, runtime/infrastructure changes, secrets, live API
requests or database account creation were performed. All HTTP tests use mocks.

## Lifecycle

Registration preserves the existing four-field payload: username, email, password,
confirmPassword. Login sends identifier (username or email) and password. Both use
the existing typed envelope transport. Error UI maps duplicate accounts (409),
rate limiting (429), invalid credentials (401), and other failures to localized
messages without exposing raw backend details. No automatic retry is performed.
Existing page styling remains; auth labels/messages cover all four locales.

Redux tracks uninitialized, initializing, anonymous and authenticated states,
loading, errors, expiry and an allowlisted user (id, username, email, role).
Both login and reload restoration call GET /api/auth/me before exposing identity.
The login response's user and decoded JWT name/role are never used. The obsolete
JWT display helper was removed. Request IDs suppress late login/restore results.
Reducers are pure; storage/timer effects live outside reducers. Redux DevTools
are disabled to avoid recording credentials in thunk actions and bearer state.

The demo deadline is the earliest of 15 minutes from the start of login, backend
expiresIn, backend expiresAt, and JWT exp. JWT exp is used only to shorten/reject
sessions; it does not establish identity or verify signatures. Missing, malformed,
nonfinite or expired expiry data fails closed. There is no refresh flow. One tab
stores only token and absolute deadline under `clu.auth.session` in sessionStorage.
Reload does not extend that deadline. Storage failure allows an in-memory login;
reload then signs out. Legacy localStorage token/cart entries are removed.

A timer, focus/visibility checks and an active-token request check enforce expiry.
Authenticated 401 responses invalidate the matching active session, including
non-JSON errors; a late 401 for another token cannot log out the current account.
403 remains an authorization error. Restore failures fail closed, including
network/5xx failures. Protected user, checkout and order routes wait for session
initialization, then redirect anonymous users to sign-in with path/query/hash.
Successful login accepts only a local return path and rejects auth loops.

Starting another login or logging out clears identity and increments a session
generation. The keyed cart/router subtree remounts, dropping page-local order,
cart, password and request state. Cart state is memory-only (including guest carts),
with server cart refetch after authentication; guest carts are not merged. Old cart
queues cannot reconcile after unmount, and late checkout responses cannot redirect
or clear a newer account's retry key. Logout/new login clear checkout intent; valid
same-session restoration preserves the uncertain-order retry key.

## Verification

- `npm run lint`: PASS, with auth modules added to the TypeScript lint scope.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 7 files / 385 tests.
- `npm run build`: PASS; existing >500 kB bundle-size warning remains.
- `npm run contract:check`: PASS, pinned backend contract/definitions match.
- `git diff --check`: PASS.

Tests include four-field registration, username login, /me-only identity,
allowlisted user fields, capped expiry, valid restoration without deadline renewal,
malformed/expired/overlong storage, invalid issued tokens, 401/429/500 failures,
loading route protection and redirects, unsafe return paths, timer/request expiry,
storage failure, logout and account-switch races, stale account 401 handling,
unmounted cart mutations, checkout intent retention/cleanup and localized errors.

## Security limitations and manual acceptance

This is a short-lived demo bearer strategy, not production session hardening.
sessionStorage and in-memory tokens are accessible to same-origin JavaScript:
XSS can steal them. Tab duplication/browser recovery can copy or restore tab
storage; the absolute deadline still applies. Client expiry is not a revocation
mechanism and depends on the client clock. Logout only discards local credentials;
a copied token can remain valid on the backend until its server expiry. No backend
logout/refresh endpoint is available here. Signature verification, authorization,
account ownership and server expiry must remain backend-enforced. An HTTP request
already accepted by the server cannot be undone by logging out. Production cookies,
revocation and broader XSS hardening require separate backend/security work.

Browser/live acceptance remains outstanding. Using operator-approved isolated
accounts and the existing runtime, manually:

1. Register an approved test account; verify all four payload fields. Check duplicate
   username/email, mismatched passwords and 429 handling without repeated requests.
2. Log in by both username and email. Confirm /me supplies the header name and role;
   inspect storage for absence of localStorage tokens/user/cart data.
3. Open /checkout or an order URL while signed out. Confirm loading during restore,
   sign-in redirection, then return to the original query/hash after login.
4. Reload a valid session and verify the same expiry deadline and server cart.
   Test expired/corrupt session storage, /me 401 and 5xx, and authenticated API 401.
   Confirm 403 does not log out a valid user. Resume a tab after the deadline.
5. Log out while cart/order requests are delayed, then log in as another account.
   Verify no old name/cart/order/error appears and no stale checkout redirects occur.
   Navigate Back and reload; protected data must require the current account.
6. Retry an uncertain checkout after a same-session reload; verify the idempotency
   key is retained. Verify logout/new login clears it. Guest carts intentionally
   disappear on reload/account transition. Check all four language settings.

## Changed files

- `eslint.config.js`
- `src/App.tsx`, `src/AppInit.ts`
- `src/auth/session.ts`, `src/auth/errors.ts` (new)
- `src/redux/store.ts`, `src/redux/userSlice.ts`
- `src/helpers/api.ts`, `src/helpers/jwtHelper.ts` (removed)
- `src/HOCs/RequireAuth.tsx`, `src/routes/index.tsx`
- `src/components/Header.tsx`
- `src/contexts/shoppingCart/shoppingCartProvider.tsx`
- `src/hooks/useShoppingCartAction.ts`
- `src/pages/SignIn.tsx`, `src/pages/Register.tsx`, `src/pages/CheckOut.tsx`
- `src/assets/languages/en-US.json`, `fr-FR.json`, `zh-CN.json`, `zh-TW.json`
- `tests/auth.test.tsx` (new), `tests/register.test.tsx`, `tests/hooks.test.tsx`
- `docs/integration/P12_4_AUTH_SESSION.md` (new)

Operator-only suggested commit: `feat(auth): integrate user authentication and sessions`.
Suggested PR title: `feat(auth): implement end-to-end session integration`.
