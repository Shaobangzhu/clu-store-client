# P12.5 — Persistent Shopping Cart

## Preconditions and scope

Verified 2026-11-17 before edits: exact branch `feat/p12-persistent-cart`, clean
working tree, HEAD `7f004cd`. Client history contains merged P12.2 commit
`0310b17` (PR #4) and P12.4 commit `e487610` (PR #6). P12.1 backend merge evidence
comes from the checked-in P12.2/P12.4 integration records: backend merge
`8929c5f` contains feature commit `288b6ac`. No sibling repository was accessed
or changed during this milestone.

All changes are in the current client repository and remain unstaged. No Git
writes, gh PR commands, API/infrastructure/schema changes, live HTTP requests,
database mutations, or live checkout tests were performed.

## Implementation

The cart context exposes the complete typed `CartDto`, its lines, readiness,
busy/error state, and asynchronous actions returning a boolean. Only `true`
means a request completed and the resulting server cart was reconciled; rejected,
busy, unauthenticated, stale, and failed operations return `false`.

The reducer accepts only complete server snapshots for cart contents. It no
longer supports local add/remove/update or guest merging. Catalog selection
produces a typed SKU-only input: productId, modelId, memorySizeId, color, qty.
Display fields and preview prices never enter mutation bodies. The old numeric
cart display model and price adapter were removed. Cart unitPrice, lineTotal and
totalAmount remain decimal strings and are formatted without Number conversion.
No client subtotal calculation or shipping charge is added.

Authenticated provider mounts load GET /api/shopping-cart. POST adds the full
SKU, PATCH sets an absolute quantity using the backend line ID, and DELETE uses
the backend line ID (or clears owned lines). Every successful mutation, including
204 deletes, must complete a subsequent GET before publishing a new cart snapshot.
Server decisions about merging identical SKUs or splitting different SKUs are
retained exactly.

One synchronous lock spans initial loads, refreshes, mutations and reconciliation.
Overlapping actions are rejected immediately, not queued. A separate confirmed
snapshot reference gates calls before React commits state updates, preventing a
same-tick retry after a failure. The UI disables mutation controls while busy and
only offers checkout for a ready cart with available products. The checkout page
also observes cart readiness/availability; its API and idempotency flow are unchanged.

A failed write retains the last confirmed snapshot and requires a reload before
another mutation. A successful write followed by a failed GET has a distinct
message explaining that the write was saved and must not be repeated. Reload
performs only GET. Network failures can leave the server outcome uncertain; no
automatic mutation retry is made. Initial load failures do not present an empty
cart as successfully loaded. Errors and controls are translated in all four locales.

The UI supports quantities 1–99, displays unavailable lines, and allows their
removal. Client checks apply the pinned contract limits of 99 units per line,
50 configurations and 500 units per cart. Server unavailable/configuration,
missing-line, quantity-limit and rate-limit errors remain authoritative. A cart
refresh is required after these errors. Inventory is not reserved by the client.

Authentication is required for all V1 cart operations. Signed-out product/cart
pages offer sign-in, with no local anonymous mutations or automatic imports from
old anonymous storage. Account identity/session changes key a fresh provider;
logout removes the old snapshot and errors synchronously. Abort controllers,
request epochs and token checks ignore late loads, writes and reconciliation,
including discarded StrictMode effects. P12.4 transport handling invalidates the
current session on 401 or deadline expiration. Already accepted server writes
cannot be undone by client cancellation.

## Verification

Final checks:

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test -- --reporter=dot`: PASS, 8 files / 427 tests, including 46 cart tests.
- `npm run build`: PASS; existing >500 kB bundle warning remains (618.34 kB JS).
- `git diff --check`: PASS.
- Staged diff: empty; no commit, push or PR creation.

The test run also emits the existing React Router missing HydrateFallback warning.
During implementation, the old catalog test expected a guest Add to Cart button;
it was updated to verify the required sign-in link. A new test fixture's context
type initially failed typecheck and was corrected. A trailing blank line found
by diff checking was removed. No failing gates were suppressed.

Coverage uses mocked services/HTTP only: add and remove, same SKU and every SKU
identity dimension, absolute PATCH payloads and backend IDs, 204 handling,
remount/refetch persistence, guest exclusion, quantity limits, unavailable lines,
initial-load/write/reconciliation failures, rapid calls and immediate failed-call
retries, user switches, logout, unmount, StrictMode, 401 and deadline expiration.
UI checks verify exact large decimal totals, server unit/line prices, quantities
above five, unavailable checkout, disabled controls, and recovery via reload.
Existing guest-reducer and numeric cart-adapter tests were replaced by coverage
of the new server-snapshot behavior; catalog price-preview tests remain.

## Remaining acceptance

Live PostgreSQL persistence and browser integration were not exercised. With an
operator-approved existing runtime and isolated accounts, manually verify:

1. Sign in, add the same complete SKU twice, then vary model, memory or color.
   Confirm server line IDs and quantities, reload the page, and inspect persistence.
2. Adjust quantities rapidly, remove a line and clear the cart. Verify PATCH sends
   absolute qty, controls stay disabled through reconciliation, and totals match GET.
3. Simulate unavailable products, limits, API failures and failed reconciliation.
   Confirm no false success and recover using Reload cart without repeating a write.
4. Log out or switch accounts during delayed requests. Confirm the next account
   never displays the prior cart/error. Exercise expiry and an authenticated 401.
5. Verify guest pages require sign-in and old anonymous storage is never imported.

Do not submit live checkout orders as part of this milestone's acceptance.

Operator-owned suggested commit:
`feat(cart): integrate persistent server-backed cart`

Operator-owned suggested PR title:
`feat(cart): implement server-authoritative shopping cart`
