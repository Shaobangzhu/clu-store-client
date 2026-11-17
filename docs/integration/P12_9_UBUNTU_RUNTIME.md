# P12.9 — Ubuntu runtime integration runbook

Inspection: 2026-11-17 UTC. **NO-GO for live full-stack runtime acceptance.**
The API and Vite are stopped; the central development and test databases answer
read-only queries. This report does not claim successful live proxy, CORS or
browser verification. No runtime configuration change is currently indicated by
the evidence. Operator startup and a repeat of the checks below are required.

## Preconditions and scope

Working repository: `/home/clu/projects/clu-store-client`, exact branch
`chore/p12-ubuntu-runtime-integration`, HEAD `4ab5b32`. Initial working tree was
clean. Read-only ancestry checks confirmed these integrated client commits:

| Milestone | Commit |
| --- | --- |
| Initial integration foundation | `84b4a15` |
| P12.2 typed API | `0310b17` |
| P12.3 catalog | `db67c05` |
| P12.4 auth/session | `e487610` |
| P12.5 persisted cart | `11df6c8` |
| P12.6 checkout | `861e59c` |
| P12.7 order management | `4e4f7b0` |
| P12.8 navigation/UI | `823691b` |

Sibling API HEAD is merge `8929c5f`; P12.1 commit `288b6ac` is an ancestor.
The client contract check matches its pinned backend source and generated types.
These checks use local history; no remote freshness is asserted or fetched.

Only this runbook was added. The client build writes ignored `dist/` artifacts.
No Git write operations, service starts/restarts, infrastructure edits, secret
changes, migrations, seeds or commerce mutations were performed. Related API and
infrastructure paths were inspected read-only. Credentials were consumed privately
for bounded SQL queries; no secret values or connection URLs were printed.

## Actual topology and exposure

| Component | Configuration | Observed runtime |
| --- | --- | --- |
| Vite | `127.0.0.1:5178`, strict port | No listener; GET `/` refused |
| Host API | `127.0.0.1:3008` | No listener; GET `/health` and `/ready` refused |
| Vite `/api` | Preserve path to `http://127.0.0.1:3008` | GET `/api/products` on 5178 refused |
| Vite `/media` | Preserve path to `http://127.0.0.1:3008` | GET `/media/demo-placeholder.svg` on 5178 refused |
| Central CLU DB | `127.0.0.1:55438` → container `5432` | Listener; authenticated SELECT succeeded |
| Independent API Compose | Default API `127.0.0.1:3000`, DB `127.0.0.1:5433` | Neither port listening; not the central topology |

Both API repository `.env` and central `server.env` select host 3008, loopback
55438, development database/role `clu_store_dev`/`clu_dev` and separate test
database/role `clu_store_test`/`clu_test`. Central runtime files are outside Vite's
normal project env discovery; their existence does not mean Vite consumes them.
The reviewed Vite configuration supplies the actual host, port and proxy targets.

Host `ss -ltnp` outside the sandbox showed other loopback listeners on 55435,
55436, 55437 and 27017. Central Compose maps the first three to PPI, AQGRP and
PSGI databases respectively. Their presence does not conflict with CLU ports.
No occupied 3008/5178 port conflict was detected. This is a point-in-time check;
retain strictPort and investigate any later collision rather than changing ports
or stopping another project's process. SSH listens publicly; that does not make
the loopback database or stopped application endpoints publicly accessible.

Central Compose project `infra021011`, service `clu-db`, declares restart policy
`unless-stopped`, a PostgreSQL readiness healthcheck, dedicated network `clu_db`
and volume `clu_pg18_data`. Docker socket permission was denied even outside the
sandbox: current container identity, restart count and health are NOT VERIFIED.
SQL verified both configured database identities and container port 5432 using
`BEGIN READ ONLY`, identity/port/constant SELECT, then `ROLLBACK`; no business
rows were queried. This does not reverify P12.0 privilege isolation or migrations.

## Startup, supervision and logs

API scripts use Node env-file loading: `dev` uses tsx/watch on `src/server.ts`;
`start` uses `dist/server.js`. API engines require Node 24/npm 11. Installed
`/home/clu/.nvm/versions/node/v24.19.0` satisfies this; the default Node 22.23.4 /
npm 10.9.9 does not satisfy the API engines. Do not rebuild the read-only sibling
repository here or assume its existing `dist/` matches source.

Vite runs in the foreground with `npm run dev`. No Node/npm/Vite/PM2 process was
found in the host process-name check. No CLU unit appeared in the system service
unit-file check or the user service list. `~/.config/systemd/user` and `~/.pm2`
were absent. No CLU persistent supervisor was identified in these checks; custom
wrappers, other accounts and alternate PM2 homes were not exhaustively audited.
Creating a unit or changing runtime configuration requires operator approval.

No repo-local `logs/` directory or application `.log` file was found outside
dependencies/build output. Thus **historical sanitized runtime error logs are
NOT VERIFIED**; absence of logs does not prove absence of errors. Container logs
remain inaccessible. Source inspection confirms Pino redacts credential fields,
and request completion logs use generated request ID, method, status and duration,
excluding raw URLs, headers and bodies. This policy is not a live log audit.

When logs become available, inspect CLU-only output locally. Share only reviewed
request IDs, numeric statuses/durations and known error codes. Do not dump env
files, process environments, unfiltered journals, Docker inspect/config output,
request headers/bodies, tokens or database URLs. Redaction is not a guarantee that
arbitrary historical free-text errors are safe to paste.

## Operator CLU-only startup procedure (not executed)

Use two dedicated remote terminals under the existing account. First recheck
`ss -ltnp` for free 3008 and 5178 and the existing 55438 listener. If an intended
supervisor is later found, use its approved procedure instead of starting duplicate
processes. If the central DB is unavailable, stop and ask its operator; do not
launch the API repository's independent Compose database.

The following foreground commands use existing dependencies and the central API
env file. A minimal environment avoids inherited database/port overrides. They do
not install, migrate, seed or build the sibling API. Review the existing central
profile privately before use; if it needs changes, document them and stop for
operator approval. These are operator instructions, not actions taken by P12.9.

API terminal (Node 24, source execution to avoid stale dist):

```bash
cd /home/clu/projects/clu-store-api
env -i HOME="$HOME" PATH=/home/clu/.nvm/versions/node/v24.19.0/bin:/usr/bin:/bin \
  node --env-file=/home/clu/infra/runtime/clu-store-api/server.env \
  --import tsx src/server.ts
```

Client terminal:

```bash
cd /home/clu/projects/clu-store-client
env -i HOME="$HOME" PATH=/home/clu/.nvm/versions/node/v24.19.0/bin:/usr/bin:/bin \
  npm run dev -- --host 127.0.0.1 --port 5178 --strictPort
```

Keep these terminals attached. Ctrl-C only in the terminal owning the CLU process
you started; never use broad kill commands. These commands provide no reboot,
logout or crash supervision. Do not use Compose up/down, migration tools profiles,
environment setup scripts, database smoke/integration scripts or database reset
commands as runtime verification.

## Read-only verification after startup

Run on the Ubuntu host; no bearer credentials are needed:

```bash
ss -ltnp
curl --noproxy '*' --connect-timeout 2 --max-time 6 -fsS http://127.0.0.1:3008/health
curl --noproxy '*' --connect-timeout 2 --max-time 6 -fsS http://127.0.0.1:3008/ready
curl --noproxy '*' --connect-timeout 2 --max-time 6 -fsS http://127.0.0.1:5178/ -o /dev/null
curl --noproxy '*' --connect-timeout 2 --max-time 6 -fsS http://127.0.0.1:5178/api/products -o /dev/null
curl --noproxy '*' --connect-timeout 2 --max-time 6 -fsSI http://127.0.0.1:5178/media/demo-placeholder.svg
```

Require health 200 with `data.status=ok`, readiness 200 with
`data.status=ready` and `data.database=up`, products 200 with a JSON success
envelope, and media 200 with `image/svg+xml`. Inspect products' content type and
envelope as well as status: a Vite HTML fallback is not a proxy pass. Compare
direct API `/api/products` and `/media/demo-placeholder.svg` with their proxied
responses; check image bytes match. Readiness performs a bounded SELECT only and
does not prove schema currency, catalog completeness, auth or commerce readiness.
Health and readiness paths are root API paths; `/api/health` is not a substitute.

CORS allows exactly `http://localhost:5178` and `http://127.0.0.1:5178` in the
inspected profile. API source accepts absent Origin, rejects other origins with
403 `CORS_ORIGIN_DENIED`, and exposes `X-Request-Id`. After startup, repeat:

```bash
curl --noproxy '*' --connect-timeout 2 --max-time 6 -sS -i -H 'Origin: http://localhost:5178' http://127.0.0.1:3008/health
curl --noproxy '*' --connect-timeout 2 --max-time 6 -sS -i -H 'Origin: http://127.0.0.1:5178' http://127.0.0.1:3008/health
curl --noproxy '*' --connect-timeout 2 --max-time 6 -sS -i -H 'Origin: https://denied.invalid' http://127.0.0.1:3008/health
```

Require 200 and the exact matching allow-origin header for each allowed origin;
require 403 and no allow-origin grant for the denied origin. Current probes for
all three refused connection, so live CORS enforcement is NOT VERIFIED. Do not
widen CORS or binds to work around a failed probe.

## Remote-SSH and browser acceptance

Forward remote `127.0.0.1:5178` through VS Code Remote-SSH Ports, with local
visibility private/loopback. Open `http://localhost:5178`. Browser `/api` and
`/media` remain on that origin and Vite reaches the remote API on loopback; no DB
forward is needed. Optionally forward API 3008 for direct health/docs inspection.
An equivalent workstation command is:

```bash
ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:5178:127.0.0.1:5178 <ubuntu-ssh-alias>
```

If the local port is occupied, inspect the actual forwarded origin. The current
exact CORS list supports 5178 only: a different browser port can cause proxied
requests carrying Origin to be rejected as well as direct cross-origin requests.
Keep 5178 or obtain operator review of any CORS change. Do not disable Origin
checks or expose Vite/API publicly. Protocol, hostname and port all matter.

Actual SSH tunnel, Vite HMR, browser catalog/navigation, media display, console
and network behavior: **NOT VERIFIED**. After operator startup, check read-only
catalog/search/detail/support and image loading from the forwarded origin; verify
requests stay same-origin and no credentials appear in the console. Auth, cart,
checkout and admin mutation flows require separate authorization and acceptance;
do not run commerce smoke tests against development data under this runbook.

## Evidence and P12.0 comparison

Baseline: sibling API `docs/integration/P12_UBUNTU_PREFLIGHT.md`, dated
2026-11-16, integrated by API merge `f5b9abf`.

| Area | P12.0 | P12.9 |
| --- | --- | --- |
| Host topology | API 3008, Vite 5178, central DB 55438 | Same; both app endpoints still stopped |
| DB | Read-only connectivity and role isolation | Both database/role identities and connectivity rechecked; isolation not repeated |
| Proxy | `/api` only | `/api` and `/media` configured; live forwarding NOT VERIFIED |
| Contract gaps | Missing auth/me and cart PATCH; client envelope/cart/checkout mismatches | P12.1 and client P12.2–P12.8 integrated; pinned contract matches; live workflows NOT VERIFIED |
| Client gates | Not run; no dedicated suite | Build PASS; focused existing contract/config/transport suite 3 files / 324 tests PASS |
| Toolchain | Default Node 22 outside API engines | Unchanged; installed Node 24/npm 11 available |
| Docker | Socket denied | Still denied; container health/logs NOT VERIFIED |
| Browser/SSH | Not exercised | NOT VERIFIED |

Executed client `npm run build`: PASS with existing >500 kB chunk warning
(646.20 kB JS before gzip). `npm run contract:check`: PASS.
`npm exec vitest run tests/contract.test.js tests/config.test.ts tests/api.test.ts`:
PASS, 324 tests; mocks/schema/config checks, not live HTTP evidence. No new tests
were added for this documentation-only change. No full client suite or backend
mutation/integration suite was run. `git diff --check`: PASS.

Host HTTP probes used bounded Python urllib GETs without credentials. All eight
probes (health, readiness, frontend, two proxy paths, three CORS origins) returned
connection refused. Sandbox socket restrictions were distinguished from actual
host results by repeating network/listener checks outside the sandbox.

## Deployment-independent limitations and decision

GO for this documented runtime inspection and client build/contract checks.
**NO-GO for P12.9 live runtime integration acceptance** until the intended API and
Vite are running and read-only health, readiness, proxy and forwarded-browser
checks pass. No configuration fix is justified solely by stopped services.

Development Vite is not a deployment plan. A build does not provision API routes,
media routing, TLS, authentication hardening or persistent supervision. Preview
and production routing have not been tested; the development proxy must not be
assumed to establish either. In-memory API rate limits, disabled proxy trust,
browser token storage and the existing bundle-size warning remain separate
review concerns. Backend inventory and money remain authoritative; readiness does
not reserve stock or validate purchase workflows. No payment deployment is proven.

Operator owns all staging, commits, pushes and PR management. Suggested commit:
`docs(integration): add Ubuntu runtime verification guide`. Suggested PR title:
`chore(integration): validate Ubuntu full-stack runtime`.
