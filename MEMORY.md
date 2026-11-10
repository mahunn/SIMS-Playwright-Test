# MEMORY.md — Persistent Project Memory Bank

This document serves as the persistent single source of truth for the **NSU SIMS Playwright Automation** suite.

---

## Section 1: System & Environment URL

| Environment | Target URL | Notes |
| :--- | :--- | :--- |
| **Active Local Intranet** | `http://10.102.11.254/simsnew/` | Dedicated NSU Intranet SIMS Portal instance |
| **Public Portal (Fallback)** | `http://sims.northsouth.edu/` | NSU Public SIMS Portal entry point |
| **Protocol** | HTTP / Stateful PHP & Apache/Laragon Sessions | Single-worker constraint (`workers: 1`) to preserve session integrity |

---

## Section 2: Test User & Credentials

| Credential Key | Source | Role / User Description |
| :--- | :--- | :--- |
| `gradeditor` / `M1fj2gm6` | `.env` / Process Env | Graduate Edit Entry in Registrar Office |
| `parvin` / `123` | `tests/data/sims-test-users.json` | 1st Supervisor (Nayma Parvin) |
| `controller` / `123` | `tests/data/sims-test-users.json` | 2nd Supervisor (Controller of Examinations) |
| Test Target Student | `1811576` | Md. Minhajul Abedin (Program 43 - EEE) |

---

## Section 3: Storage State Paths

- **Authentication Storage State Path:**
  `playwright/.auth/sims-user.json`
- **Setup Specification:**
  `tests/auth.setup.ts`
- **Reusability Model:**
  Playwright project dependency runs `auth.setup.ts` first. All subsequent test suites (`tests/**/*.spec.ts`) inherit the storage state, avoiding redundant logins.

---

## Section 4: Test Directory Architecture

```
SIMS-Playwright-Test/
├── .agents/
│   └── skills/
│       ├── playwright-planner/
│       │   └── SKILL.md
│       ├── playwright-generator/
│       │   └── SKILL.md
│       └── playwright-healer/
│           └── SKILL.md
├── playwright/
│   └── .auth/
│       └── sims-user.json           # Cached authentication cookies and tokens
├── specs/
│   ├── 01-auth-and-dashboard.md     # Baseline test plan specification
│   ├── 02-gradeditor-workflow.md    # Grad Editor minor change & approval queue spec
│   ├── 03-supervisor-approval.md    # 1st Supervisor approval workflow spec
│   └── 04-controller-approval.md    # 2nd Supervisor approval & final verification spec
├── src/
│   ├── fixtures/
│   │   └── base.ts                  # Extended Playwright test & authenticated fixtures
│   └── pages/
│       ├── BasePage.ts              # Abstract base Page Object with waitForReady()
│       ├── SimsLoginPage.ts         # Login interaction and form handling
│       ├── SimsLandingPage.ts       # Registrar Dashboard navigation and action links
│       ├── SimsGraduatesPage.ts     # Graduates search & action link selection
│       ├── SimsEditGraduatePage.ts  # Edit Graduate Basic Information (Minor selection)
│       ├── SimsPendingRequestsPage.ts # Pending requests table, comment box & Accept modal
│       └── SimsApprovedRequestsPage.ts # Approved requests verification
├── tests/
│   ├── auth.setup.ts                # One-time login setup project
│   ├── auth/
│   │   └── sims-login.spec.ts       # Baseline smoke & login tests
│   ├── gradeditor/
│   │   └── gradeditor-minor-update.spec.ts # Minor update and pending queue verification
│   ├── supervisor/
│   │   ├── parvin-approval.spec.ts  # 1st Supervisor (Parvin) approval & status check
│   │   └── controller-approval.spec.ts # 2nd Supervisor (Controller) approval & Grad Editor check
│   └── data/
│       └── sims-test-users.json     # Test user & student definitions
├── .env.example
├── .env                             # Local credentials (git-ignored)
├── .gitignore
├── AGENTS.md
├── GEMINI.md
├── MEMORY.md
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Section 5: Page Objects Index

| Page Object Class | File Path | Responsibilities |
| :--- | :--- | :--- |
| `BasePage` | `src/pages/BasePage.ts` | Base class, page navigation, `waitForReady` lifecycle |
| `SimsLoginPage` | `src/pages/SimsLoginPage.ts` | Form input, `#userName`, `userPassword`, submit button |
| `SimsLandingPage` | `src/pages/SimsLandingPage.ts` | Registrar Dashboard, navigation menu (Students → Graduates), Pending Requests link |
| `SimsGraduatesPage` | `src/pages/SimsGraduatesPage.ts` | Student ID search (`#studentNumber`), `#outerSearchButton`, Edit link |
| `SimsEditGraduatePage` | `src/pages/SimsEditGraduatePage.ts` | Minor dropdown (`#minor`), Major selectors, Submit button, alert message |
| `SimsPendingRequestsPage` | `src/pages/SimsPendingRequestsPage.ts` | Pending requests table, status filters, comment box, `Accept`, SweetAlert confirm |
| `SimsApprovedRequestsPage` | `src/pages/SimsApprovedRequestsPage.ts` | Approved requests table, row verification (`1st Sup: Approved`, `2nd Sup: Approved`) |

---

## Section 6: Strict Rules & Conventions

1. **Worker Constraint:** `workers: 1` — Mandatory due to stateful university servers.
2. **Locator Priority (Element ID First):**
   1. **`#id` (Element ID)** — Primary preference across full SIMS website for long-term stability against UI redesigns.
   2. `getByRole(role, { name })`
   3. `getByLabel(label)`
   4. `getByPlaceholder(placeholder)`
   5. `getByTestId(id)`
   6. `getByText(text)` (static text only)
   7. Scoped CSS / attributes (`[name="..."]`, `[href*="..."]`)
3. **Web-First Assertions:** Use `await expect(locator).toBeVisible()` only.
4. **Zero Sleep Policy:** Prohibit `page.waitForTimeout()`.
5. **POM Purity:** Never place `expect()` assertions inside Page Object files.
6. **Fixture Imports:** In tests, always import `test` and `expect` from `src/fixtures/base`.

---

## Section 7: Common Test Commands

- **Run Grad Editor workflow:**
  ```bash
  npm run test:gradeditor
  npm run test:gradeditor:headed
  ```
- **Run 1st Supervisor (Parvin) approval test:**
  ```bash
  npm run test:supervisor
  npm run test:supervisor:headed
  ```
- **Run 2nd Supervisor (Controller) approval & Grad Editor verification:**
  ```bash
  npm run test:controller
  npm run test:controller:headed
  ```
- **Run all tests:**
  ```bash
  npm test
  ```
- **Type check:**
  ```bash
  npm run typecheck
  ```
- **View HTML test report:**
  ```bash
  npm run report
  ```
