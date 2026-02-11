import { type Page, type Locator, expect } from '@playwright/test';

export class TestCasesPage {
    readonly page: Page;
    readonly testCasesLink: Locator;
    readonly testCasesHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.testCasesLink = page.locator('header').getByRole('link', { name: 'Test Cases' });
        // Specific CSS locator to avoid strict mode violations with similar headings
        this.testCasesHeader = page.locator('h2.title.text-center', { hasText: 'TEST CASES' });
    }

    async navigateToTestCases() {
        await this.testCasesLink.click();
        await expect(this.testCasesHeader).toBeVisible();
        await expect(this.page).toHaveURL(/.*test_cases/);
    }
}
