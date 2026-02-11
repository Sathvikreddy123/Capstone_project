import { type Page, type Locator, expect } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly productsLink: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productsHeader: Locator;
    readonly productsList: Locator;

    // Locators for "Add to Cart"
    // We use a robust selector strategy here:
    // 1. '.features_items' creates a boundary for the product list.
    // 2. '.col-sm-4' represents a product card.
    // 3. '.productinfo .add-to-cart' targets the static button, avoiding the hover-overlay duplicate which causes strict mode violations.
    readonly addToCartButtonSelector: string = '.productinfo .add-to-cart';

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.getByRole('link', { name: 'Products' });

        // Use ID for stability as it's a unique identifier
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');

        // "SEARCHED PRODUCTS" header
        this.productsHeader = page.locator('.title.text-center');
        this.productsList = page.locator('.features_items');
    }

    async navigateToProducts() {
        await this.productsLink.click();
        await this.handleVignette();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async handleVignette() {
        // Handle Google Vignette (interstitial ad) if it appears
        // It usually appears in an iframe or as a full-page overlay
        try {
            const vignette = this.page.locator('ins.adsbygoogle[data-ad-status="filled"][data-vignette-loaded="true"]');
            if (await vignette.count() > 0 || await this.page.url().includes('#google_vignette')) {
                console.log('Vignette detected, attempting to close...');
                // The dismiss button is often inside an iframe or a specific div
                // Strategy: Click "Close" or "Dismiss" button if visible
                // This selector is a best-guess for Google Ad overlays
                const closeButton = this.page.locator('div[aria-label="Close ad"], button[aria-label="Close ad"], #dismiss-button, .dismiss-button');

                // If inside iframe (common for vignettes)
                const frames = this.page.frames();
                for (const frame of frames) {
                    const btn = frame.locator('div[aria-label="Close ad"], button[aria-label="Close ad"], #dismiss-button');
                    if (await btn.isVisible()) {
                        await btn.click();
                        console.log('Vignette closed via iframe button.');
                        return;
                    }
                }

                // If on main page
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                    console.log('Vignette closed via main page button.');
                }
                // If URL still has hash, maybe go back or force reload? 
                // Usually clicking link again works or it redirects automatically.
                if (this.page.url().includes('#google_vignette')) {
                    await this.page.goBack();
                    await this.productsLink.click();
                }
            }
        } catch (e) {
            console.log('Error handling vignette:', e);
        }
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        await expect(this.productsHeader).toContainText('SEARCHED PRODUCTS', { ignoreCase: true });
    }

    async verifyAllProductsContain(text: string) {
        // Get all product titles in the results
        const titles = this.productsList.locator('.productinfo p');
        const count = await titles.count();
        console.log(`Found ${count} products.`);

        for (let i = 0; i < count; ++i) {
            const title = await titles.nth(i).innerText();
            expect(title.toLowerCase()).toContain(text.toLowerCase());
        }
    }

    async addProductToCart(index: number) {
        // Robust selection: Filter -> nth index -> robust child locator
        // We use hover to ensure interactions trigger correctly if needed, 
        // though the selector targets the visible element.
        const productCard = this.productsList.locator('.col-sm-4').nth(index);
        await productCard.hover();

        // Click the button inside '.productinfo' to avoid ambiguity with overlay
        await productCard.locator(this.addToCartButtonSelector).click();
    }
}
