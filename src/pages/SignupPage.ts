import { type Page, type Locator, expect } from '@playwright/test';

export class SignupPage {
    readonly page: Page;
    readonly signupLoginLink: Locator;
    readonly newUserSignupHeader: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;

    // Account Information Page
    readonly enterAccountInfoHeader: Locator;
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly nameDisabledInput: Locator;
    readonly emailDisabledInput: Locator; // check if disabled
    readonly passwordInput: Locator;
    readonly daySelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly specialOffersCheckbox: Locator;

    // Address Information
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountButton: Locator;

    // Success
    readonly accountCreatedHeader: Locator;
    readonly continueButton: Locator;

    // Errors
    readonly emailAddressAlreadyExistError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.newUserSignupHeader = page.getByText('New User Signup!');
        this.nameInput = page.locator('input[data-qa="signup-name"]');
        this.emailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        this.enterAccountInfoHeader = page.getByText('Enter Account Information');
        this.titleMr = page.locator('input[id="id_gender1"]');
        this.titleMrs = page.locator('input[id="id_gender2"]');
        // Name and Email on step 2 might be different or read-only
        this.nameDisabledInput = page.locator('input[data-qa="name"]'); // verify locator later
        this.emailDisabledInput = page.locator('input[data-qa="email"]'); // verify locator later
        this.passwordInput = page.locator('input[data-qa="password"]');
        this.daySelect = page.locator('select[data-qa="days"]');
        this.monthSelect = page.locator('select[data-qa="months"]');
        this.yearSelect = page.locator('select[data-qa="years"]');
        this.newsletterCheckbox = page.locator('input[name="newsletter"]');
        this.specialOffersCheckbox = page.locator('input[name="optin"]');

        this.firstNameInput = page.locator('input[data-qa="first_name"]');
        this.lastNameInput = page.locator('input[data-qa="last_name"]');
        this.companyInput = page.locator('input[data-qa="company"]');
        this.address1Input = page.locator('input[data-qa="address"]');
        this.address2Input = page.locator('input[data-qa="address2"]');
        this.countrySelect = page.locator('select[data-qa="country"]');
        this.stateInput = page.locator('input[data-qa="state"]');
        this.cityInput = page.locator('input[data-qa="city"]');
        this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
        this.mobileInput = page.locator('input[data-qa="mobile_number"]');

        this.createAccountButton = page.locator('button[data-qa="create-account"]');
        this.accountCreatedHeader = page.getByText('Account Created!');
        this.continueButton = page.locator('a[data-qa="continue-button"]');

        this.emailAddressAlreadyExistError = page.getByText('Email Address already exist!');
    }

    async goto() {
        await this.page.goto('/');
    }

    async navigateToSignupLogin() {
        await this.signupLoginLink.click();
        await expect(this.newUserSignupHeader).toBeVisible();
    }

    async signup(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signupButton.click();
    }

    async fillAccountDescription(password: string, dob: { day: string, month: string, year: string }) {
        await expect(this.enterAccountInfoHeader).toBeVisible();
        await this.titleMr.check(); // Default to Mr for now
        await this.passwordInput.fill(password);
        await this.daySelect.selectOption(dob.day);
        await this.monthSelect.selectOption(dob.month);
        await this.yearSelect.selectOption(dob.year);
        await this.newsletterCheckbox.check();
        await this.specialOffersCheckbox.check();
    }

    async fillAddressDetails(details: {
        firstName: string, lastName: string, company: string, address1: string, address2: string,
        country: string, state: string, city: string, zipcode: string, mobile: string
    }) {
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.companyInput.fill(details.company);
        await this.address1Input.fill(details.address1);
        await this.address2Input.fill(details.address2);
        await this.countrySelect.selectOption(details.country);
        await this.stateInput.fill(details.state);
        await this.cityInput.fill(details.city);
        await this.zipcodeInput.fill(details.zipcode);
        await this.mobileInput.fill(details.mobile);
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }
}
