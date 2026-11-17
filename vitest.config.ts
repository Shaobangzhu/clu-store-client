import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', include: ['tests/**/*.test.{js,ts,tsx}'], restoreMocks: true,
    environmentOptions: { jsdom: { url: 'http://localhost:5178' } } },
});
