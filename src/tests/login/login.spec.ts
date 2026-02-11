import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { LoginPage } from '../../pages/LoginPage';
import { testData } from '../test-data';

test.describe('Login Feature', () => {
    let signupPage: SignupPage;
    let loginPage: LoginPage;
    let accountCreated: { email: string; password: string } | null = null;

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        loginPage = new LoginPage(page);
        accountCreated = null; // Reset per test
        await signupPage.goto();
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Conditional cleanup: only if account was successfully created
        if (accountCreated) {
            try {
                // Check if already logged in
                const loggedInText = loginPage.loggedInAsUserText('').first();
                const isLoggedIn = await loggedInText.isVisible().catch(() => false);

                if (!isLoggedIn) {
                    await signupPage.navigateToSignupLogin();
                    await loginPage.login(accountCreated.email, accountCreated.password);
                }

                await loginPage.deleteAccount();
                testInfo.annotations.push({ type: 'cleanup', description: `Deleted account: ${accountCreated.email}` });
            } catch (error) {
                testInfo.annotations.push({
                    type: 'cleanup-failure',
                    description: `Failed to delete account ${accountCreated.email}: ${error}`
                });
            }
        }
    });

    test('should login successfully with valid credentials', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-2' });
        // 1. Register User
        const user = { ...testData.signup.validUser, email: `login_valid_${Date.now()}@test.com` };

        await signupPage.navigateToSignupLogin();
        await signupPage.signup(user.name, user.email);
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails(user); // user object has all props
        await signupPage.clickCreateAccount();
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();

        // Verify logged in as user
        await expect(loginPage.loggedInAsUserText(user.name)).toBeVisible();

        // 2. Logout
        await loginPage.logout();

        // 3. Login with valid credentials
        // Verify we are on login page
        await expect(loginPage.loginToAccountHeader).toBeVisible();

        await loginPage.login(user.email, user.password);

        // 4. Verify logged in again
        await expect(loginPage.loggedInAsUserText(user.name)).toBeVisible();

        // Cleanup handled by afterEach
    });

    test('should show error when logging in with incorrect credentials', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-3' });

        await signupPage.navigateToSignupLogin();
        await loginPage.login('wrong_email@test.com', 'wrong_password');
        await expect(loginPage.loginError).toBeVisible();
    });

    test('should show error when using valid email with wrong password', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-4' });
        // Create a user first to have a valid email
        const user = { ...testData.signup.validUser, email: `login_wrong_pass_${Date.now()}@test.com` };

        await signupPage.navigateToSignupLogin();
        await signupPage.signup(user.name, user.email);
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails(user);
        await signupPage.clickCreateAccount();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();
        await loginPage.logout();

        // Try login with valid email but wrong password
        await loginPage.login(user.email, 'WrongPassport123!');
        await expect(loginPage.loginError).toBeVisible();

        // Cleanup handled by afterEach
    });
});
