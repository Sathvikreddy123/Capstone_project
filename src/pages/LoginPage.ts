import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly signupLoginLink: Locator;
    readonly loginToAccountHeader: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;

    // Success/Status
    readonly loggedInAsUserText: (username: string) => Locator;

    // Errors
    readonly loginError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.loginToAccountHeader = page.getByText('Login to your account');
        this.emailInput = page.locator('input[data-qa="login-email"]');
        this.passwordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });

        // "Logged in as username"
        this.loggedInAsUserText = (username: string) => page.getByText(`Logged in as ${username}`);

        // Error message: "Email or Password is incorrect"
        this.loginError = page.locator('form[action="/login"]').getByText('Email or Password is incorrect');
    }

    async navigateToLogin() {
        await this.signupLoginLink.click();
        await expect(this.loginToAccountHeader).toBeVisible();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutLink.click();
        await expect(this.loginToAccountHeader).toBeVisible(); // Redirects to login page
    }

    async deleteAccount() {
        await this.deleteAccountLink.click();
        await expect(this.page.getByText('Account Deleted!')).toBeVisible();
        await this.page.locator('a[data-qa="continue-button"]').click();
    }
}
