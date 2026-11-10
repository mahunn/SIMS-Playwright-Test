import { Page, Response } from '@playwright/test';

/**
 * Abstract Base Page Object.
 * Encapsulates common page interactions, lifecycle synchronization, and navigation.
 * 
 * Strict POM Rule: Page Objects must NEVER contain expect() assertions.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Deterministic readiness check.
   * Ensures DOM content is loaded and page document has finished initial parsing.
   */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForFunction(() => document.readyState !== 'loading');
  }

  /**
   * Navigates to a relative or absolute URL path and waits for readiness.
   */
  async navigate(path: string = ''): Promise<Response | null> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForReady();
    return response;
  }

  /**
   * Retrieves current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Retrieves page document title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Reloads the current page safely.
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForReady();
  }
}

