---
name: playwright-generator
description: Reads test specifications from specs/, generates type-safe Page Objects in src/pages/, creates Playwright test suites in tests/, and validates execution.
---

# Playwright Test Generator for NSU SIMS

## Purpose
The `playwright-generator` skill turns Markdown test plans from `specs/<feature>.md` into robust, production-grade TypeScript Page Objects and Playwright test specifications adhering to the project's strict architectural standards.

---

## Operational Workflow

### 1. Specification Ingestion
- Read the target feature specification from `specs/<feature>.md`.
- Extract page components, interactions, and expected assertions.

### 2. Page Object Modeling (`src/pages/`)
- Ensure every Page Object inherits from `BasePage`.
- Define all locators in the constructor using the **Strict Locator Hierarchy**:
  1. `page.getByRole(...)`
  2. `page.getByLabel(...)`
  3. `page.getByPlaceholder(...)`
  4. `page.getByTestId(...)`
  5. `page.getByText(...)`
  6. CSS / XPath (last resort for legacy tables)
- Implement action methods that return `Promise<void>` or the next Page Object.
- **Rule:** NEVER place `expect(...)` assertions inside Page Object files.

### 3. Test Specification Authoring (`tests/`)
- Create `<feature>.spec.ts` under `tests/<module>/`.
- **Rule:** ALWAYS import `test` and `expect` from `src/fixtures/base`:
  ```typescript
  import { test, expect } from '../../src/fixtures/base';
  ```
- Use Web-First assertions: `await expect(locator).toBeVisible()`.
- **Rule:** NEVER use `page.waitForTimeout()`.

### 4. Validation & Verification Pass
- Run TypeScript compiler: `npm run typecheck` (`npx tsc --noEmit`).
- Run the targeted test: `npx playwright test tests/<module>/<feature>.spec.ts`.
- Ensure the test passes without flaky retries.

