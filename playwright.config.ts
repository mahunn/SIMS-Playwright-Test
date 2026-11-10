import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

export const STORAGE_STATE_PATH = path.join(__dirname, 'playwright/.auth/sims-user.json');
export const SIMS_BASE_URL = process.env.SIMS_BASE_URL || 'http://10.102.11.254/simsnew/';

export default defineConfig({
  testDir: './tests',
  timeout: 45 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  /* University servers are stateful; single worker preserves session integrity */
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: SIMS_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    headless: process.env.HEADLESS !== 'false',
  },
  projects: [
    /* 1. Global Setup Authentication Phase */
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.ts/,
    },

    /* 2. Primary Chromium Suite reusing authenticated storageState */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['setup'],
      testIgnore: [/.*auth\.setup\.ts/],
    },
  ],
});

