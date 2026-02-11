import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { testData } from '../test-data';

test.describe('Phase 4: User Data & Personalization', () => {
    let signupPage: SignupPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let accountCreated: { email: string; password: string } | null = null;

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        accountCreated = null; // Reset per test
        await page.goto('/');
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

    test('should verify delivery and billing address details match user registration data', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-23' });
        // 1. Unique User Data
        const user = {
            ...testData.signup.validUser,
            email: `address_verify_${Date.now()}@test.com`,
            name: 'Address Verify User',
            title: 'Mr',
            firstName: 'Address',
            lastName: 'Verify',
            address1: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipcode: '12345',
            mobile: '9876543210'
        };

        // 2. Signup
        await signupPage.navigateToSignupLogin();
        await signupPage.signup(user.name, user.email);
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails(user);
        await signupPage.clickCreateAccount();
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();
        await expect(loginPage.loggedInAsUserText(user.name)).toBeVisible();

        // 3. Add a product to Cart (Minimal action to enable checkout)
        // Using a direct locator for simplicity as we focused on User Data phase
        // Target the button inside '.productinfo' to avoid the overlay button
        const firstProductAddToCart = page.locator('.features_items .col-sm-4').first().locator('.productinfo .add-to-cart');
        await firstProductAddToCart.click();

        // Handle "Added!" modal - click "View Cart"
        const viewCartLink = page.getByRole('link', { name: 'View Cart' });
        await expect(viewCartLink).toBeVisible();
        await viewCartLink.click();

        // 4. Proceed to Checkout
        await cartPage.proceedToCheckout();

        // 5. Verify Address Details on Checkout Page
        await checkoutPage.verifyDeliveryAddress(user);
        await checkoutPage.verifyBillingAddress(user);

        // Cleanup handled by afterEach
    });
});
