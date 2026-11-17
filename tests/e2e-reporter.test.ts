// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import type { TestCase, TestResult } from '@playwright/test/reporter';
import SafeReporter from '../e2e/safe-reporter';

vi.mock('node:fs', () => {
  const mocks = { mkdirSync: vi.fn(), writeFileSync: vi.fn() };
  return { ...mocks, default: mocks };
});

it('publishes only allowlisted diagnostics even when titles, errors and attachments contain credentials', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const secret = 'sensitive-password-token-database-url';
  const reporter = new SafeReporter();
  reporter.onTestEnd({ title: `E2E-01 ${secret}` } as TestCase, {
    status: 'failed', duration: 42,
    errors: [{ message: secret, stack: `Error ${secret}\n at fullstack.spec.ts:123:4` }],
    stdout: [secret], stderr: [secret], attachments: [{ name: secret, body: Buffer.from(secret) }],
  } as TestResult);
  reporter.onError();
  reporter.onEnd({ status: 'failed', startTime: new Date(), duration: 42 });
  const output = vi.mocked(writeFileSync).mock.calls[0]![1] as string;
  expect(output).not.toContain(secret);
  expect(JSON.parse(output)).toEqual({ status: 'failed', infrastructureErrors: 1,
    tests: [{ test: 'E2E-01', status: 'failed', durationMs: 42, category: 'assertion-or-setup', failureLine: 123 }] });
  expect(JSON.stringify(log.mock.calls)).not.toContain(secret);
});
