import { type Page, type Locator, expect } from '@playwright/test';

export class PaymentPage {
    readonly page: Page;
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expirationMonthInput: Locator;
    readonly expirationYearInput: Locator;
    readonly payButton: Locator;
    // content to verify order placement
    readonly orderPlacedHeader: Locator;


    constructor(page: Page) {
        this.page = page;
        this.nameOnCardInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cvcInput = page.locator('input[name="cvc"]');
        this.expirationMonthInput = page.locator('input[name="expiry_month"]');
        this.expirationYearInput = page.locator('input[name="expiry_year"]');
        this.payButton = page.locator('button[id="submit"]');

        // Success message logic can vary, checking for "Order Placed!" text/header
        // Based on typical behavior of this app:
        // url: /payment_done/500
        // text: "Congratulations! Your order has been confirmed!" or "Order Placed!"
        this.orderPlacedHeader = page.getByText('Order Placed!', { exact: true });
    }

    async fillPaymentDetails(details: { name: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string }) {
        await this.nameOnCardInput.fill(details.name);
        await this.cardNumberInput.fill(details.cardNumber);
        await this.cvcInput.fill(details.cvc);
        await this.expirationMonthInput.fill(details.expiryMonth);
        await this.expirationYearInput.fill(details.expiryYear);
    }

    async submitPayment() {
        await this.payButton.click();
    }

    async verifyOrderPlaced() {
        // Wait for navigation or success message
        await expect(this.orderPlacedHeader).toBeVisible({ timeout: 10000 });
        // assert URL or specific text
        // await expect(this.page).toHaveURL(/.*payment_done/); 
    }
}
