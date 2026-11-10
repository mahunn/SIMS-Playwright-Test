# AGENTS.md — Antigravity Agent Rules & Guidelines

This document specifies mandatory rules and conventions for any autonomous agent working on the **North South University (NSU) SIMS Portal** test automation codebase.

---

## 1. Core Architecture & Philosophy

The NSU SIMS test suite is built on **Playwright with TypeScript** utilizing the **Page Object Model (POM)** pattern. It mirrors the exact architecture that ensures 100% stability in the NSU RDS suite:
- Single-worker test execution (`workers: 1`) to preserve university stateful server sessions.
- Reusable authentication setup storing global browser context in `playwright/.auth/sims-user.json`.
- Strict separation of concern between Page Objects (locators & actions) and Test Specs (assertions & flows).

---

## 2. Strict Locator Hierarchy

When locating elements on the NSU SIMS portal, agents **MUST** strictly prioritize element IDs so that future UI redesigns or text changes do not break tests:

1. **`page.locator('#elementId')`** — **Primary preference for all SIMS portal elements** (e.g., `#userName`, `#studentNumber`, `#outerSearchButton`, `#minor`, `#major1`, `#major2`, `#comment-box`, `#accept`, `#decline`, `#dataTable`).
2. **`page.getByRole('role', { name: 'Accessible Name' })`** — Interactive elements without unique IDs (modal buttons, alerts).
3. **`page.getByLabel('Label Text')`** — Form fields with associated `<label>` elements.
4. **`page.getByPlaceholder('Placeholder Text')`** — Input elements with stable placeholder text.
5. **`page.getByTestId('test-id')`** — When explicit test attributes (`data-testid`) exist.
6. **`page.getByText('Static Text')`** — Strictly for verifying or anchoring static non-interactive copy.
7. **Scoped CSS / Attributes (`input[name="..."]`, `a[href*="..."]`)** — Target specific forms and endpoints when IDs are absent.

---

## 3. Web-First Assertions

- **Always** use Playwright's web-first assertions:
  ```typescript
  await expect(locator).toBeVisible();
  await expect(locator).toHaveText('Expected Text');
  await expect(page).toHaveURL(/.*dashboard/);
  ```
- **Never** use manual polling loops or manual boolean checks like:
  ```typescript
  // FORBIDDEN:
  const isVisible = await locator.isVisible();
  expect(isVisible).toBe(true);
  ```

---

## 4. Zero Sleep Policy

- **Arbitrary sleeps (`page.waitForTimeout(...)`) are strictly FORBIDDEN.**
- Every wait must be deterministic and tied to an observable state transition:
  - `await locator.waitFor({ state: 'visible' })`
  - `await page.waitForLoadState('domcontentloaded')`
  - `await page.waitForResponse(resp => resp.url().includes('/api') && resp.status() === 200)`
  - Direct web-first assertion: `await expect(locator).toBeVisible()`

---

## 5. Page Object Model (POM) Encapsulation

- **Zero Assertions in Page Objects:**
  - Page objects encapsulate element locators (as `readonly Locator` properties initialized in constructor) and high-level interaction methods.
  - **NEVER** import or call `expect(...)` inside any class under `src/pages/`.
  - Assertions belong exclusively in `tests/**/*.spec.ts`.
- **Method Returns:**
  - Navigation actions should return the target Page Object instance when applicable.
  - Query methods should return `Locator` instances or primitive data values (strings, counts).

---

## 6. Fixtures & Imports

- **Mandatory Import Rule:**
  - In all test specifications (`tests/**/*.spec.ts`), **ALWAYS** import `test` and `expect` from the project fixture:
    ```typescript
    import { test, expect } from '../../src/fixtures/base'; // or '@/fixtures/base'
    ```
  - **DO NOT** import directly from `@playwright/test` in test specs, as `base.ts` injects authenticated pages, custom fixtures, and context lifecycle hooks.

---

## 7. Storage State & Authentication

- Tests rely on `playwright/.auth/sims-user.json` generated during `auth.setup.ts`.
- Tests must not perform redundant re-logins unless explicitly testing the authentication mechanism itself.
- Do not spawn redundant tabs or contexts that invalidate concurrent university sessions.

