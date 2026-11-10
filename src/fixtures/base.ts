import {
  test as baseTest,
  expect,
  Browser,
  BrowserContext,
  Page,
  BrowserContextOptions,
} from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { SimsLoginPage } from '../pages/SimsLoginPage';
import { SimsLandingPage } from '../pages/SimsLandingPage';
import { SimsGraduatesPage } from '../pages/SimsGraduatesPage';
import { SimsEditGraduatePage } from '../pages/SimsEditGraduatePage';
import { SimsPendingRequestsPage } from '../pages/SimsPendingRequestsPage';
import { SimsApprovedRequestsPage } from '../pages/SimsApprovedRequestsPage';

export const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'playwright/.auth/sims-user.json');

/**
 * Creates an authenticated browser context utilizing the persisted storage state.
 * Fallback to standard context if auth storage state has not been generated yet.
 */
export async function getAuthenticatedSimsContext(
  browser: Browser,
  options?: BrowserContextOptions
): Promise<BrowserContext> {
  const hasStorageState = fs.existsSync(STORAGE_STATE_PATH);
  return await browser.newContext({
    storageState: hasStorageState ? STORAGE_STATE_PATH : undefined,
    ...options,
  });
}

/**
 * Creates and returns an isolated page inside an authenticated context.
 */
export async function getAuthenticatedSimsPage(
  browser: Browser,
  options?: BrowserContextOptions
): Promise<Page> {
  const context = await getAuthenticatedSimsContext(browser, options);
  return await context.newPage();
}

/**
 * Custom Fixtures Interface for NSU SIMS.
 */
export interface SimsFixtures {
  loginPage: SimsLoginPage;
  landingPage: SimsLandingPage;
  graduatesPage: SimsGraduatesPage;
  editGraduatePage: SimsEditGraduatePage;
  pendingRequestsPage: SimsPendingRequestsPage;
  approvedRequestsPage: SimsApprovedRequestsPage;
  authenticatedPage: Page;
}

/**
 * Extended Playwright test instance providing custom Page Objects
 * and pre-authenticated state management.
 */
export const test = baseTest.extend<SimsFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new SimsLoginPage(page);
    await use(loginPage);
  },

  landingPage: async ({ page }, use) => {
    const landingPage = new SimsLandingPage(page);
    await use(landingPage);
  },

  graduatesPage: async ({ page }, use) => {
    const graduatesPage = new SimsGraduatesPage(page);
    await use(graduatesPage);
  },

  editGraduatePage: async ({ page }, use) => {
    const editGraduatePage = new SimsEditGraduatePage(page);
    await use(editGraduatePage);
  },

  pendingRequestsPage: async ({ page }, use) => {
    const pendingRequestsPage = new SimsPendingRequestsPage(page);
    await use(pendingRequestsPage);
  },

  approvedRequestsPage: async ({ page }, use) => {
    const approvedRequestsPage = new SimsApprovedRequestsPage(page);
    await use(approvedRequestsPage);
  },

  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },
});

export { expect };
