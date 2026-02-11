import { type Page, type Locator, expect } from '@playwright/test';
import { AdHandler } from '../utils/AdHandler';

export class ContactUsPage {
    readonly page: Page;
    readonly contactUsLink: Locator;
    readonly getInTouchHeader: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageInput: Locator;
    readonly uploadFileInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
        this.getInTouchHeader = page.getByText('GET IN TOUCH');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageInput = page.locator('textarea[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('input[data-qa="submit-button"]');
        this.successMessage = page.locator('.status.alert.alert-success');
        this.homeButton = page.locator('a.btn.btn-success');
    }

    async navigateToContactUs() {
        await this.contactUsLink.click();
        await expect(this.getInTouchHeader).toBeVisible();
    }

    async submitContactForm(name: string, email: string, subject: string, message: string, filePath: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);

        // Upload file
        await this.uploadFileInput.setInputFiles(filePath);

        // Handle potential ads before clicking submit
        await AdHandler.closeAdOverlays(this.page);

        // Handle confirmation dialog proactively
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });

        // Click submit with force: true to bypass potential ad overlays that AdHandler missed
        await this.submitButton.click({ force: true });

        // Wait for the page to process the submission
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifySuccessAndNavigateHome() {
        // Wait for page to process the form submission
        await this.page.waitForLoadState('domcontentloaded');

        // Wait for success message text to appear (more reliable than visibility check)
        await this.page.waitForFunction(() => {
            const element = document.querySelector('.status.alert.alert-success');
            return element && element.textContent && element.textContent.includes('Success');
        }, { timeout: 15000 });

        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toHaveText('Success! Your details have been submitted successfully.');
        await this.homeButton.click();
        await expect(this.page.url()).toBe('https://automationexercise.com/'); // Verify home
    }
}
