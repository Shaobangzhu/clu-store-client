# P12.10B — Full-stack quality gate

The client consumes P12.10A at backend merge
`71e0bd151012fba8579dbcf1a839e17e31a6d965` (implementation
`e1aa70d48af3481a9757c612f00bc1063380570a`). Both local backend `main` and
cached `origin/main` contained the merge at precheck. Client branch:
`test/p12-fullstack-e2e-ci`; both repositories were initially clean.
P12.0–P12.9 code/documentation integration is present. P12.9 live runtime
acceptance is separate and does not gate these isolated tests.

## Reproduce locally

Use Node 24/npm 11. Keep the reviewed API checkout at `../clu-store-api`,
with its dependencies and generated Prisma client already installed by the
operator. The launcher refuses a different backend HEAD or dirty worktree.
The existing backend private `.env`, or explicit environment, must provide
`DATABASE_URL` and `TEST_DATABASE_URL`. Never paste these into commands,
reports, shell tracing, or GitHub configuration. Explicit environment wins.

From the client directory:

```bash
export PATH=/home/clu/.nvm/versions/node/v24.19.0/bin:$PATH
npm ci
npm run test:e2e:install
npm run lint
npm run typecheck
npm run contract:check
npm test -- --maxWorkers=2
npm run build
npm run test:e2e:list
npm run e2e:preflight
npm run test:e2e
```

`e2e:preflight` performs read-only SQL. It checks PostgreSQL 18, the backend
URL and live connection guards, and exact reviewed migration names/checksums.
The restricted `clu_test` role must select `clu_store_test`, have no elevated
privileges, and lack CONNECT on every other non-template database. Development
is used only as a URL identity comparison; no development connection is opened.
Any failure is BLOCKED, with no automatic privilege repair, provisioning, reset,
seed, or migration. Missing migrations require separate operator review.

The test command invokes the actual backend `scripts/e2e-run.ts` using Node/tsx.
It inherits the existing test environment without writing secret files in either
repository. The backend owns a temporary loopback API, its shared advisory lock,
private manifest, generated JWT key, fixture creation and exact-ID cleanup.
The child gets `E2E_API_URL` and `E2E_FIXTURE_PATH`; the backend removes database
URLs and JWT_SECRET from that child environment. The client also strips separate
bootstrap/dev/test passwords and debug flags before spawning the runner. The
tests verify the database URL/JWT contract.

Playwright starts Vite at **127.0.0.1:5173**, proxies `/api` and `/media` to the
runner URL, and checks real API readiness before startup. It refuses an existing
frontend listener; CORS matches the exact origin. No Ubuntu API/Vite service is
required or reused. The normal development configuration remains on 5178/3008.

One Chromium worker runs a serial suite with zero retries and a eight-minute
overall deadline. Requests are paced across contexts to respect the real
100/minute limit. Seven login/registration requests stay below the default
10/15-minute authentication budget. Concurrent checkout probes deliberately
dispatch together. No rate limit or authentication bypass is installed.

## Coverage and data ownership

| Test | Real browser/API coverage |
| --- | --- |
| E2E-01 | Browser registration and login; invalid credentials; duplicate signup; USER role |
| E2E-02 | Category-scoped search, empty results, product detail navigation |
| E2E-03 | Browser SKU selection/add, increase/decrease/select quantity, removal; cross-user PATCH/DELETE denied |
| E2E-04 | Browser cart checkout, double click, receipt and trusted total; replay after cart consumption; exactly one order |
| E2E-05 | Browser order history; hidden foreign order; customer admin route and decision denial |
| E2E-06 | Browser admin approval/rejection, status history, immutable decisions, customer-visible final status |
| E2E-07 | Concurrent same-key placement; changed-body conflict; same key scoped to different users |
| E2E-08 | Real API 400/401/422; browser read transport failure and recovery against the real API |
| E2E-09 | Real-login browser session deadline expiry, private UI cleanup, protected routing, independent admin session |

Contexts are separate for customer, other user, admin and signup. Tokens stay in
memory/sessionStorage; no storage-state files are written. All mutations target
runner-owned users/products/orders or one uniquely allocated signup identity.
Search uses the fixture category; tests never pick the first shared catalog row
or admin order. Backend guards, migrations and locking are reused without source
changes. The runner cleans its three identities and dependent fixture rows.

The client allocates a fourth synthetic signup identity in a private temporary
file (directory 0700, file 0600), consumed through `E2E_REGISTRATION_PATH`.
It checks the exact identity is absent before startup. After the backend finishes,
the client reacquires the **same backend lock** and
looks up that exact username AND email, then deletes the exact allocated ID with
matching identity and USER role in a transaction. It never sweeps prefixes or
deletes orders for this account. Cleanup runs after success/failure; cleanup
failure makes the run fail without overwriting an existing child failure code.
SIGINT/SIGTERM are forwarded to the backend, which terminates its child group.

SIGKILL, machine loss, or interrupted startup cannot guarantee cleanup. A failed
signup cleanup retains only its private temporary recovery record. An operator
must inspect exact identities; never reset the database, broaden deletion, or
remove a shared volume. A competing run may prevent lock reacquisition: that is
a cleanup failure requiring inspection, not permission to bypass the lock.

The expiry case advances only the browser clock beyond a genuine login deadline.
It does **not** prove server-side rejection of a genuinely expired signed JWT;
that remains covered by the reviewed backend token tests. Error injection only
aborts a catalog read; no successful API response is mocked. External payments,
shipping, other browsers, and Ubuntu forwarded-browser acceptance are outside
this gate.

## Hosted CI and reports

`.github/workflows/quality.yml` checks out client and backend as sibling folders,
pins the full backend merge SHA, uses Node 24 and lockfile installs, and runs
client lint/typecheck/contract/Vitest/build. On a fresh GitHub-hosted Ubuntu job,
the reviewed backend environment script creates new private random credentials.
Its PostgreSQL 18 **Compose service** uses a run/attempt-specific project and
disposable volume. This reuses P12.10A's initialization SQL, including revoked
PUBLIC CONNECT on maintenance/development databases; it is not a shared host DB.

CI waits for PostgreSQL health, runs the guarded test migration command, then
backend checks and lifecycle smoke. It installs Chromium with OS dependencies,
performs the client preflight, and starts the real API/frontend/browser lifecycle.
An `always()` cleanup removes only that hosted job's Compose project/volume.
Never run these provisioning or volume-removal steps on the shared Ubuntu host.
No deployment, publishing, push or PR step exists. A private backend repository
would require operator-managed cross-repository read access; the workflow does
not embed credentials or assume the client GITHUB_TOKEN grants such access.

Trace, screenshot and video recording are disabled. Playwright output is not
preserved. The custom reporter discards raw errors, request logs, stdout/stderr,
attachments, DOM snapshots and dynamic titles. `e2e-report/summary.json` contains
only static test IDs, statuses, durations, numeric source lines and allowlisted
failure categories. A regression test injects synthetic secrets to verify this.
The launcher also writes `runner.json` with only its phase, exit code and cleanup
status, clearing the previous browser summary at startup. CI uploads only these
two files on failure with **7-day retention**. No manifest,
password, token, `.env`, browser profile, build directory or generic log glob is
uploaded. A pre-browser failure may have only the runner summary. Do not switch to
HTML/trace/raw error reporting against real authentication fixtures.

For Playwright API references, see its official
[web server](https://playwright.dev/docs/test-webserver),
[reporter](https://playwright.dev/docs/test-reporters), and
[clock](https://playwright.dev/docs/clock) documentation.

## Actual verification

Executed on 2026-11-17 with Node 24.19.0 and Playwright 1.65.1:

| Gate | Actual result |
| --- | --- |
| Lint | PASS |
| Typecheck | PASS, including Playwright tests/config/reporter |
| Contract check | PASS; existing OpenAPI content pin unchanged |
| Vitest | PASS: 530 tests, 12 files, including report credential-exclusion regression |
| Production build | PASS; existing 646.20 kB JavaScript chunk warning |
| Database preflight | PASS: restricted test identity, denied other-database access, PostgreSQL 18, migration checksums |
| Playwright Chromium | PASS: 9 passed, 0 failed, 0 skipped; real Express and isolated PostgreSQL |
| Runner/cleanup | Exit 0; backend lifetime ended; exact signup cleanup completed under shared lock |
| Workflow validation | PASS: YAML parsing and actionlint 1.7.7; this is static validation only |
| Git diff whitespace | PASS |

Earlier browser attempts failed while the pinned browser was missing and while
test waits raced session restoration/request pacing. Those runs returned failure
and completed scoped cleanup; no successful E2E result is inferred from them.
The final complete run passed all nine cases. No application source fix or backend
source edit was needed. Git operations remained read-only and changes are unstaged.

Dependency installation reported 21 audit findings (20 high, one moderate).
No dependency-wide audit remediation was attempted in this milestone.
Static workflow validation and existing isolated-DB browser execution do not
establish fresh hosted provisioning or Ubuntu live runtime acceptance.

- Fresh CI provisioning: **BLOCKED locally**. Docker socket access is denied,
  including outside the sandbox. No container, volume, infrastructure or service
  changes were made. Hosted Actions was not dispatched.
- Ubuntu live browser acceptance: **PENDING operator**, independently of this gate.
