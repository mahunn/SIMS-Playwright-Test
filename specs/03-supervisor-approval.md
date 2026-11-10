# Test Spec: 1st Supervisor Approval Workflow (Parvin)

## 1. Overview & Objective
Verify that the 1st Supervisor (`parvin`) can:
1. Log into the NSU SIMS portal with supervisor credentials (`parvin` / `123`).
2. Navigate from Registrar Dashboard to Pending Requests (`EditGraduateBasic_Pending`).
3. Locate the pending minor change request submitted by `gradeditor` for student `1811576`.
4. Enter supervisor comment `"ok"` in the action row comment box.
5. Click `Accept` and confirm the SweetAlert approval modal (`"Yes, approve it!"`).
6. Navigate to Approved Requests (`EditGraduateBasic_Approved`).
7. Verify that the request has transitioned to:
   - **1st Sup:** `Approved`
   - **2nd Sup:** `Pending`
   - **Action:** `Approved (parvin)` with comment `"ok"`.

## 2. Preconditions & Test Data
- **Target Portal:** NSU SIMS (`http://10.102.11.254/simsnew/`)
- **Credentials:**
  - Username: `parvin`
  - Password: `123`
- **Target Student ID:** `1811576`
- **Approval Comment:** `"ok"`
- **Execution Mode:** Single worker (`workers: 1`)

## 3. Test Cases

### TC-SUP-001: 1st Supervisor Approves Minor Change Request & Verifies Status
- **Type:** End-to-End Approval Workflow
- **Tags:** `@smoke`, `@supervisor`, `@approval-workflow`
- **Steps:**
  1. Open fresh session context and navigate to `/simsnew/common/login`.
  2. Login with `parvin` / `123`.
  3. Verify arrival at Registrar Dashboard (`common/registrarDashboard`).
  4. Click `Pending Requests` on `Edit Graduate Basic` row.
  5. Locate row for student `1811576` and enter comment `"ok"`.
  6. Click `Accept` button in action column.
  7. On confirmation modal (`"Are you sure?"`), click `"Yes, approve it!"`.
  8. Navigate to `Approved Requests` (`common/getUserDashboard/EditGraduateBasic_Approved`).
  9. Locate student `1811576` row in approved table.
  10. Assert `1st Sup: Approved` is displayed.
  11. Assert `2nd Sup: Pending` is displayed.
  12. Assert Action displays `Approved (parvin)` and comment `"ok"`.
- **Expected Outcome:**
  - 1st supervisor approval is saved, 2nd supervisor approval remains pending.

