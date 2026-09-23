import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'node server/index.js',
    env: { PORT: '4173', DATA_DIR: 'test-results/runtime' },
    url: 'http://127.0.0.1:4173/api/session',
  },
});
