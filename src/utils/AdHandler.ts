import { type Page } from '@playwright/test';

/**
 * Utility class for handling common ad overlays and interstitials
 */
export class AdHandler {
    /**
     * Attempts to close common ad overlays (Google Vignette, popups, etc.)
     * @param page - Playwright Page object
     * @param timeout - Maximum time to wait for ads (default: 2000ms)
     */
    static async closeAdOverlays(page: Page, timeout: number = 2000): Promise<void> {
        try {
            // Wait a moment for ads to potentially load
            await page.waitForTimeout(500);

            // Common ad close button selectors
            const adCloseSelectors = [
                'button:has-text("Close")',
                'button:has-text("✕")',
                '[aria-label*="Close"]',
                '[aria-label*="close"]',
                '.close-button',
                '#dismiss-button',
                '.dismiss-button',
                'div[role="button"]:has-text("Close")'
            ];

            for (const selector of adCloseSelectors) {
                const closeBtn = page.locator(selector).first();
                if (await closeBtn.isVisible({ timeout: timeout })) {
                    await closeBtn.click();
                    console.log(`Closed ad overlay using selector: ${selector}`);
                    return;
                }
            }

            // Handle Google Vignette specifically (check URL hash)
            if (page.url().includes('#google_vignette')) {
                console.log('Google Vignette detected in URL, attempting navigation...');
                await page.goBack();
                await page.waitForLoadState('networkidle');
            }

        } catch (e) {
            // Silently continue if no ads found
            console.log('No ad overlays detected or already closed.');
        }
    }

    /**
     * Waits for page navigation to complete and handles any ad overlays
     * @param page - Playwright Page object
     */
    static async waitForNavigationAndHandleAds(page: Page): Promise<void> {
        // Use domcontentloaded instead of networkidle to avoid ad network delays
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await this.closeAdOverlays(page);
    }
}
