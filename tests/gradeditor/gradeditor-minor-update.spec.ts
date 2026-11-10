import { test, expect } from '../../src/fixtures/base';
import testUsers from '../data/sims-test-users.json';

test.describe('NSU SIMS — Grad Editor Workflow', () => {

  test('TC-GRAD-001: Submit Minor Change Request and Verify in Pending Requests @smoke @gradeditor', async ({
    page,
    landingPage,
    graduatesPage,
    editGraduatePage,
    pendingRequestsPage,
  }) => {
    const studentId = testUsers.testStudent.studentId;
    const minorValue = testUsers.testStudent.minorValue;

    // 1. Verify access to Registrar Dashboard (reusing cached authenticated storageState)
    await landingPage.goto();
    await expect(landingPage.logoutButton).toBeVisible();
    await expect(landingPage.userWelcomeText).toBeVisible();

    // 2. Navigate: Students -> Graduates
    await landingPage.navigateToGraduates();
    await expect(page).toHaveURL(/.*graduates.*/i);

    // 3. Search with graduate ID: 1811576
    await graduatesPage.searchStudent(studentId);
    const studentRow = graduatesPage.getStudentRow(studentId);
    await expect(studentRow).toBeVisible();

    // 4. Click Edit action to open Edit Graduate Basic Information
    await graduatesPage.clickEditGraduate();
    await expect(page).toHaveURL(/.*editGraduateBasic.*/i);
    await expect(editGraduatePage.pageHeading).toBeVisible();

    // 5. Select Minor (different from current to guarantee change request) and Submit
    const targetMinor = await editGraduatePage.selectDifferentMinor(minorValue);
    await editGraduatePage.clickSubmit();

    // 6. Verify confirmation message:
    // "Change Request for Student Information is submitted for Approval."
    await expect(page).toHaveURL(/.*updateGraduateBasic.*/i);
    await expect(editGraduatePage.confirmationAlert).toBeVisible();
    await expect(editGraduatePage.confirmationAlert).toContainText(
      'Change Request for Student Information is submitted for Approval.'
    );

    // 7. Go to Home (Registrar Dashboard)
    await landingPage.goto();
    await expect(landingPage.pendingRequestsLink).toBeVisible();

    // 8. Click Pending Requests and verify the entry is present
    await landingPage.clickPendingRequests();
    await expect(page).toHaveURL(/.*EditGraduateBasic_Pending.*/i);
    await expect(pendingRequestsPage.pendingTable).toBeVisible();

    // Verify row for the graduate exists and contains the requested change
    const pendingRow = pendingRequestsPage.getPendingRow(studentId);
    await expect(pendingRow).toBeVisible();
    await expect(pendingRow).toContainText('Minor');
    await expect(pendingRow).toContainText(targetMinor);
    await expect(pendingRow).toContainText('Pending');
  });
});

