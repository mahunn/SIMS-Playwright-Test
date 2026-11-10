# Test Spec: Authentication & Dashboard Baseline

## 1. Overview & Objective
Verify that authorized users can successfully access the NSU SIMS portal, retain stateful session integrity, access core dashboard modules, and securely terminate their session via logout.

## 2. Preconditions & Test Data
- **Target Portal:** NSU SIMS (`http://sims.northsouth.edu/`)
- **Credentials:** Valid student/faculty account in `.env`
- **Session State:** Stored in `playwright/.auth/sims-user.json`
- **Execution:** Single worker (`workers: 1`)

## 3. Test Cases

### TC-SIMS-001: Verified Authenticated Session & Dashboard Readiness
- **Type:** Smoke / Positive
- **Tags:** `@smoke`, `@auth`
- **Steps:**
  1. Open browser with pre-authenticated storage state.
  2. Navigate to SIMS root `/`.
  3. Verify URL does not redirect to login.
  4. Verify dashboard header, main content, and logout link.
- **Expected Outcome:**
  - User lands directly on authenticated dashboard.
  - Logout control is visible and actionable.

### TC-SIMS-002: Navigation Bar & Core Portal Modules Available
- **Type:** Smoke / Functional
- **Tags:** `@smoke`, `@navigation`
- **Steps:**
  1. Navigate to SIMS dashboard.
  2. Locate navigation sidebar / main menu.
  3. Verify presence of student links (Profile, Advising, Degree Audit).
- **Expected Outcome:**
  - Navigation menu and module links are rendered.

### TC-SIMS-003: Login Form Validation on Fresh Session
- **Type:** Smoke / Negative
- **Tags:** `@smoke`, `@negative`
- **Steps:**
  1. Open fresh unauthenticated context.
  2. Navigate to SIMS login.
  3. Submit invalid credentials from `tests/data/sims-test-users.json`.
- **Expected Outcome:**
  - Authentication is rejected; user remains on login page or error message appears.

