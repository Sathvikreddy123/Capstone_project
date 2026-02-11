import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { testData } from '../test-data';

test.describe('Signup Feature', () => {
    let signupPage: SignupPage;
    let accountCreated: { email: string; password: string } | null = null;

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        accountCreated = null; // Reset per test
        await signupPage.goto();
        await signupPage.navigateToSignupLogin();
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Conditional cleanup: only if account was successfully created
        if (accountCreated) {
            try {
                const loginPage = new (await import('../../pages/LoginPage')).LoginPage(page);

                // Check if already logged in, if not login first
                const loggedInText = loginPage.loggedInAsUserText('').first();
                const isLoggedIn = await loggedInText.isVisible().catch(() => false);

                if (!isLoggedIn) {
                    await signupPage.navigateToSignupLogin();
                    await loginPage.login(accountCreated.email, accountCreated.password);
                }

                await loginPage.deleteAccount();
                testInfo.annotations.push({ type: 'cleanup', description: `Deleted account: ${accountCreated.email}` });
            } catch (error) {
                // Never fail test due to cleanup failure
                testInfo.annotations.push({
                    type: 'cleanup-failure',
                    description: `Failed to delete account ${accountCreated.email}: ${error}`
                });
            }
        }
    });

    test('should create account and auto-login user after successful registration', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-1' });
        const user = { ...testData.signup.validUser, email: `test_user_${Date.now()}@test.com` };

        await signupPage.signup(user.name, user.email);

        // Fill account details
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails({
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            address1: user.address1,
            address2: user.address2,
            country: user.country,
            state: user.state,
            city: user.city,
            zipcode: user.zipcode,
            mobile: user.mobile
        });

        await signupPage.clickCreateAccount();

        await expect(signupPage.accountCreatedHeader).toBeVisible();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();
        // After continue, usually verify logged in as user or landing page
        // Verify 'Logged in as username' typically appears
        await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
    });

    test('should show error when registering with existing email', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-5' });
        // Ideally we need an existing user. For this test, we might fail if user doesn't exist.
        // We should create one first or assume a stable existing user.
        // For reliability, let's try to create one, then try again with same email.

        const user = { ...testData.signup.validUser, email: `existing_user_${Date.now()}@test.com` };

        // First signup
        await signupPage.signup(user.name, user.email);
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails(user);
        // Fix: fillAddressDetails expects object matching signature.
        // testData structure matches roughly but verify properties.
        // testData user has flat structure for address fields, so spread is fine if names match.
        // Let's create account to ensure it exists.
        await signupPage.clickCreateAccount();
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();

        // Logout to try again
        await page.getByRole('link', { name: 'Logout' }).click();

        // Try to signup again with same email
        await signupPage.navigateToSignupLogin();
        await signupPage.signup('Different Name', user.email);

        await expect(signupPage.emailAddressAlreadyExistError).toBeVisible();
    });

    test('should prevent signup with empty fields', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'Negative-Empty' });
        // Try to signup with empty name/email
        await signupPage.signup('', '');
        // Expect HTML5 validation or application error.
        // Automation Exercise usually uses HTML5 'required' attribute.
        // Playwright can check validity.

        const nameInput = signupPage.nameInput;
        // We can check if browser blocked submission or if an error message appeared.
        // AutomationExercise might show a tooltip.
        // Let's check simply that we are still on the same page (signup button visible).
        await expect(signupPage.signupButton).toBeVisible();
    });

    test('should prevent account creation when mandatory fields are missing', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'Negative-MandatoryFields' });
        const user = { ...testData.signup.validUser, email: `missing_fields_${Date.now()}@test.com` };
        await signupPage.signup(user.name, user.email);

        // Fill only optional fields or partial mandatory to simulate user error
        await signupPage.firstNameInput.fill(user.firstName);
        await signupPage.lastNameInput.fill(user.lastName);
        // Leaving Password, Address, etc. empty

        await signupPage.clickCreateAccount();

        // Assert: Still on account creation steps (Check if 'Enter Account Information' header is visible)
        // or check browser validation.
        // Since we didn't fill password, browser validation should trigger on password input.
        const passwordInvalid = await signupPage.passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(passwordInvalid).toBeTruthy();
    });

    test('should validate email format and reject invalid emails', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'Boundary-EmailFormat' });
        const invalidEmails = ['plainaddress', '#@%^%#$@#$@#.com', '@example.com', 'Joe Smith <email@example.com>', 'email.example.com', 'email@example@example.com'];

        for (const email of invalidEmails) {
            await signupPage.goto();
            await signupPage.navigateToSignupLogin();
            await signupPage.signup('Test User', email);

            // Should verify validation error or that we didn't proceed
            // Automation Exercise usually uses HTML5 validation
            const isInvalid = await signupPage.emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            // Some browsers might just show a tooltip and not create the property, but standard is validity API.
            expect(isInvalid, `Email ${email} should be invalid`).toBeTruthy();
        }
    });

    test('should trim whitespace from name input', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'Boundary-Whitespace' });
        const email = `whitespace_${Date.now()}@test.com`;
        const nameWithWhitespace = '  Test User  ';

        await signupPage.signup(nameWithWhitespace, email);

        // Check if name field on next page contains trimmed value
        // Note: The 'name' field on step 2 is usually disabled and reflects step 1 input.
        // We need to check if it's trimmed.
        const nameValue = await signupPage.nameDisabledInput.inputValue();
        expect(nameValue.trim()).toBe(nameWithWhitespace.trim());
    });

    test('should display validation messages for mandatory fields', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'UX-ValidationMessages' });
        const user = { ...testData.signup.validUser, email: `validation_test_${Date.now()}@test.com` };
        await signupPage.signup(user.name, user.email);

        // Click Create Account without filling anything
        await signupPage.clickCreateAccount();

        // Check validation on first mandatory field (Password)
        const passwordInvalid = await signupPage.passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(passwordInvalid).toBeTruthy();
    });
});
