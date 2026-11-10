import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the NSU SIMS Registrar / Post-Login Dashboard.
 * Encapsulates navigation menu, welcome headers, dashboard metrics, and action links.
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsLandingPage extends BasePage {
  readonly userBadge: Locator;
  readonly dashboardHeader: Locator;
  readonly navigationMenu: Locator;
  readonly logoutButton: Locator;
  readonly mainContentArea: Locator;

  // Registrar Dashboard specific controls
  readonly userWelcomeText: Locator;
  readonly homeLink: Locator;
  readonly studentsMenu: Locator;
  readonly graduatesLink: Locator;
  readonly pendingRequestsLink: Locator;
  readonly approvedRequestsLink: Locator;

  // Additional navigation links
  readonly profileLink: Locator;
  readonly advisingLink: Locator;
  readonly degreeAuditLink: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.navigationMenu = page.locator('#navbar');
    this.mainContentArea = page.locator('#main-container');

    this.dashboardHeader = page.locator('#dashboardTitle, .page-header, .content-header')
      .or(page.getByRole('heading', { level: 1 }))
      .or(page.getByRole('heading', { level: 2 }));

    this.userBadge = page.locator('#lblUserName, .user-info, .profile-name').first()
      .or(page.getByText(/Welcome\s+GRADEDITOR|Welcome\s+PARVIN|Welcome\s+CONTROLLER/i));

    this.userWelcomeText = page.getByText(/Graduate Edit Entry in Registrar Office|Controller of Examinations|Nayma Parvin/i);

    this.logoutButton = page.locator('a[href*="logout" i]')
      .or(page.getByRole('link', { name: /log\s*out/i }));

    // Navigation and menu items
    this.homeLink = page.getByRole('link', { name: 'Home' })
      .or(page.locator('a[href*="registrarDashboard"], a:has-text("Home")').first());

    this.studentsMenu = page.getByRole('link', { name: /Students/i })
      .or(page.locator('a:has-text("Students")').first());

    this.graduatesLink = page.getByRole('link', { name: 'Graduates' })
      .or(page.locator('a[href*="graduates"], a:has-text("Graduates")').first());

    this.pendingRequestsLink = page.getByRole('link', { name: /Pending Requests/i })
      .or(page.locator('a[href*="EditGraduateBasic_Pending"]').first());

    this.approvedRequestsLink = page.getByRole('link', { name: /Approved Requests/i })
      .or(page.locator('a[href*="Approved"]').first());

    this.profileLink = page.getByRole('link', { name: /profile/i })
      .or(page.locator('a[href*="profile"]').first());

    this.advisingLink = page.getByRole('link', { name: /advising/i })
      .or(page.locator('a[href*="advising"]').first());

    this.degreeAuditLink = page.getByRole('link', { name: /degree\s*audit/i })
      .or(page.locator('a[href*="audit"]').first());
  }

  /**
   * Navigates directly to the registrar dashboard.
   */
  async goto(): Promise<void> {
    await this.navigate('common/registrarDashboard');
    await this.waitForReady();
  }

  /**
   * Retrieves the logged-in user profile / badge text.
   */
  async getUserBadgeText(): Promise<string> {
    if (await this.userBadge.isVisible()) {
      return (await this.userBadge.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Navigates to Students -> Graduates page via menu interaction.
   */
  async navigateToGraduates(): Promise<void> {
    // Hover/click Students menu to reveal dropdown, then click Graduates
    if (await this.graduatesLink.isVisible()) {
      await this.graduatesLink.click();
    } else {
      await this.studentsMenu.hover();
      if (!await this.graduatesLink.isVisible()) {
        await this.studentsMenu.click();
      }
      await this.graduatesLink.waitFor({ state: 'visible' });
      await this.graduatesLink.click();
    }
    await this.waitForReady();
  }

  /**
   * Clicks on the Pending Requests link on the dashboard.
   */
  async clickPendingRequests(): Promise<void> {
    await this.pendingRequestsLink.waitFor({ state: 'visible' });
    await this.pendingRequestsLink.click();
    await this.waitForReady();
  }

  /**
   * Clicks logout link to terminate session.
   */
  async clickLogout(): Promise<void> {
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
    await this.waitForReady();
  }
}
