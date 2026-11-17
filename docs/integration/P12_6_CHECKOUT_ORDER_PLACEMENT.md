# P12.6 — Checkout and Order Placement

## Preconditions and scope

Verified on 2026-11-17 before edits: branch
`feat/p12-checkout-order-placement`, clean working tree, HEAD `e1f5dbe`.
The client history contains merged P12.2 (`0310b17`), P12.3 (`db67c05`),
P12.4 (`e487610`) and P12.5 (`11df6c8`). Read-only inspection of the sibling
backend confirmed P12.1 commit `288b6ac` is an ancestor of HEAD `8929c5f` and
its working tree is clean. The client and backend OpenAPI files both hash to
`018989b1204de13fdadb7e9d98ad34a0f7f34e32ac00ba50404e165104dc32fc`.

No Git writes, commits, branch changes, pushes or PR operations were performed.
No backend, database, schema, infrastructure or payment integration changes were
made. All automated HTTP/state-mutation tests use mocked requests and synthetic
in-memory fixtures. No live orders or database records were created.

## Transaction flow

`/checkout` is now Demo Order Review. It displays the current server cart's
product/model/memory/color/specification, quantity, unit price, line total,
total quantity, currency and total amount. Decimal money strings are formatted
without floating-point conversion or client subtotal calculations. There are
no payment/shipping submission controls, and both checkout and order detail
explicitly say that no payment is collected and no shipping is arranged.

The existing protected routes require authentication. A new purchase also
requires a ready, nonempty cart with available, valid SKU identities and
quantities within the contract limits. Cart loading/mutation blocks submission.
Backend validation and repricing remain authoritative at transaction time.

On the first explicit submission, a UUID is generated and a versioned intent is
written and read back from sessionStorage **before** POST. The body is always
`{}` and the header is always `Idempotency-Key`. A synchronous lock spans the
request and subsequent cart refresh; repeated clicks cannot send a second POST.
No automatic placement or retry runs during mount, restoration or StrictMode.

Each account has one intent at `clu.checkout.intent.v1:<userId>`. Its record
contains version, user ID, key, state and, after confirmation, order ID. It
contains no credentials, prices, cart contents or customer contact information.
P12.6 deliberately retains these account-scoped records across logout/session
expiry, replacing the old checkout's loss of retry identity on new login. Only
the authenticated matching account reads the record. A valid legacy unscoped
key is migrated on submission within its existing session; the old auth cleanup
still removes that legacy key on logout/new login.

Intent states:

- **Unresolved:** persisted before sending. Network failure, a 30-second timeout,
  malformed/unusable receipt or uncertain server response retains the key.
  Aborting transport never implies server rollback. Reloading the same tab
  offers an explicit same-order retry, including when GET cart is empty,
  unavailable or failed: the backend checks replay before cart validation.
- **Review required:** 422 responses retain the key and require an explicit
  successful cart reload plus a valid nonempty cart before retrying. Empty cart
  and invalid SKU/configuration/availability/amount failures have explanatory UI.
- **Conflict:** 409 blocks further submission, persists across reload, and asks
  for operator resolution. The client never silently replaces a conflicting key.
- **Confirmed:** only HTTP 201 or 200 with a valid backend order ID confirms
  success. Persist confirmation, call the provider's GET cart reconciliation,
  then navigate with replace to `/orders/<id>`. No cart DELETE or manual clear
  occurs. A failed GET does not turn the confirmed order into a failed purchase;
  order detail offers GET-only cart recovery. A reload after confirmation cannot
  accidentally resubmit. A subsequent purchase requires the explicit “Review a
  new demo order” action and a valid cart before its new key is generated.

Storage read/write/corruption failures block submission instead of falling back
to an unrecoverable in-memory key. If persisting a confirmed receipt fails, the
previous durable unresolved key remains available for safe replay. Old account,
old route, unmounted and timed-out responses cannot overwrite a newer intent or
navigate a different session. The existing auth transport still handles 401 and
deadline expiry; the same account can recover its intent after signing in again.

## Order details

The existing canonical `/orders/:id` route remains protected. It issues GET for
the current order, including after a 200 placement replay, because replay returns
the original pending receipt even if the order has since been approved/rejected.
The page displays the backend order ID, current status, created/updated UTC
timestamps, currency, exact total, immutable purchased item snapshots, and status
history with from/to status, timestamp and optional decision note. Pending,
approved and rejected are rendered as review statuses, with no paid/refunded
claims. Refresh performs GET only. Invalid IDs are rejected without a request;
404 and other retrieval failures have safe, recoverable messages. Account and
route boundaries discard stale order data synchronously.

All new checkout/order labels and recovery messages cover en-US, fr-FR, zh-CN
and zh-TW. ESLint includes the new files. Vitest aliases now match the application's
existing aliases so the integration test can exercise the actual route tree.

## Verification

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test -- --reporter=dot`: PASS, 9 files / 483 tests, including 56 new
  checkout/order tests.
- `npm run build`: PASS; the existing >500 kB chunk warning remains (635.89 kB JS).
- `npm run contract:check`: PASS; backend source hash, snapshot and generated
  definitions match.
- `git diff --check`: PASS. Staged diff remains empty.

Tests cover HTTP 201 creation and 200 replay, exact request body/header, API cart
reconciliation with no DELETE, rapid submission during both placement and GET,
timeout with late response, network/proxy failure, reload during unresolved and
confirmed submissions, replay with empty/invalid/unloaded cart, empty and invalid
new carts, all contract 422 cart error codes, 409 persistence, 429/503 retry,
storage failures, legacy-key migration, new purchase identity, failed receipt
persistence, failed post-success cart GET, 401 reauthentication, demo expiry,
account switching, StrictMode, actual application routing, all three order
statuses, history, invalid order IDs, 404/500 recovery and route races.

An initial lint run caught an unused test import. The first expanded full suite
caught missing Vitest aliases for the application route tree and a fake-clock
fixture initialized after its session timer. Both test setup issues were fixed;
no failing gates were suppressed. The existing React Router HydrateFallback
warning remains in the catalog test suite.

## Backend contract limits and remaining acceptance

There is no blocking mismatch with the pinned placement contract. These recovery
limits remain and were not addressed by modifying the backend:

1. No read-only order lookup by idempotency key is exposed. POST with the same key
   is the only supported reconciliation operation. If the original attempt never
   committed, retry can create the order from the **current** persisted cart.
   The key fingerprints cart purchase intent, not reviewed contents or prices.
   Recovery UI therefore asks users not to change their cart while unresolved.
   Another tab/device can still change it; the client cannot enforce a frozen
   reviewed-cart guarantee with this contract.
2. A 409 conflict does not supply a recoverable receipt/order ID. It remains
   blocked for operator investigation; inventing a replacement key is unsafe.
3. Key recovery is scoped to the same browser tab's sessionStorage. Closing the
   tab, clearing browser data or moving to another browser is outside this
   guarantee. Independent tabs have independent purchase intents. Storage-disabled
   browsers cannot submit through this flow.
4. No inventory reservation, final-price hold, payment or fulfillment is provided.
   Live API behavior, database transaction guarantees, browser appearance and
   production reverse-proxy routing remain manual acceptance items. Mocked client
   tests do not independently prove backend atomicity.

## Manual acceptance — operator-owned, isolated environment only

Use an approved existing runtime pointed at an isolated test database/account
and disposable SKU data. Do not run checkout mutations against the development
or production database. No runtime startup or live mutation is part of the
automated checks above.

1. Sign in and populate a valid cart. Open `/checkout`; verify all displayed
   amounts and SKU options match GET cart, demo wording is clear, and there are
   no payment or shipping inputs. Submit once; inspect POST `{}` and its key,
   HTTP 201, subsequent GET cart, and navigation to `/orders/<actual id>`.
   Verify purchased lines were consumed by the backend without client DELETE.
2. With another isolated purchase, double-click while throttling the response.
   Verify one active POST and one order. Block/drop a placement response after
   dispatch, wait for the uncertainty message, and retry: the exact key must
   repeat. If the original committed, expect 200 and the original order ID.
3. Reload the same tab during a delayed/uncertain submission. Verify it does not
   automatically POST, retains the same key and allows explicit recovery even
   after the cart is empty. Do not change cart contents while recovering.
4. Exercise an empty cart, unavailable SKU and a SKU invalidated after review.
   New invalid submissions must be blocked; server 422 must require cart reload
   and correction. Use an isolated response fixture for 409 and confirm it stays
   blocked across reload without key rotation. Check 429 and CHECKOUT_BUSY retain
   the key and never automatically retry.
5. Let the session expire during an uncertain attempt or inject an authenticated
   401. Sign back into the same account in the same tab and retry the saved
   intent. Switch accounts while a response is delayed; verify no previous cart,
   order, error or redirect appears for the new account.
6. Fail the cart GET after successful placement. Verify the canonical receipt
   still opens, confirmed success is retained, and “Reload cart” sends only GET.
   Return to checkout with a refilled isolated cart; a new purchase must require
   explicit review and get a distinct key.
7. Open and reload `/orders/<id>` directly. Using approved isolated backend test
   fixtures/operator actions, check pending, approved and rejected states and
   ordered history/notes. Verify refreshing a replayed receipt shows current
   status. Check invalid, foreign and missing order IDs and sign-out protection.
   Review all four locales and narrow/wide browser layouts.

All changes remain unstaged for operator review.
Suggested commit: `feat(checkout): implement idempotent demo checkout`.
Suggested PR title: `feat(checkout): integrate idempotent order placement`.

## Changed files

- `src/pages/CheckOut.tsx`
- `src/pages/OrderDetail.tsx`
- `src/checkout/intent.ts` (new)
- `src/components/OrderItems.tsx` (new)
- `src/auth/session.ts` (comment documenting account-scoped intent retention)
- `src/assets/languages/en-US.json`, `fr-FR.json`, `zh-CN.json`, `zh-TW.json`
- `tests/checkout.test.tsx` (new)
- `eslint.config.js`
- `vitest.config.ts`
- `docs/integration/P12_6_CHECKOUT_ORDER_PLACEMENT.md` (new)
