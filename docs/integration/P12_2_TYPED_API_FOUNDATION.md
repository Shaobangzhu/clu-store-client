# P12.2 — Typed API Foundation

## Contract and preconditions

Verified on 2026-11-17 UTC. Client branch: `feat/p12-typed-api-foundation`.
Both repositories were clean before implementation. Backend `main` and
`origin/main` both point to merge `8929c5fe24205e814db05a12642aad61d7c25a60`
(PR #2), and both contain P12.1 feature commit
`288b6ac1f4d35501c4ab4ab3a4a39e153767ae69`.
The backend working OpenAPI exactly matches the merged blob.

Read-only source: `/home/clu/projects/clu-store-api/docs/openapi.json`.
SHA-256: `018989b1204de13fdadb7e9d98ad34a0f7f34e32ac00ba50404e165104dc32fc`.
The reviewed snapshot is `src/api/openapi.json`; generated definitions are
`src/api/schema.d.ts`. Run `npm run api:generate` to regenerate them, or
`npm run contract:check` to compare without writing. Both commands require the
sibling backend document and reject a changed source hash. A future contract
revision requires review and an explicit hash/source revision update before
regeneration. The generator version is pinned to `openapi-typescript@7.13.0`.
All direct dependency versions and the lockfile are pinned. TypeScript 5.9.3
replaces 7.0.2 to satisfy the generator's TypeScript 5 peer requirement;
the unsupported `ignoreDeprecations: "6.0"` setting was removed.

## Architecture and behavior

`src/helpers/api.ts` extends the existing same-origin helper into the single
transport boundary. `openapi-fetch@0.15.0` uses generated paths, request bodies,
query parameters and responses. Services cover auth register/login/me; catalog
products/detail/categories/category/offers/arrivals/support; canonical cart
read/add/absolute quantity update/delete/clear; and own orders list/detail/place.
Server-side admin authorization remains server-owned; no admin UI was added.

Service results contain `{data, meta, status, requestId}`. Product page metadata
and order cursors are preserved with their generated types. JSON errors become
`ApiError` with status, code, message, details, server request ID and Retry-After.
HTML proxy failures, malformed JSON and malformed success envelopes are rejected.
204 responses skip JSON parsing and return undefined data with null metadata.
Bearer authorization, AbortSignal and an optional caller request ID are explicit
request options. The response request ID remains authoritative: the backend
creates its own X-Request-Id. Cancellation and network failures propagate without
automatic retry or redirects to login. No request bodies, responses, credentials,
Authorization headers, tokens or decoded JWT claims are logged by this layer.
The existing decoded-JWT console log was removed from Header.

The existing hooks keep data/loading/error/refetch behavior and share a typed
service-based request lifecycle. Manual calls reject failures; automatic loads
record errors. Superseded/unmounted requests are aborted and cannot overwrite
newer results. Login/search thunks and the product loader use typed services.
Registration sends username and required email. Support reads data.html; category
and order pages use the actual DTOs, including status and createdAt.

Transport money stays decimal strings. `src/api/adapters.ts` explicitly converts
money to numbers only for existing display models, retains nullable installments,
and normalizes media paths. Product pricing uses the full model base plus the
memory increment, without adding startingPrice. Response DTOs have generated
compile-time types; runtime checks validate envelope structure, not every DTO
field. The contract tests validate every published JSON response example against
its schema, but cannot guarantee a running server follows the pinned schema.

Authenticated cart actions send full SKU IDs, serialize mutations and refetch
the authoritative cart before updating local state. PATCH replaces quantity;
remove/clear handle 204. Failed actions display an error and do not dispatch local
success. Guest cart state remains local; it is not automatically migrated at login.
Checkout submits `{}` for the persisted cart and reuses a sessionStorage
idempotency key after uncertain responses, including component remounts. A known
success clears the key, refreshes the cart, and opens the real order receipt.
Checkout does not DELETE cart lines a second time. Unsupported shipping/payment
fields and the invented cart shipping charge were removed from the purchase flow.

Vite still binds loopback `127.0.0.1:5178` with strictPort. Both `/api` and `/media`
proxy to `http://127.0.0.1:3008`, the host endpoint identified in P12.0. P12.0
reported that this configured endpoint had no active listener; this milestone
does not assert current live readiness. No service was started or restarted.
Browser calls stay on the current origin. `VITE_API_BASE_URL` accepts only a
same-origin path; remote/protocol-relative bases fall back to `/api`. A custom
path needs matching operator-managed proxy routing. Production/preview routing
is outside the Vite development proxy and remains unverified.

## Baseline corrections

Before changes, lint and build passed (build had a bundle-size warning), while
no-emit typecheck reported three existing errors:

- ProductHero: missing CartItem.price. Initialize the incomplete selection at zero
  and calculate model plus memory price when submitting the selected SKU.
- ProductDetail: missing CartItem.price. Use selected model plus memory increment;
  correct the displayed total to use the selected model as well.
- Home: product colors were strings, but the UI type allowed only four phone colors.
  Match the API's unrestricted string colors and give unknown swatches a fallback.

No any, ts-ignore or unsafe type assertions were added to hide these errors.
Nullable financing data is rendered without a fabricated financing claim.
Category summary types are kept distinct from complete product-detail types.
Legacy unused transport-shaped ShoppingCart, Order and SupportData definitions
were removed so they cannot be confused with generated DTOs.

## Verification

- `npm run lint`: PASS. Existing JavaScript lint plus recommended TypeScript rules
  for the API boundary, shared request hooks, adapters and TypeScript tests.
- `npm run typecheck`: PASS for source and TypeScript tests with no emission.
- `npm test`: PASS, 5 files / 330 tests, including Vitest and React Testing Library.
- `npm run contract:check`: PASS, source hash, snapshot and reproducible definitions.
- `npm run build`: PASS. The pre-existing >500 kB bundle warning remains.
- `git diff --check`: PASS.

Coverage includes success/error envelopes; page and cursor metadata; 204 delete
responses; 401/403/409/422/429 status, details and Retry-After; cancellation; stale
React responses; mutation failure behavior and authoritative reconciliation;
registration's required fields; checkout replay headers; custom same-origin bases;
media URL acceptance/rejection; P12.1 routes; numeric-money rejection; proxy/port
settings; and all 294 published JSON response examples.

Initial dependency installation hit an npm 10 peer-resolution crash. Installation
completed with the already installed Node 24.19.0/npm 11 toolchain. Final lint,
typecheck, tests and build also run with the existing default Node 22.23.4 toolchain.
No infrastructure runtime setting was changed. The original lockfile audit reported
9 advisories (1 moderate, 8 high). After patching the newly introduced TypeScript
lint tooling to 8.73.0, the final install reports 8 (1 moderate, 7 high). Remaining
advisories affect existing dependency families; broad dependency remediation was
not performed. This is not a production security acceptance.

## Remaining integration risks and manual acceptance

Browser/live API verification is NOT IMPLEMENTED or claimed. No server health,
database, HTTP integration or real account mutation was exercised. Home continues
to use existing static demo catalog fixtures, whose IDs/options need not match the
actual database. Auth/me is available through the service, while full session
recovery, expired-token UI policy and guest-cart migration need browser acceptance.
The UI still uses existing numeric display models and localStorage token handling.
SessionStorage idempotency intent survives remounts but not a closed browser tab.
If a mutation succeeds but its reconciliation GET fails, an error is displayed;
reload/refetch is required to reconcile that uncertain local state. Cart availability
and totals remain server-authoritative; pricing does not reserve inventory.

With the intended host API and frontend already available through the operator's
approved central runtime strategy:

1. Forward Ubuntu loopback 5178 and open that origin. Confirm catalog/search/detail
   and `/media` use the same origin, with no legacy remote hosts.
2. Use a controlled test account to register/login and inspect `/api/auth/me`.
   Confirm the browser never logs tokens or decoded claims. Exercise 401 expiry
   and 403 responses and verify an understandable error without false success.
3. Select SKU IDs/options from the live catalog, add multiple configurations, reload,
   update quantities, remove a line and clear the cart. Confirm server state,
   refreshed prices, 204 handling and failed-action behavior. Do not rely on home
   fixture IDs for this check.
4. Populate the persisted cart and submit an order. Confirm pending receipt status,
   actual createdAt, server total and consumed cart lines. Simulate an interrupted
   response and retry the same purchase intent; confirm a single order is created.
5. Exercise paging/cursors, navigation cancellation, media failures and forwarding.
   Separately verify production/preview reverse proxy routing before deployment.

GO for the P12.2 typed foundation and local automated gates. NO-GO for browser,
production security or end-to-end integration acceptance until those checks pass.
All implementation changes remain unstaged. No Git writes, backend source edits,
central runtime/infrastructure changes or database operations were performed.

Suggested commit (operator-owned):
`feat(client): establish typed API integration layer`.
Suggested PR title (operator-owned):
`feat(client): establish typed API integration foundation`.

## Changed files

- `docs/integration/P12_2_TYPED_API_FOUNDATION.md`
- `eslint.config.js`
- `package-lock.json`
- `package.json`
- `scripts/api-contract.mjs`
- `src/api/adapters.ts`
- `src/api/openapi.json`
- `src/api/schema.d.ts`
- `src/api/services.ts`
- `src/components/CartItem.tsx`
- `src/components/CompareTable.tsx`
- `src/components/Header.tsx`
- `src/components/ProductHero.tsx`
- `src/contexts/shoppingCart/shoppingCartContext.ts`
- `src/contexts/shoppingCart/shoppingCartProvider.tsx`
- `src/helpers/api.ts`
- `src/helpers/loaders.ts`
- `src/hooks/useApiData.ts`
- `src/hooks/useApiWithReducer.ts`
- `src/hooks/useShoppingCartAction.ts`
- `src/pages/Category.tsx`
- `src/pages/CheckOut.tsx`
- `src/pages/OrderDetail.tsx`
- `src/pages/ProductDetail/ProductDetail.tsx`
- `src/pages/ProductDetail/ProductTitle.tsx`
- `src/pages/ProductDetail/SelectCircle.tsx`
- `src/pages/Register.tsx`
- `src/pages/ShoppingCart.tsx`
- `src/pages/Support.tsx`
- `src/redux/searchSlice.ts`
- `src/redux/userSlice.ts`
- `src/types/custom.d.ts`
- `tests/api.test.ts`
- `tests/config.test.ts`
- `tests/contract.test.js`
- `tests/hooks.test.tsx`
- `tests/register.test.tsx`
- `tsconfig.json`
- `vite.config.js`
- `vitest.config.ts`
