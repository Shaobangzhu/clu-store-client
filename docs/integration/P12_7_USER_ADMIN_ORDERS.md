# P12.7 — User and Admin Orders

## Preconditions

Before editing on 2026-11-17, verified exact branch
`feat/p12-order-management`, clean working tree, and HEAD `813e92b`.
History contains merged P12.2 (`0310b17`), P12.3 (`db67c05`), P12.4
(`e487610`), P12.5 (`11df6c8`), and P12.6 (`861e59c`, merge `813e92b`).
The P12.6 integration record documents verification of the P12.1 backend
ancestor `288b6ac`. Contract validation confirms the pinned backend contract
and generated client definitions still match.

No Git writes were performed. Changes remain unstaged. No backend,
infrastructure, database, account provisioning, or live API mutations occurred.

## Behavior

- `/user` replaces the placeholder with authenticated order history from
  GET `/api/orders`, including for ADMIN users. The backend scopes ownership;
  the client does not send an owner selector or treat a cursor as authorization.
- `/admin/orders` lists all orders from GET `/api/admin/orders` for a verified
  ADMIN. Both the main navigation and user sidebar use the identity obtained
  through `/auth/me`. Direct non-admin navigation shows a forbidden message and
  does not request the admin list. Backend checks remain the security boundary.
- Both lists request 20 orders in newest order. Next page passes the exact opaque
  `nextCursor` with the same sort, replacing the visible page. First page clears
  the cursor. A failed page can retry the same cursor. No offset, count, page
  number, search, or fabricated filtering parameters are sent.
- Lists show immutable item snapshots, created/updated UTC timestamps, status,
  exact decimal totals and currency. Links open canonical `/orders/:id` details,
  where the existing status history and decision notes remain visible.
- Verified admins can approve or reject pending orders from the detail view,
  optionally supplying a trimmed plain `metadata.note` of up to 500 characters.
  Controls disappear for terminal orders. There are no payment, refund,
  cancellation or fulfillment actions.
- A synchronous lock covers an admin POST and its subsequent detail GET. Both
  decision controls and the ordinary refresh control are disabled while busy.
  A synchronous guard also blocks a repeated decision before React renders.
  Success is reconciled through GET rather than optimistic status/history edits.
- Rejected/invalid/conflicting/uncertain writes block further decisions until an
  explicit GET reconciliation. No mutation automatically retries. A failed GET
  after successful POST can recover with GET only. HTTP 403 is shown without
  invalidating an otherwise active session; HTTP 401 uses existing session
  invalidation and protected-route redirection. Foreign/missing detail responses
  expose no order data or raw server errors.
- Account, session generation, role and route changes remount scoped views;
  request cancellation and session checks discard old responses. Aborting a
  request does not imply rollback of an accepted server decision.
- New labels and errors cover en-US, fr-FR, zh-CN and zh-TW. Existing Apple-style
  components and layout are reused; sidebar entries now navigate to real routes.

## Verification

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test -- --reporter=dot`: PASS, 10 files / 513 tests.
- `npm run build`: PASS, existing >500 kB bundle warning (642.07 kB JS).
- `npm run contract:check`: PASS.
- `git diff --check`: PASS. Staged diff empty.

Thirty new mocked tests cover user/admin own history, detail navigation,
opaque cursor preservation and page recovery, empty results, admin listing,
role-based navigation, direct-route restrictions, foreign/forbidden/missing
orders, account-switch races, unauthenticated access, authenticated 401 on reads
and decisions, approve/reject payloads, saved history notes, terminal states,
rapid opposite/repeated actions, 403/409/422/500 decision failures, GET-only
recovery after successful writes, and late decisions across account changes.
Existing session-deadline and checkout tests also pass. An initial typecheck
caught the contract's string query type for pageSize. Initial test assertions
were corrected to distinguish total from line total and use the existing detail
heading. No checks were suppressed. The existing catalog HydrateFallback
warning remains.

## Backend requirements and remaining acceptance

No backend changes are required by the pinned contract. These mocked client
checks do not prove live database ownership isolation, transaction-time role
rechecks, or atomic transitions. Client locks apply to the mounted review view;
concurrent tabs/operators still rely on backend transition validation and 409.

Manual acceptance remains for an operator-approved isolated environment with
existing isolated USER and ADMIN fixtures. Do not create live administrator
accounts. Verify two users cannot read one another's orders; an admin can review
across owners while own history stays scoped; opposite concurrent decisions
produce the backend conflict; revoked roles receive 403; session expiry removes
protected data; and pagination/detail navigation render correctly at narrow and
wide widths in all four locales. Verify reload after a dropped decision response
shows authoritative history without automatically resubmitting a decision.

Suggested operator-owned commit:
`feat(orders): integrate user and admin order management`

Suggested PR title:
`feat(orders): add order history and admin review`
