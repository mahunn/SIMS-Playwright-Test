import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Approved Requests Dashboard.
 * URL: /simsnew/common/getUserDashboard/EditGraduateBasic_Approved
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsApprovedRequestsPage extends BasePage {
  readonly approvedTable: Locator;
  readonly searchFilterInput: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.approvedTable = page.locator('#dataTable');

    this.searchFilterInput = page.locator('#dataTable_filter input')
      .or(page.locator('input[type="search"]'));

    this.tableRows = page.locator('#dataTable tbody tr');
  }

  /**
   * Navigates directly to the Approved Requests page.
   */
  async goto(): Promise<void> {
    await this.navigate('common/getUserDashboard/EditGraduateBasic_Approved');
    await this.waitForReady();
  }

  /**
   * Filters the Approved Requests DataTable by student ID.
   */
  async filterByStudentId(studentId: string): Promise<void> {
    if (await this.searchFilterInput.isVisible()) {
      await this.searchFilterInput.fill(studentId);
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Retrieves the specific table row matching a student ID (defaults to most recent).
   */
  getApprovedRow(studentId: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: studentId }).first();
  }

  /**
   * Retrieves all matching table rows for a student ID.
   */
  getApprovedRows(studentId: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: studentId });
  }

  /**
   * Reads the full text of the approved row.
   */
  async getRowText(studentId: string): Promise<string> {
    const row = this.getApprovedRow(studentId);
    if (await row.isVisible()) {
      return (await row.textContent())?.trim() ?? '';
    }
    return '';
  }
}

