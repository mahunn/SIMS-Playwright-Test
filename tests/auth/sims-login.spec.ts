import { test, expect } from '../../src/fixtures/base';
import testUsers from '../data/sims-test-users.json';

test.describe('NSU SIMS Portal — Authentication & Dashboard Smoke Suite', () => {

  test('TC-SIMS-001: Verified Authenticated Session & Dashboard Readiness @smoke', async ({
    page,
    landingPage,
  }) => {
    // Navigate to SIMS landing page using existing authenticated storage state
    await landingPage.goto();

    // Web-First Assertions: Verify URL does not redirect back to login
    await expect(page).not.toHaveURL(/login/i);

    // Web-First Assertions: Verify Dashboard Header and Navigation components
    await expect(
      landingPage.dashboardHeader
        .or(landingPage.navigationMenu)
        .or(landingPage.mainContentArea)
    ).toBeVisible();

    // Verify session termination / logout control is present and accessible
    await expect(landingPage.logoutButton).toBeVisible();
  });

  test('TC-SIMS-002: Navigation Bar & Core Portal Modules Available @smoke', async ({
    landingPage,
  }) => {
    await landingPage.goto();

    // Assert that the portal primary navigation container is visible and accessible
    await expect(landingPage.navigationMenu).toBeVisible();

    // Assert at least one primary functional module link is present
    await expect(
      landingPage.profileLink
        .or(landingPage.advisingLink)
        .or(landingPage.degreeAuditLink)
    ).toBeVisible();
  });

  test('TC-SIMS-003: Login Form Validation on Fresh Session @smoke', async ({
    browser,
  }) => {
    // Create an unauthenticated context to test fresh login entry point
    const freshContext = await browser.newContext({ storageState: undefined });
    const freshPage = await freshContext.newPage();

    const { SimsLoginPage } = await import('../../src/pages/SimsLoginPage');
    const freshLogin = new SimsLoginPage(freshPage);

    await freshLogin.goto();

    // Verify login form elements are visible and ready for interaction
    await expect(freshLogin.usernameInput).toBeVisible();
    await expect(freshLogin.passwordInput).toBeVisible();
    await expect(freshLogin.submitButton).toBeVisible();

    // Attempt invalid login
    await freshLogin.login(
      testUsers.invalidUser.username,
      testUsers.invalidUser.password
    );

    // Assert error message or retention of login form
    await expect(
      freshLogin.errorMessage.or(freshLogin.submitButton)
    ).toBeVisible();

    await freshContext.close();
  });
});

