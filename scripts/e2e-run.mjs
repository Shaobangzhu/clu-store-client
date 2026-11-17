import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { randomBytes, createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = resolve(root, '../clu-store-api');
const pin = '71e0bd151012fba8579dbcf1a839e17e31a6d965';
let phase = 'backend revision and environment';
let directory;
let registration;
let acquireTestRun;
let Client;
let connectionString;
let started = false;
let interrupted = false;
let cleanup = 'not-started';
const reportDirectory = join(root, 'e2e-report');

async function cleanupRegistration() {
  // The backend child has finished and released its lock. Reacquire the SAME
  // lock; if another run owns it, fail closed and keep the private recovery file.
  const release = await acquireTestRun(process.env);
  const client = new Client({ connectionString, connectionTimeoutMillis: 2000, statement_timeout: 5000 });
  try {
    await client.connect();
    await client.query('BEGIN');
    const result = await client.query('SELECT id, role FROM "User" WHERE username = $1 AND email = $2 FOR UPDATE',
      [registration.username, registration.email]);
    if (result.rows.length > 1 || result.rows.some(row => row.role !== 'USER')) throw new Error('Unexpected registration ownership');
    if (result.rows[0]) {
      const id = result.rows[0].id;
      // No order/history deletion for this identity: registration tests only log in.
      // Foreign references cause a failure instead of a cleanup ownership guess.
      const removed = await client.query('DELETE FROM "User" WHERE id = $1 AND username = $2 AND email = $3 AND role = $4',
        [id, registration.username, registration.email, 'USER']);
      if (removed.rowCount !== 1) throw new Error('Registration cleanup mismatch');
    }
    await client.query('COMMIT');
  } finally { try { await client.end(); } finally { await release(); } }
}

try {
  if (!process.argv.includes('--preflight')) {
    await mkdir(reportDirectory, { recursive: true });
    await rm(join(reportDirectory, 'summary.json'), { force: true });
  }
  if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Node 24 required');
  const git = args => execFileSync('git', args, { cwd: backend, encoding: 'utf8' }).trim();
  if (git(['log', '-1', '--format=%H']) !== pin || git(['status', '--porcelain'])) throw new Error('Backend pin or worktree mismatch');
  if (existsSync(join(backend, '.env'))) process.loadEnvFile(join(backend, '.env'));
  const requireBackend = createRequire(join(backend, 'package.json'));
  const { register } = requireBackend('tsx/esm/api');
  register();
  const guard = await import(pathToFileURL(join(backend, 'scripts/test-database-guard.ts')).href);
  ({ acquireTestRun } = await import(pathToFileURL(join(backend, 'tests/helpers/database-setup.ts')).href));
  ({ Client } = requireBackend('pg'));
  connectionString = guard.testDatabaseUrl(process.env);
  phase = 'read-only test database identity, privileges and migrations';
  const client = new Client({ connectionString, connectionTimeoutMillis: 2000, statement_timeout: 5000 });
  try {
    await client.connect();
    await client.query('BEGIN READ ONLY');
    await guard.assertTestConnection(client);
    const version = await client.query('SHOW server_version_num');
    if (Math.floor(Number(version.rows[0].server_version_num) / 10000) !== 18) throw new Error('PostgreSQL 18 required');
    const applied = await client.query('SELECT migration_name, checksum, finished_at, rolled_back_at FROM _prisma_migrations');
    const migrations = join(backend, 'prisma/migrations');
    const names = (await readdir(migrations, { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
    if (applied.rows.length !== names.length) throw new Error('Migration count mismatch');
    for (const name of names) {
      const checksum = createHash('sha256').update(await readFile(join(migrations, name, 'migration.sql'))).digest('hex');
      if (!applied.rows.some(row => row.migration_name === name && row.checksum === checksum && row.finished_at && !row.rolled_back_at)) {
        throw new Error('Migration checksum mismatch');
      }
    }
    await client.query('ROLLBACK');
  } finally { await client.end(); }
  console.log('E2E preflight passed: pinned backend, restricted PostgreSQL 18 test identity and reviewed migrations.');
  if (!process.argv.includes('--preflight')) {
    phase = 'backend runner and Chromium';
    directory = await mkdtemp(join(tmpdir(), 'clu-client-e2e-'));
    const username = `p12_${randomBytes(12).toString('hex')}`;
    registration = { username, email: `${username}@example.test`, password: randomBytes(24).toString('base64url') };
    const registrationPath = join(directory, 'registration.json');
    const ownershipProbe = new Client({ connectionString, connectionTimeoutMillis: 2000, statement_timeout: 5000 });
    try {
      await ownershipProbe.connect();
      const existing = await ownershipProbe.query('SELECT id FROM "User" WHERE username = $1 OR email = $2',
        [registration.username, registration.email]);
      if (existing.rows.length) throw new Error('Registration identity already exists');
    } finally { await ownershipProbe.end(); }
    await writeFile(registrationPath, JSON.stringify(registration), { mode: 0o600, flag: 'wx' });
    // No shell, no migrations, and no replacement for the reviewed backend runner.
    const runnerEnv = { ...process.env, E2E_CORS_ORIGINS: 'http://127.0.0.1:5173', E2E_REGISTRATION_PATH: registrationPath };
    for (const name of ['CLU_DEV_PASSWORD', 'CLU_TEST_PASSWORD', 'POSTGRES_PASSWORD', 'JWT_SECRET', 'DEBUG', 'PWDEBUG']) delete runnerEnv[name];
    const child = spawn(process.execPath, ['--import', 'tsx', 'scripts/e2e-run.ts', process.execPath,
      join(root, 'node_modules/@playwright/test/cli.js'), 'test', '--config', join(root, 'playwright.config.ts')], {
      cwd: backend, stdio: ['ignore', 'inherit', 'ignore'],
      env: runnerEnv,
    });
    started = true;
    const stop = () => { interrupted = true; child.kill('SIGTERM'); };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    try {
      process.exitCode = await new Promise((resolveExit, reject) => {
        child.once('error', reject);
        child.once('exit', code => resolveExit(interrupted ? 130 : code ?? 1));
      });
    } finally {
      process.removeListener('SIGINT', stop);
      process.removeListener('SIGTERM', stop);
    }
  }
} catch {
  console.error(`E2E BLOCKED/FAILED during ${phase}. Raw errors suppressed to protect credentials.`);
  process.exitCode = 1;
} finally {
  if (directory) {
    try {
      if (started) await cleanupRegistration();
      await rm(directory, { recursive: true, force: true });
      cleanup = 'completed';
      console.log('Scoped registration cleanup completed.');
    } catch {
      cleanup = 'failed';
      console.error('Registration cleanup FAILED. Private recovery record retained in the clu-client-e2e-* temporary directory; inspect exact identity manually.');
      if (!process.exitCode) process.exitCode = 1;
    }
  }
  if (!process.argv.includes('--preflight')) {
    await mkdir(reportDirectory, { recursive: true });
    await writeFile(join(reportDirectory, 'runner.json'), JSON.stringify({
      exitCode: process.exitCode ?? 0, phase, cleanup,
    }, null, 2));
  }
}
