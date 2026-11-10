import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { SimsLoginPage } from '../src/pages/SimsLoginPage';
import { SimsLandingPage } from '../src/pages/SimsLandingPage';

const authFile = path.resolve(process.cwd(), 'playwright/.auth/sims-user.json');

setup('authenticate into NSU SIMS portal and cache session', async ({ page }) => {
  const username = process.env.SIMS_USERNAME || 'test_user';
  const password = process.env.SIMS_PASSWORD || 'your_secure_password';

  // Ensure target directory exists for auth storage state
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new SimsLoginPage(page);
  const landingPage = new SimsLandingPage(page);

  // 1. Navigate to SIMS entry portal
  await loginPage.goto();

  // 2. Submit credentials
  await loginPage.login(username, password);

  // 3. Web-First Assertion: Validate successful transition into authenticated dashboard
  await expect(page).toHaveURL(/.*registrarDashboard.*/i);
  await expect(landingPage.logoutButton).toBeVisible();

  // 4. Persist authenticated session state (cookies, local storage)
  await page.context().storageState({ path: authFile });
});

