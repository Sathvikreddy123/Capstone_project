import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor() {
        super('/login');
    }

    // Locators
    private get loginEmailInput() { return cy.get('[data-qa="login-email"]'); }
    private get loginPasswordInput() { return cy.get('[data-qa="login-password"]'); }
    private get loginButton() { return cy.get('[data-qa="login-button"]'); }
    private get errorMessage() { return cy.get('.login-form p'); }
    private get loggedInAs() { return cy.contains('Logged in as'); }
    private get logoutButton() { return cy.get('a[href="/logout"]'); }

    // Actions
    login(email: string, password: string) {
        this.loginEmailInput.type(email);
        this.loginPasswordInput.type(password);
        this.loginButton.click();
    }

    logout() {
        this.logoutButton.click();
    }

    // Assertions (returning chainables for assertion in test)
    getErrorMessage() {
        return this.errorMessage;
    }

    getLoggedInAsText() {
        return this.loggedInAs;
    }
}
