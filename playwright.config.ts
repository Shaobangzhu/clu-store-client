import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 90_000,
  globalTimeout: 480_000,
  expect: { timeout: 20_000 },
  reporter: [['./e2e/safe-reporter.ts']],
  outputDir: './test-results',
  // DOM snapshots and action call logs can contain password inputs and tokens.
  preserveOutput: 'never',
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'off', screenshot: 'off', video: 'off',
    serviceWorkers: 'block', actionTimeout: 20_000, navigationTimeout: 30_000, ...devices['Desktop Chrome'] },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'node scripts/e2e-vite.mjs',
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'ignore', stderr: 'ignore',
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
});
