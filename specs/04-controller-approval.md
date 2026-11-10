# Test Spec: 2nd Supervisor Approval (Controller) & Grad Editor Final Verification

## 1. Overview & Objective
Verify that the 2nd Supervisor (`controller`) and subsequent Grad Editor (`gradeditor`) can:
1. Log in as 2nd Supervisor (`controller` / `123`).
2. Navigate from Registrar Dashboard to Pending Requests (`EditGraduateBasic_Pending`).
3. Locate the pending request for student `1811576` (previously approved by 1st supervisor `parvin`).
4. Enter supervisor comment `"ok"`, click `Accept`, and confirm the modal (`"Yes, approve it!"`).
5. Navigate to Approved Requests (`EditGraduateBasic_Approved`).
6. Verify that the request has completed both approval tiers:
   - **1st Sup:** `Approved`
   - **2nd Sup:** `Approved`
   - **Action:** `Approved (controller)` with comment `"ok"`.
7. Terminate controller session and log in as `gradeditor` (`gradeditor` / `M1fj2gm6`).
8. Access Approved Requests (`EditGraduateBasic_Approved`) as `gradeditor`.
9. Confirm that the student's request is visible with both supervisors marked `Approved`.

## 2. Preconditions & Test Data
- **Target Portal:** NSU SIMS (`http://10.102.11.254/simsnew/`)
- **2nd Supervisor Credentials:** `controller` / `123`
- **Grad Editor Credentials:** `gradeditor` / `M1fj2gm6`
- **Target Student ID:** `1811576`
- **Execution Mode:** Single worker (`workers: 1`)

## 3. Test Cases

### TC-CTRL-001: 2nd Supervisor (Controller) Approves & Grad Editor Verifies Full Approval
- **Type:** Multi-Role Approval Lifecycle
- **Tags:** `@smoke`, `@controller`, `@lifecycle`
- **Steps:**
  1. Open isolated browser context for `controller`.
  2. Login with `controller` / `123`.
  3. Verify arrival at Registrar Dashboard (`common/registrarDashboard`).
  4. Access Pending Requests (`common/getUserDashboard/EditGraduateBasic_Pending`).
  5. If request is pending, enter comment `"ok"`, click `Accept`, and confirm `"Yes, approve it!"`.
  6. Access Approved Requests (`common/getUserDashboard/EditGraduateBasic_Approved`).
  7. Verify row for `1811576`:
     - `1st Sup: Approved`
     - `2nd Sup: Approved`
     - `Approved (controller)`
     - comment `"ok"`.
  8. Close controller context.
  9. Open isolated browser context for `gradeditor`.
  10. Login with `gradeditor` / `M1fj2gm6`.
  11. Navigate to Approved Requests (`common/getUserDashboard/EditGraduateBasic_Approved`).
  12. Verify header displays `Welcome GRADEDITOR`.
  13. Verify row for `1811576` displays:
      - `1st Sup: Approved`
      - `2nd Sup: Approved`.
  14. Close context.

