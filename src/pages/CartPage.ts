import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly proceedToCheckoutButton: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartLink = page.locator('header').getByRole('link', { name: 'Cart' });
    }

    async navigateToCart() {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/.*view_cart/);
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}
