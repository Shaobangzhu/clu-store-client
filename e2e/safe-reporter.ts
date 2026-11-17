import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { FullResult, Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

// Allowlist output fields. Never serialize error objects, attachments, steps,
// stdout/stderr, environments, requests, bodies, fixture manifests or storage.
export default class SafeReporter implements Reporter {
  private results: { test: string; status: string; durationMs: number; failureLine?: number; category: string }[] = [];
  private infrastructureErrors = 0;
  private lines = new Map<string, number>();
  onStepBegin(test: TestCase, _result: TestResult, step: TestStep) {
    if (step.location?.file.endsWith('/fullstack.spec.ts')) this.lines.set(test.id, step.location.line);
  }
  onTestEnd(test: TestCase, result: TestResult) {
    const id = test.title.match(/^E2E-\d{2}\b/)?.[0] ?? 'unlabelled-test';
    const failureLine = result.errors.flatMap(error => error.stack?.match(/fullstack\.spec\.ts:(\d+):/)?.[1] ?? [])[0]
      ?? (result.status !== 'passed' ? this.lines.get(test.id) : undefined);
    const message = result.errors[0]?.message ?? '';
    const category = /Executable doesn't exist/.test(message) ? 'browser-missing'
      : /Timeout|timeout/.test(message) ? 'timeout' : result.errors.length ? 'assertion-or-setup' : 'none';
    this.results.push({ test: id, status: result.status, durationMs: result.duration, category,
      ...(failureLine ? { failureLine: Number(failureLine) } : {}) });
    console.log(`${id}: ${result.status} [${category}]${failureLine ? ` (spec line ${failureLine})` : ''}`);
  }
  onError() { this.infrastructureErrors++; }
  onEnd(result: FullResult) {
    const directory = fileURLToPath(new URL('../e2e-report/', import.meta.url));
    mkdirSync(directory, { recursive: true });
    writeFileSync(`${directory}/summary.json`, JSON.stringify({ status: result.status,
      infrastructureErrors: this.infrastructureErrors, tests: this.results }, null, 2));
    console.log(`Chromium: ${result.status}; ${this.results.length} tests reported; ${this.infrastructureErrors} infrastructure errors.`);
  }
}
