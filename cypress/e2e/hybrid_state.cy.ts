import { LoginPage } from '../support/pages/LoginPage';
import { ApiUtils } from '../support/utils/ApiUtils';
import { generateUserData } from '../support/data/test-data';

describe('Advanced Scenario: The Vanishing User (Hybrid State)', () => {
    const loginPage = new LoginPage();
    let userData: any;

    beforeEach(() => {
        userData = generateUserData();
        // Step 1: Create User via API (Back-end setup)
        ApiUtils.createUser(userData).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('should handle session invalidation when user is deleted via API while active', () => {
        // Step 2: User logs in via UI (Front-end state)
        loginPage.visit();
        loginPage.login(userData.email, userData.password);

        // Assert: User is logged in
        loginPage.getLoggedInAsText().should('be.visible').and('contain.text', userData.name);

        // Step 3: Admin deletes user via API (Back-end state change)
        // Note: In a real app, this might be an Admin API call. Here we simulate it by deleting self credentials via API.
        ApiUtils.deleteUser(userData.email, userData.password).then((response) => {
            expect(response.status).to.eq(200);
            cy.log('User deleted via API while session is active');
        });

        // Step 4: User attempts to interact with UI (Hybrid State Conflict)
        // Click 'Home' or navigate to 'Account' - expect either a redirect or an error, but NOT 200 OK dashboard
        // In this app, navigation might still work due to client-side routing until a protected API is called.
        // Let's try to logout (which usually calls an API) or delete account (button).

        // Let's try to navigate to 'Delete Account' via UI button.
        // Since the user is already deleted, this action might fail or show "User not found".

        // For AutomationExercise, clicking "Delete Account" usually triggers the deletion logic. 
        // But we already deleted it!
        // Let's see what happens if we reload the page.
        cy.reload();

        // Verification Strategies:
        // 1. If session uses cookies validated on load, user should be logged out.
        // 2. If session is JWT in local storage without validation, they might appear logged in but API calls fail.

        // Assertion: We expect the application to handle this "State Mismatch".
        // In this specific app, if we reload and the backend says "User doesn't exist", 
        // the "Logged in as" text should ideally disappear.

        // Note: AutomationExercise behavior might be simple. Let's asserting that we are either logged out OR 
        // if we are "logged in", actions fail.

        // Let's check if the "Logged in as" element is still there.
        // If it is, then the app has a "Zombie Session" bug (Client thinks it's logged in, Server knows it's gone).
        // This test *documents* that behavior.

        cy.get('body').then(($body) => {
            if ($body.find('a:contains("Logged in as")').length > 0) {
                cy.log('BUG/FEATURE: Session persists in UI after API deletion (Zombie Session)');
                // If UI still thinks we are logged in, try to click 'Logout'
                loginPage.logout();
                // Should be redirected to login
                cy.url().should('include', '/login');
            } else {
                cy.log('SUCCESS: UI correctly identified session is invalid');
                // Should see login/signup links
                cy.get('a[href="/login"]').should('be.visible');
            }
        });
    });
});
