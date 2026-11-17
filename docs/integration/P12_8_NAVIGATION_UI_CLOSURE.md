# P12.8 — Navigation and UI Closure

Precheck on 2026-11-17: expected branch `fix/p12-integration-ui-closure`, clean
working tree, HEAD `c73b355`. Reviewed P12.2/P12.4–P12.7 records and merged
catalog, authentication, persisted cart, checkout and order implementations.
No Git writes, backend/database/infrastructure edits or live mutations occurred.

## Audit and changes

- Preserved live category slug navigation, tablet slug mapping, actual product
  IDs, authenticated order links and verified ADMIN navigation. Catalog, search,
  detail and order pages already use typed services and request recovery states.
- Router child paths consistently use relative definitions; generated navigation
  destinations remain absolute. User landing route is an index. Obsolete account
  and order definitions now point to `/user`. Cart and product sign-in links carry
  the string return path accepted by the existing sign-in flow.
- Header logo returns home. Home link uses exact matching. Search, language,
  theme, cart and menu buttons have localized accessible names. Search label is
  associated with its input. Opening the menu focuses its close button; Escape
  closes it and returns focus. Search also supports Escape and focus return.
  Route changes close transient header UI. Menu sits above its dismissal overlay.
- Support consumes typed `{html, locale}` with locale metadata on content. Loading,
  empty, safe error and explicit retry messages cover all four languages. A DOM
  reconstruction allowlist preserves documentation formatting and a small safe
  link vocabulary while discarding all other attributes, executable elements,
  media, forms, styles and non-HTML namespaces. Raw errors are never displayed.
- Existing ProductImage missing/error recovery is preserved. VideoHero tries both
  sources then displays a localized unavailable state; it includes native controls
  and playsInline. Generic route loading and error/not-found copy are localized
  without changing page styling. Error fallback defaults to 500 rather than 404.
- Audited HTTP call sites: `src/helpers/api.ts` remains the sole fetch boundary;
  no legacy API host references remain in client source. No transport change needed.

## Verification

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test -- --reporter=dot`: PASS, 11 files / 529 tests.
- `npm run build`: PASS, existing >500 kB chunk warning remains.
- `git diff --check`: PASS.

New tests cover unsafe support elements, namespaces, attributes and URL protocols,
allowed links, support errors/retry/empty content, image fallback and recovery,
both video failures, header keyboard/focus handling and translation key parity.
Existing suites cover real route navigation, category/product destinations,
authentication, cart/checkout and user/admin order behavior. All HTTP tests are
mocked. React Router HydrateFallback and isolated i18next test warnings remain.

Live browser/API acceptance was not performed. Operator acceptance should check
mobile/wide layouts, keyboard navigation, all four locales, real support content,
broken media and request failures using the existing approved runtime. Production
reverse-proxy behavior remains outside this client milestone. No unsupported
commerce behavior, redesign or runtime changes were introduced.

Suggested operator-owned commit: `fix(client): resolve navigation and integration gaps`

Suggested operator-owned PR title: `fix(client): complete navigation and UI integration`

Changes remain unstaged; no commit, push or PR was created.
