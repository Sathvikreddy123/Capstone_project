import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly deliveryAddressList: Locator;
    readonly billingAddressList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.deliveryAddressList = page.locator('#address_delivery');
        this.billingAddressList = page.locator('#address_invoice'); // Billing usually labeled 'invoice' in this app or similar
    }

    async verifyDeliveryAddress(user: any) {
        await expect(this.deliveryAddressList).toBeVisible();
        // Verify delivery address matches user details
        await expect(this.deliveryAddressList).toContainText(user.title + '. ' + user.firstName + ' ' + user.lastName); // e.g. "Mr. Test User"
        await expect(this.deliveryAddressList).toContainText(user.address1);
        await expect(this.deliveryAddressList).toContainText(user.city + ' ' + user.state + ' ' + user.zipcode);
        await expect(this.deliveryAddressList).toContainText(user.country);
        await expect(this.deliveryAddressList).toContainText(user.mobile);
    }

    async verifyBillingAddress(user: any) {
        await expect(this.billingAddressList).toBeVisible();
        await expect(this.billingAddressList).toContainText(user.title + '. ' + user.firstName + ' ' + user.lastName);
        await expect(this.billingAddressList).toContainText(user.address1);
        await expect(this.billingAddressList).toContainText(user.city + ' ' + user.state + ' ' + user.zipcode);
        await expect(this.billingAddressList).toContainText(user.country);
        await expect(this.billingAddressList).toContainText(user.mobile);
    }

    async enterComment(comment: string) {
        await this.page.locator('textarea[name="message"]').fill(comment);
    }

    async clickPlaceOrder() {
        await this.page.locator('a[href="/payment"]').click();
    }
}
