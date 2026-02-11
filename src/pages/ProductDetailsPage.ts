import { type Page, type Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly productInformation: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productInformation = page.locator('.product-information');

        // Scope searches within the product information block for stability
        this.productName = this.productInformation.locator('h2');
        this.productCategory = this.productInformation.getByText('Category:');
        this.productPrice = this.productInformation.getByText('Rs.');
        this.productAvailability = this.productInformation.getByText('Availability:');
        this.productCondition = this.productInformation.getByText('Condition:');
        this.productBrand = this.productInformation.getByText('Brand:');
    }

    async verifyProductDetailsVisible() {
        await expect(this.productName).toBeVisible();
        await expect(this.productCategory).toBeVisible();
        await expect(this.productPrice.first()).toBeVisible(); // First because Rs. might appear multiple times
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productCondition).toBeVisible();
        await expect(this.productBrand).toBeVisible();
    }
}
