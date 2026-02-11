import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Phase 5: Product Interactions', () => {
    let productsPage: ProductsPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        await page.goto('/');
    });

    test('should search and display products matching search term', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-9' });
        const searchTerm = 'Blue';

        await productsPage.navigateToProducts();

        await productsPage.searchProduct(searchTerm);

        await productsPage.verifyAllProductsContain(searchTerm);
    });

    test('should add multiple products to cart and verify cart count', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'TC-12' });
        await productsPage.navigateToProducts();

        // 1. Add First Product
        await productsPage.addProductToCart(0);

        // Handle "Added!" modal - click "Continue Shopping"
        await expect(page.getByText('Your product has been added to cart.')).toBeVisible();
        await page.getByRole('button', { name: 'Continue Shopping' }).click();

        // 2. Add Second Product
        await productsPage.addProductToCart(1);

        // Handle "Added!" modal - click "View Cart"
        await expect(page.getByText('Your product has been added to cart.')).toBeVisible();
        await page.getByRole('link', { name: 'View Cart' }).click();

        // 3. Verify Cart Contents
        const cartItems = page.locator('#cart_info_table tbody tr');
        await expect(cartItems).toHaveCount(2);
    });
});
