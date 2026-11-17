import { createServer, mergeConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import base from '../vite.config.js';

try {
  const target = process.env.E2E_API_URL;
  const fixture = JSON.parse(await readFile(process.env.E2E_FIXTURE_PATH, 'utf8'));
  if (!target || !/^http:\/\/127\.0\.0\.1:[1-9]\d*$/.test(target) || fixture.version !== 1 || fixture.baseURL !== target) {
    throw new Error('Runner contract missing');
  }
  const ready = await fetch(`${target}/ready`, { signal: AbortSignal.timeout(5000) });
  if (!ready.ok || (await ready.json()).data.database !== 'up') throw new Error('API not ready');
  const server = await createServer(mergeConfig(base, {
    configFile: false,
    root: fileURLToPath(new URL('../', import.meta.url)),
    envFile: false,
    define: { 'import.meta.env.VITE_API_BASE_URL': JSON.stringify('/api') },
    server: { host: '127.0.0.1', port: 5173, strictPort: true,
      proxy: { '/api': target, '/media': target } },
  }));
  await server.listen();
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { void server.close().then(() => process.exit()); });
} catch {
  console.error('E2E frontend startup failed: check runner contract, API readiness and availability of loopback port 5173.');
  process.exitCode = 1;
}
