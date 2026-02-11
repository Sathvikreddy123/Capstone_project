import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const reporters: any[] = [
  ['html'],
  ['json', { outputFile: 'test-results.json' }]
];

if (process.env.RP_API_KEY) {
  const rpConfig = {
    apiKey: process.env.RP_API_KEY,
    endpoint: process.env.RP_ENDPOINT,
    project: process.env.RP_PROJECT,
    launch: process.env.RP_LAUNCH,
    attributes: [
      { key: 'agent', value: 'playwright' },
      { key: 'env', value: 'manual_run' },
    ],
    description: 'Playwright Regression Run',
  };
  reporters.push(['@reportportal/agent-js-playwright', rpConfig]);
}

export default defineConfig({
  testDir: './src',
  timeout: 30000,
  fullyParallel: false,

  /**
   * Retry Strategy:
   * - CI: 2 retries to handle transient failures (network issues, race conditions)
   * - Local: 0 retries to surface flakiness immediately during development
   *
   * Rationale: Retries in CI improve reliability without masking issues. Developers
   * should see failures immediately to fix flaky tests at the source.
   */
  retries: process.env.CI ? 2 : 0,

  workers: 1,
  reporter: reporters,

  use: {
    baseURL: 'https://automationexercise.com',

    /**
     * Trace Capture Strategy:
     * - 'on-first-retry': Only capture traces when a test fails and is retried
     * 
     * Rationale: Balances diagnostic value with performance/storage costs.
     * Traces are expensive (CPU, disk space) but invaluable for debugging flaky tests.
     * 
     * Alternative: 'retain-on-failure' captures traces on first failure (no retry needed)
     * but increases storage costs. Consider for local debugging.
     */
    trace: 'on-first-retry',

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
