---
name: playwright-healer
description: Diagnoses failing Playwright tests using traces, logs, and screenshots, repairs locator drift and timing issues without weakening assertions, and verifies test passes.
---

# Playwright Test Healer for NSU SIMS

## Purpose
The `playwright-healer` skill diagnoses, debugs, and fixes failing tests in the NSU SIMS test suite. It analyzes failure artifacts (Playwright traces, HTML reports, and screenshots) to pinpoint the exact failure mechanism and applies targeted repairs.

---

## Operational Workflow

### 1. Failure Analysis
- Review terminal output and locate test failure points.
- Inspect the generated trace:
  ```bash
  npx playwright show-trace test-results/<test-run-folder>/trace.zip
  ```
- Identify whether the failure is caused by:
  - **Locator drift:** DOM structure or attribute changed on the SIMS server.
  - **Timing/Race condition:** Portal network request or ASP.NET postback pending.
  - **Session invalidation:** SIMS session timed out or server rejected concurrent login.
  - **Functional regression:** Actual application defect.

### 2. Surgical Repair Rules
- **Preserve Assertion Intent:** Never remove or weaken an assertion just to make a test pass.
- **Maintain Locator Hierarchy:** If an element selector broke, upgrade it to `getByRole`, `getByLabel`, or `getByPlaceholder` if available.
- **Zero Sleep Policy:** Never fix timing issues by inserting `page.waitForTimeout()`. Instead, use deterministic synchronization:
  - `await page.waitForLoadState('domcontentloaded')`
  - `await locator.waitFor({ state: 'visible' })`
  - `await page.waitForResponse(...)`
- **Isolate in Page Object:** If a selector changed, update it inside `src/pages/`, keeping tests clean.

### 3. Verification Pass
- Re-run the affected test:
  ```bash
  npx playwright test tests/<path-to-test>.spec.ts
  ```
- Run the full smoke suite to confirm no collateral regressions:
  ```bash
  npm run test:smoke
  ```
- Execute `npm run typecheck` to ensure no TypeScript type breaks.

