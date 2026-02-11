import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://automationexercise.com',
        defaultCommandTimeout: 30000,
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        // Mirroring Playwright's testDir='./src' logic, but keeping Cypress standard for now
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    },
});
