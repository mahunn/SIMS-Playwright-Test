# GEMINI.md — Antigravity Project Instructions for NSU SIMS

This workspace hosts the End-to-End Test Automation Suite for the **North South University (NSU) Student Information Management System (SIMS) Portal**.

---

## Technical Stack & Standards
- **Framework:** `@playwright/test`
- **Language:** TypeScript (Strict Mode)
- **Architecture:** Page Object Model (POM) + Playwright Project Dependencies (Setup / Test)
- **Single Worker Policy:** `workers: 1` — Mandatory due to NSU session state constraints.

---

## Non-Negotiable Operational Rules

1. **Locator Priority:**
   - 1st: **`#id` (Element ID)** — Primary preference for full SIMS website stability against UI changes.
   - 2nd: `getByRole` with accessible name
   - 3rd: `getByLabel`
   - 4th: `getByPlaceholder`
   - 5th: `getByTestId`
   - 6th: `getByText` (static copy only)
   - 7th: Scoped attribute selectors (`[name="..."]`, `[href*="..."]`)
2. **Web-First Assertions Only:**
   - Always `await expect(locator).toBeVisible()`, `toBeEnabled()`, `toHaveText()`, etc.
   - Do not query element states with `isVisible()` before calling assertions.
3. **Zero Sleep Policy:**
   - `page.waitForTimeout()` is prohibited. Rely on locator actionability, `waitForLoadState`, or specific element visibility.
4. **POM Assertion Boundary:**
   - Page Objects (`src/pages/*.ts`) must NOT contain assertions. Only locators and action methods.
5. **Fixtures Usage:**
   - Import `test` and `expect` from `src/fixtures/base` in all test files.

---

## Agent Roles in Workspace
- **playwright-planner:** Explores portal features and generates specifications in `specs/`.
- **playwright-generator:** Implements Page Objects and executable test specs from requirements.
- **playwright-healer:** Diagnoses trace/test failures and repairs selectors or timing drifts.

