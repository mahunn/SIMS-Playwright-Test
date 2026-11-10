import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Pending Requests Dashboard.
 * URL: /simsnew/common/getUserDashboard/EditGraduateBasic_Pending
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsPendingRequestsPage extends BasePage {
  readonly pendingTable: Locator;
  readonly searchFilterInput: Locator;
  readonly tableRows: Locator;
  readonly confirmationModal: Locator;
  readonly confirmApproveButton: Locator;
  readonly cancelApproveButton: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.pendingTable = page.locator('#dataTable');
    this.searchFilterInput = page.locator('#dataTable_filter input')
      .or(page.locator('input[type="search"]'));

    this.tableRows = page.locator('#dataTable tbody tr');

    // SweetAlert confirmation dialog elements
    this.confirmationModal = page.locator('.swal2-popup, .swal2-modal');
    this.confirmApproveButton = page.locator('.swal2-confirm')
      .or(page.getByRole('button', { name: 'Yes, approve it!' }));
    this.cancelApproveButton = page.locator('.swal2-cancel')
      .or(page.getByRole('button', { name: 'Cancel' }));
  }

  /**
   * Navigates directly to the Edit Graduate Basic Pending Requests page.
   */
  async goto(): Promise<void> {
    await this.navigate('common/getUserDashboard/EditGraduateBasic_Pending');
    await this.waitForReady();
  }

  /**
   * Uses DataTable filter/search box to filter rows by student ID.
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
  getPendingRow(studentId: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: studentId }).first();
  }

  /**
   * Retrieves all matching table rows for a student ID.
   */
  getPendingRows(studentId: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: studentId });
  }

  /**
   * Fills the supervisor comment / reason input for a specific student's row.
   */
  async fillComment(studentId: string, comment: string): Promise<void> {
    const row = this.getPendingRow(studentId);
    await row.locator('#comment-box, input[name="comment"]').waitFor({ state: 'visible' });
    await row.locator('#comment-box, input[name="comment"]').fill(comment);
  }

  /**
   * Clicks the Accept button on the specified student's row.
   */
  async clickAccept(studentId: string): Promise<void> {
    const row = this.getPendingRow(studentId);
    const acceptBtn = row.locator('input#accept, input[value="Accept"]').first();
    await acceptBtn.waitFor({ state: 'visible' });
    await acceptBtn.click();
  }

  /**
   * Confirms the SweetAlert approval modal.
   */
  async confirmApproval(): Promise<void> {
    await this.confirmApproveButton.waitFor({ state: 'visible' });
    await this.confirmApproveButton.click();
    await this.waitForReady();
  }

  /**
   * Composite workflow: fills comment, clicks Accept, and confirms approval.
   */
  async approveRequest(studentId: string, comment: string = 'ok'): Promise<void> {
    await this.fillComment(studentId, comment);
    await this.clickAccept(studentId);
    await this.confirmApproval();
  }

  /**
   * Retrieves Changed Info text for the given student row.
   */
  async getChangedInfoForStudent(studentId: string): Promise<string> {
    const row = this.getPendingRow(studentId);
    if (await row.isVisible()) {
      return (await row.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Checks if an approval request for student ID is listed in the pending table.
   */
  async isRequestPending(studentId: string): Promise<boolean> {
    const row = this.getPendingRow(studentId);
    return await row.isVisible();
  }
}
