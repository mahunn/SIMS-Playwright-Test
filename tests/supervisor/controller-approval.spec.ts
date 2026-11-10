import { test, expect } from '../../src/fixtures/base';
import { SimsLoginPage } from '../../src/pages/SimsLoginPage';
import { SimsLandingPage } from '../../src/pages/SimsLandingPage';
import { SimsPendingRequestsPage } from '../../src/pages/SimsPendingRequestsPage';
import { SimsApprovedRequestsPage } from '../../src/pages/SimsApprovedRequestsPage';
import testUsers from '../data/sims-test-users.json';

test.describe('NSU SIMS — 2nd Supervisor (Controller) Approval & Grad Editor Verification', () => {

  test('TC-CTRL-001: Controller Approves Request and Grad Editor Verifies Full Approval @smoke @controller', async ({
    browser,
  }) => {
    const studentId = testUsers.testStudent.studentId;
    const controllerUser = testUsers.secondSupervisor;
    const gradeditorUser = testUsers.gradeditor;

    // =========================================================
    // PHASE 1: 2nd SUPERVISOR (CONTROLLER) APPROVAL
    // =========================================================
    const controllerContext = await browser.newContext({ storageState: undefined });
    const controllerPage = await controllerContext.newPage();

    const controllerLogin = new SimsLoginPage(controllerPage);
    const controllerLanding = new SimsLandingPage(controllerPage);
    const controllerPending = new SimsPendingRequestsPage(controllerPage);
    const controllerApproved = new SimsApprovedRequestsPage(controllerPage);

    // 1. Navigate to SIMS & Login as CONTROLLER
    await controllerLogin.goto();
    await controllerLogin.login(controllerUser.username, controllerUser.password);

    // 2. Verify arrival at Registrar Dashboard
    await expect(controllerPage).toHaveURL(/.*registrarDashboard.*/i);
    await expect(controllerPage.getByText('Welcome CONTROLLER')).toBeVisible();
    await expect(controllerLanding.logoutButton).toBeVisible();

    // 3. Open Pending Requests for Edit Graduate Basic
    await controllerLanding.clickPendingRequests();
    await expect(controllerPage).toHaveURL(/.*EditGraduateBasic_Pending.*/i);
    await expect(controllerPending.pendingTable).toBeVisible();

    // 4. If request is still in pending queue, perform approval action
    const isPending = await controllerPending.isRequestPending(studentId);
    if (isPending) {
      const pendingRow = controllerPending.getPendingRow(studentId);
      await expect(pendingRow).toBeVisible();

      // Comment "ok", click Accept, and confirm SweetAlert modal ("Yes, approve it!")
      await controllerPending.approveRequest(studentId, 'ok');
    }

    // 5. Navigate to Approved Requests dashboard as CONTROLLER
    await controllerApproved.goto();
    await expect(controllerPage).toHaveURL(/.*EditGraduateBasic_Approved.*/i);
    await expect(controllerApproved.approvedTable).toBeVisible();

    // 6. Locate approved student row
    const approvedRowController = controllerApproved.getApprovedRow(studentId);
    await expect(approvedRowController).toBeVisible();

    // 7. Verify both 1st Sup is Approved AND 2nd Sup is Approved
    await expect(approvedRowController).toContainText('1st Sup: Approved');
    await expect(approvedRowController).toContainText('2nd Sup: Approved');

    // 8. Verify Action column displays "Approved (controller)" and comment "ok"
    await expect(approvedRowController).toContainText('Approved (controller)');
    await expect(approvedRowController).toContainText('ok');

    // Terminate controller session
    await controllerContext.close();

    // =========================================================
    // PHASE 2: GRAD EDITOR FINAL STATUS VERIFICATION
    // =========================================================
    const gradeditorContext = await browser.newContext({ storageState: undefined });
    const gradeditorPage = await gradeditorContext.newPage();

    const gradeditorLogin = new SimsLoginPage(gradeditorPage);
    const gradeditorLanding = new SimsLandingPage(gradeditorPage);
    const gradeditorApproved = new SimsApprovedRequestsPage(gradeditorPage);

    // 9. Login as GRADEDITOR
    await gradeditorLogin.goto();
    await gradeditorLogin.login(gradeditorUser.username, gradeditorUser.password);

    // 10. Verify Registrar Dashboard arrival with GRADEDITOR welcome
    await expect(gradeditorPage).toHaveURL(/.*registrarDashboard.*/i);
    await expect(gradeditorPage.getByText('Welcome GRADEDITOR')).toBeVisible();
    await expect(gradeditorLanding.logoutButton).toBeVisible();

    // 11. Navigate to Approved Requests list
    await gradeditorApproved.goto();
    await expect(gradeditorPage).toHaveURL(/.*EditGraduateBasic_Approved.*/i);
    await expect(gradeditorApproved.approvedTable).toBeVisible();

    // 12. Locate student row in gradeditor approved table
    const approvedRowGradeditor = gradeditorApproved.getApprovedRow(studentId);
    await expect(approvedRowGradeditor).toBeVisible();

    // 13. Verify final state: both supervisors approved (Full Lifecycle Complete)
    await expect(approvedRowGradeditor).toContainText('1st Sup: Approved');
    await expect(approvedRowGradeditor).toContainText('2nd Sup: Approved');

    // Close gradeditor context and conclude test
    await gradeditorContext.close();
  });
});

