import { test, expect } from '@playwright/test';
import { ProductClient } from '../clients/ProductClient';

test.describe('Product API Tests', () => {
    let productClient: ProductClient;

    test.beforeEach(async () => {
        productClient = new ProductClient();
        await productClient.init();
    });

    test.afterEach(async () => {
        await productClient.dispose();
    });

    // ========== POSITIVE SCENARIOS ==========

    test('should retrieve all products successfully', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-PRODUCT-001' });

        const response = await productClient.getAllProducts();

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.products).toBeDefined();
        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.body.products!.length).toBeGreaterThan(0);

        // Validate product structure
        const firstProduct = response.body.products![0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('price');
        expect(firstProduct).toHaveProperty('brand');
        expect(firstProduct).toHaveProperty('category');
    });

    test('should search products by term successfully', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-PRODUCT-002' });

        const searchTerm = 'top';
        const response = await productClient.searchProducts(searchTerm);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.products).toBeDefined();
        expect(Array.isArray(response.body.products)).toBe(true);

        // Verify all returned products contain the search term
        if (response.body.products && response.body.products.length > 0) {
            response.body.products.forEach(product => {
                const productName = product.name.toLowerCase();
                const categoryName = product.category?.category?.toLowerCase() || '';
                const searchLower = searchTerm.toLowerCase();

                expect(
                    productName.includes(searchLower) || categoryName.includes(searchLower)
                ).toBe(true);
            });
        }
    });

    test('should retrieve all brands successfully', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-PRODUCT-003' });

        const response = await productClient.getAllBrands();

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.brands).toBeDefined();
        expect(Array.isArray(response.body.brands)).toBe(true);
        expect(response.body.brands!.length).toBeGreaterThan(0);

        // Validate brand structure
        const firstBrand = response.body.brands![0];
        expect(firstBrand).toHaveProperty('id');
        expect(firstBrand).toHaveProperty('brand');
    });

    test('should return empty results for non-matching search term', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-PRODUCT-004' });

        const searchTerm = 'nonexistentproduct12345xyz';
        const response = await productClient.searchProducts(searchTerm);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.products).toBeDefined();

        // Should return empty array or no products
        if (response.body.products) {
            expect(response.body.products.length).toBe(0);
        }
    });
});
