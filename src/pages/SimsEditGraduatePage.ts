import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Edit Graduate Basic Information.
 * URL: /simsnew/students/editGraduateBasic/<id>
 * 
 * Strict POM Rule: Locators and actions only; NEVER put expect() assertions here.
 */
export class SimsEditGraduatePage extends BasePage {
  readonly pageHeading: Locator;
  readonly studentIdDisplay: Locator;
  readonly studentNameInput: Locator;
  readonly major1Select: Locator;
  readonly major2Select: Locator;
  readonly minorSelect: Locator;
  readonly submitButton: Locator;
  readonly confirmationAlert: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Preference: Element ID (#id) for full SIMS website stability
    this.pageHeading = page.locator('#pageHeading, h2:has-text("Edit Graduate Basic Information")')
      .or(page.getByRole('heading', { name: /Edit Graduate Basic Information/i }));

    this.studentIdDisplay = page.locator('#studentId, #lblStudentId')
      .or(page.getByText(/Student ID\s*:\s*\d+/i));

    this.studentNameInput = page.locator('#studentName')
      .or(page.locator('input[name="studentName"]').first());

    this.major1Select = page.locator('#major1');
    this.major2Select = page.locator('#major2');
    this.minorSelect = page.locator('#minor');

    this.submitButton = page.locator('#submit')
      .or(page.locator('input[type="submit"][value*="Submit" i]'))
      .or(page.getByRole('button', { name: 'Submit' }));

    this.confirmationAlert = page.locator('#lblMessage, .alert').first();

    this.backButton = page.locator('#btnBack, button:has-text("Back"), a:has-text("Back")');
  }

  /**
   * Selects a Minor program by option value (e.g. '21') or visible label (e.g. 'Mathematics - 21').
   */
  async selectMinor(valueOrLabel: string): Promise<void> {
    await this.minorSelect.waitFor({ state: 'visible' });
    // Try by value or by label
    try {
      await this.minorSelect.selectOption({ value: valueOrLabel });
    } catch {
      await this.minorSelect.selectOption({ label: valueOrLabel });
    }
  }

  /**
   * Selects a Minor program different from current value to ensure a real change is submitted.
   * If current value is already preferred, toggles to another valid option.
   */
  async selectDifferentMinor(preferredValue: string = '21'): Promise<string> {
    await this.minorSelect.waitFor({ state: 'visible' });
    const currentValue = await this.minorSelect.inputValue();
    let targetValue = preferredValue;

    if (currentValue === preferredValue) {
      const options = await this.minorSelect.locator('option').all();
      for (const opt of options) {
        const val = await opt.getAttribute('value');
        if (val && val !== '' && val !== currentValue) {
          targetValue = val;
          break;
        }
      }
    }

    await this.minorSelect.selectOption({ value: targetValue });
    return targetValue;
  }

  /**
   * Selects a Major 1 program by option value or label.
   */
  async selectMajor1(valueOrLabel: string): Promise<void> {
    await this.major1Select.waitFor({ state: 'visible' });
    try {
      await this.major1Select.selectOption({ value: valueOrLabel });
    } catch {
      await this.major1Select.selectOption({ label: valueOrLabel });
    }
  }

  /**
   * Clicks the Submit button to submit the change request.
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
    await this.waitForReady();
  }

  /**
   * Clicks the Back button after submission.
   */
  async clickBack(): Promise<void> {
    await this.backButton.waitFor({ state: 'visible' });
    await this.backButton.click();
    await this.waitForReady();
  }

  /**
   * Retrieves confirmation alert text.
   */
  async getConfirmationText(): Promise<string> {
    if (await this.confirmationAlert.isVisible()) {
      return (await this.confirmationAlert.textContent())?.trim() ?? '';
    }
    return '';
  }
}
