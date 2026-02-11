import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { TestCasesPage } from '../../pages/TestCasesPage';
import path from 'path';
import fs from 'fs';

test.describe('Phase 3: Support Pages', () => {
    let contactUsPage: ContactUsPage;
    let testCasesPage: TestCasesPage;

    test.beforeEach(async ({ page }) => {
        contactUsPage = new ContactUsPage(page);
        testCasesPage = new TestCasesPage(page);
        await page.goto('/');
    });

    test('should submit contact form with file upload successfully', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-6' });
        // Create dummy file
        const testFileName = 'test_upload.txt';
        const testFilePath = path.join(__dirname, testFileName);
        fs.writeFileSync(testFilePath, 'This is a test file for upload automation.');

        try {
            await contactUsPage.navigateToContactUs();

            await contactUsPage.submitContactForm(
                'Test User',
                'test_contact@test.com',
                'Test Subject',
                'This is a test message regarding the automation project.',
                testFilePath
            );

            await contactUsPage.verifySuccessAndNavigateHome();
        } finally {
            // Cleanup
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
            }
        }
    });

    test('should navigate to test cases page and display header', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-7' });
        await testCasesPage.navigateToTestCases();
        const header = page.getByRole('heading', { name: 'Test Cases' }).first();
        await expect(header).toBeVisible();
    });
});
