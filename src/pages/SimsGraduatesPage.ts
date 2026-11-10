import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the SIMS Graduates Search and List Page.
 * URL: /simsnew/graduates
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsGraduatesPage extends BasePage {
  readonly studentIdInput: Locator;
  readonly searchButton: Locator;
  readonly graduatesTable: Locator;
  readonly editGraduateLink: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.studentIdInput = page.locator('#studentNumber');
    this.searchButton = page.locator('#outerSearchButton');
    this.graduatesTable = page.locator('#dataTable');
    this.editGraduateLink = page.locator('a[href*="editGraduateBasic"]').first();
  }

  /**
   * Navigates directly to the Graduates list page.
   */
  async goto(): Promise<void> {
    await this.navigate('graduates');
    await this.waitForReady();
  }

  /**
   * Fills the Student ID search field and submits search.
   */
  async searchStudent(studentId: string): Promise<void> {
    await this.studentIdInput.waitFor({ state: 'visible' });
    await this.studentIdInput.fill(studentId);
    await this.searchButton.click();
    await this.editGraduateLink.waitFor({ state: 'visible' });
  }

  /**
   * Clicks the Edit action icon for the found graduate.
   */
  async clickEditGraduate(): Promise<void> {
    await this.editGraduateLink.waitFor({ state: 'visible' });
    await this.editGraduateLink.click();
    await this.waitForReady();
  }

  /**
   * Retrieves the row containing the student ID.
   */
  getStudentRow(studentId: string): Locator {
    return this.page.locator('tr').filter({ hasText: studentId });
  }
}
