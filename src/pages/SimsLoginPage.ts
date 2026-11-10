import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the NSU SIMS Login screen.
 * Encapsulates authentication input controls, buttons, and alert messages.
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginCard: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.usernameInput = page.locator('#userName')
      .or(page.locator('input[name="userName"]'))
      .or(page.getByLabel(/user\s*name/i));

    this.passwordInput = page.locator('#userPassword')
      .or(page.locator('input[name="userPassword"]'))
      .or(page.locator('input[type="password"]'));

    this.submitButton = page.locator('#btnLogin')
      .or(page.locator('form[name="frm"] input[type="submit"]'))
      .or(page.locator('input[type="submit"][value*="Login" i]'))
      .or(page.locator('input[type="submit"]'));

    this.loginCard = page.locator('#loginForm')
      .or(page.locator('.login-form, .login-box').first());

    this.errorMessage = page.locator('#lblMessage')
      .or(page.locator('.alert-danger, .error-message').first());

    this.forgotPasswordLink = page.locator('#forgotPassword')
      .or(page.locator('a[href*="forgot" i]').first());
  }

  /**
   * Navigates to the SIMS login page.
   */
  async goto(): Promise<void> {
    await this.navigate('common/login');
  }

  /**
   * Enters the username or user ID.
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
  }

  /**
   * Enters the account password.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the login submit button.
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Composite action: fills credentials and submits authentication form.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
    await this.waitForReady();
  }

  /**
   * Reads error banner text if present.
   */
  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return (await this.errorMessage.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Checks if login form is still visible.
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.submitButton.isVisible();
  }
}

