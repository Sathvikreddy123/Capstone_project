import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { testData } from '../test-data';
import { AdHandler } from '../../utils/AdHandler';

test.describe('Phase 6: Payment & Order Placement', () => {
    let signupPage: SignupPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let paymentPage: PaymentPage;
    let accountCreated: { email: string; password: string } | null = null;

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        paymentPage = new PaymentPage(page);
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

    test('should complete end-to-end purchase flow with new user registration', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-16' });
        // 1. Register a unique user
        const user = {
            ...testData.signup.validUser,
            email: `order_user_${Date.now()}@test.com`,
            name: 'Order User',
            firstName: 'Order',
            lastName: 'User',
            title: 'Mr'
        };

        await signupPage.navigateToSignupLogin();
        await signupPage.signup(user.name, user.email);
        await signupPage.fillAccountDescription(user.password, user.dob);
        await signupPage.fillAddressDetails(user);
        await signupPage.clickCreateAccount();
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        accountCreated = { email: user.email, password: user.password }; // Track for cleanup
        await signupPage.continueButton.click();

        // Wait for navigation and handle potential ads
        await AdHandler.waitForNavigationAndHandleAds(page);

        await expect(loginPage.loggedInAsUserText(user.name)).toBeVisible();

        // 2. Add product to Cart
        const firstProductAddToCart = page.locator('.features_items .col-sm-4').first().locator('.productinfo .add-to-cart');
        await firstProductAddToCart.click();

        const viewCartLink = page.getByRole('link', { name: 'View Cart' });
        await expect(viewCartLink).toBeVisible();
        await viewCartLink.click();

        // 3. Proceed to Checkout
        await cartPage.proceedToCheckout();

        // 4. Verification & Comment
        await checkoutPage.verifyDeliveryAddress(user);
        await checkoutPage.enterComment('This is a test order.');

        // 5. Place Order
        await checkoutPage.clickPlaceOrder();

        // 6. Payment
        const paymentDetails = {
            name: user.name,
            cardNumber: '1234567890123456',
            cvc: '311',
            expiryMonth: '12',
            expiryYear: '2025'
        };
        await paymentPage.fillPaymentDetails(paymentDetails);
        await paymentPage.submitPayment();

        // 7. Verify Success
        await paymentPage.verifyOrderPlaced();

        // Cleanup handled by afterEach
    });
});
