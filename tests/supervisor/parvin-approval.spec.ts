import { test, expect } from '../../src/fixtures/base';
import { SimsLoginPage } from '../../src/pages/SimsLoginPage';
import { SimsLandingPage } from '../../src/pages/SimsLandingPage';
import { SimsPendingRequestsPage } from '../../src/pages/SimsPendingRequestsPage';
import { SimsApprovedRequestsPage } from '../../src/pages/SimsApprovedRequestsPage';
import testUsers from '../data/sims-test-users.json';

test.describe('NSU SIMS — 1st Supervisor Approval Workflow (Parvin)', () => {

  test('TC-SUP-001: Parvin Approves Graduate Minor Request & Verifies Status @smoke @supervisor', async ({
    browser,
  }) => {
    const studentId = testUsers.testStudent.studentId;
    const supervisor = testUsers.firstSupervisor;

    // 1. Create clean isolated context for supervisor session
    const supervisorContext = await browser.newContext({ storageState: undefined });
    const page = await supervisorContext.newPage();

    const loginPage = new SimsLoginPage(page);
    const landingPage = new SimsLandingPage(page);
    const pendingPage = new SimsPendingRequestsPage(page);
    const approvedPage = new SimsApprovedRequestsPage(page);

    // 2. Navigate to SIMS entry & login as parvin
    await loginPage.goto();
    await loginPage.login(supervisor.username, supervisor.password);

    // 3. Verify successful supervisor dashboard entry
    await expect(page).toHaveURL(/.*registrarDashboard.*/i);
    await expect(page.getByText('Welcome PARVIN')).toBeVisible();
    await expect(landingPage.logoutButton).toBeVisible();

    // 4. Open Pending Requests for Edit Graduate Basic
    await landingPage.clickPendingRequests();
    await expect(page).toHaveURL(/.*EditGraduateBasic_Pending.*/i);
    await expect(pendingPage.pendingTable).toBeVisible();

    // 5. If request is still in pending queue, perform approval action
    const isPending = await pendingPage.isRequestPending(studentId);
    if (isPending) {
      const pendingRow = pendingPage.getPendingRow(studentId);
      await expect(pendingRow).toBeVisible();

      // Enter comment "ok", click Accept, and confirm SweetAlert modal ("Yes, approve it!")
      await pendingPage.approveRequest(studentId, 'ok');
    }

    // 6. Navigate to Approved Requests dashboard
    await approvedPage.goto();
    await expect(page).toHaveURL(/.*EditGraduateBasic_Approved.*/i);
    await expect(approvedPage.approvedTable).toBeVisible();

    // 7. Locate approved row for student 1811576
    const approvedRow = approvedPage.getApprovedRow(studentId);
    await expect(approvedRow).toBeVisible();

    // 8. Web-First Assertions: Verify 1st Sup is Approved
    await expect(approvedRow).toContainText('1st Sup: Approved');
    await expect(approvedRow).toContainText(/2nd Sup:\s*(Pending|Approved|Disapproved)/i);

    // 9. Verify Action column displays supervisor action status
    await expect(approvedRow).toContainText(/(Approved|Disapproved)\s*\((parvin|controller)\)/i);
    await expect(approvedRow).toContainText(/(ok|no)/i);

    await supervisorContext.close();
  });
});
