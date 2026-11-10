# Test Spec: Grad Editor Minor Update & Pending Request Submission

## 1. Overview & Objective
Verify that an authorized `gradeditor` user can:
1. Log into the NSU SIMS portal and reach the Registrar Dashboard.
2. Navigate via menu to Students → Graduates (`/simsnew/graduates`).
3. Search for a specific graduate record using Student ID (`1811576`).
4. Open the graduate record and update the student's Minor program (e.g., Mathematics - 21).
5. Submit the change request and verify the confirmation message:
   `"Change Request for Student Information is submitted for Approval."`
6. Return to Home / Registrar Dashboard and access Pending Requests.
7. Confirm that the change request appears in the Pending Requests table with correct student details and pending approval status.

## 2. Preconditions & Test Data
- **Target Portal:** NSU SIMS (`http://10.102.11.254/simsnew/`)
- **Credentials:**
  - Username: `gradeditor`
  - Password: `process.env.SIMS_PASSWORD` (from `.env`)
- **Target Student ID:** `1811576`
- **Minor Program:** `Mathematics - 21` (value: `"21"`)
- **Session State:** Cached via `tests/auth.setup.ts` into `playwright/.auth/sims-user.json`
- **Execution Mode:** Single worker (`workers: 1`)

## 3. Test Cases

### TC-GRAD-001: Grad Editor Minor Change Submission & Pending Verification
- **Type:** Functional End-to-End Workflow
- **Tags:** `@smoke`, `@gradeditor`, `@approval-workflow`
- **Steps:**
  1. Login as `gradeditor` and verify arrival at Registrar Dashboard (`common/registrarDashboard`).
  2. Navigate to `Students` → `Graduates` (`graduates`).
  3. Enter Student ID `1811576` into search input and click `Search`.
  4. Verify graduate search result row is displayed.
  5. Click Edit action icon (`editGraduateBasic`) to open Edit Graduate Basic Information.
  6. Select Minor (`Mathematics - 21`) and click `Submit`.
  7. Assert confirmation message: `"Change Request for Student Information is submitted for Approval."`
  8. Navigate to `Home` → Click `Pending Requests` on Dashboard.
  9. Assert that pending request table includes entry for Student ID `1811576` with status `Pending`.
- **Expected Outcome:**
  - Change request is accepted and queued under Pending Requests for supervisor approval.

