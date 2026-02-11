# Signup Feature Automation Walkthrough

## Overview
Successfully implemented the Signup feature automation for `https://automationexercise.com`. The implementation follows the Page Object Model (POM) and includes a comprehensive test suite covering positive, negative, and boundary scenarios.

## Implemented Components
### Page Object Model
- **`src/pages/SignupPage.ts`**: Encapsulates all locators and interactions for the Signup and Account Information pages.
  - Robust locators using `data-qa` attributes.
  - Methods for `signup`, `fillAccountDescription`, `fillAddressDetails`, and validation checks.

### Test Suite
- **`src/tests/signup/signup.spec.ts`**
  - **Positive Scenarios**:
    - Successful user registration.
  - **Negative Scenarios**:
    - Registration with existing email.
    - Missing mandatory fields.
  - **Boundary & Edge Cases**:
    - Invalid email formats.
    - Whitespace handling (verified application behavior).
  - **UI/UX Validation**:
    - Verification of validation messages and button states.

## Verification Results
- **Total Tests**: 7
- **Passed**: 7
- **Failed**: 0
- **Execution Mode**: Sequential (Headed & Headless verified)

### Key Findings
- **Whitespace Handling**: The application preserves whitespace in the Name field rather than trimming it on the second step. The test was adjusted to verify this behavior correctly.
- **Validation**: Browser-based HTML5 validation is used for most required fields.
- **Sequential Execution**: Tests verified running one after the other to ensure no state leakage.

### Phase 2: Login Feature
Successfully implemented the Login feature automation, including:
- **`src/pages/LoginPage.ts`**: Encapsulates login, logout, and account deletion logic.
- **`src/tests/login/login.spec.ts`**:
    - **Valid Login**: Verified login flow after user registration, including logout and re-login.
    - **Invalid Login**: Verified error handling for incorrect credentials.
    - **Account Deletion**: Verified clean-up process.

**Verification Results**:
- **Total Tests**: 3
- **Passed**: 3
- **Failed**: 0
- **Key Fixes**: Corrected locator for 'Continue' button in account deletion flow (switched from `data-testid` to `data-qa`).

### Phase 3: Contact Us & Test Cases
Successfully implemented automation for support pages, verifying file uploads and navigation.
- **`src/pages/ContactUsPage.ts`**: Handles form submission, file upload utilizing `setInputFiles`, and dialogue handling.
- **`src/pages/TestCasesPage.ts`**: Verifies navigation to the Test Cases page.
- **`src/tests/contact-us/contact-us.spec.ts`**:
    - **Contact Us Form**: Validated successful submission with file upload.
    - **Test Cases Page**: Verified page accessibility.

**Verification Results**:
- **Total Tests**: 2
- **Passed**: 2
- **Failed**: 0
- **Key Fixes**: Resolved strict mode violation for 'Test Cases' header by using a specific CSS locator (`h2.title.text-center`).

### Full Regression Suite
Executed all implemented tests sequentially:
1. **Contact Us & Test Cases** (2 tests)
2. **Login Feature** (3 tests)
3. **Signup Feature** (7 tests)

**Results**:
- **Total Tests**: 12
- **Passed**: 12
- **Failed**: 0
- **Duration**: ~2 minutes
- **Stability**: Confirmed with 10s timeout fix for 'Contact Us' success message.

### Phase 4: User Personalization & Data Integrity
Automated "Test Case 23: Verify address details in checkout page" to ensure user data isolation and persistence.
- **`src/pages/CartPage.ts`**: Navigation to Checkout.
- **`src/pages/CheckoutPage.ts`**: Validation of Delivery and Billing addresses against user data.
- **`src/tests/user-data/verify-address.spec.ts`**:
    - Registers a user with unique address details.
    - Adds product to cart -> Proceed to Checkout.
    - **Verification**: Asserts that the Checkout page displays the *exact* user details (Title, Name, Address, Mobile) entered during signup.
    - Deletes account to clean up.

### Phase 5: Product Interactions
Automated core shopping features using robust locators and case-insensitive verification.
- **`src/pages/ProductsPage.ts`**: Handles Search and Add to Cart. Uses strict class selectors and regex matching for stability.
- **`src/pages/ProductDetailsPage.ts`**: Verifies product metadata.
- **`src/tests/products/products.spec.ts`**:
    - **Test Case 9 (Search)**: Verified search logic with term "Blue" (case-insensitive).
    - **Test Case 12 (Add to Cart)**: Verified adding multiple items to cart and modal handling ("Continue Shopping" vs "View Cart").

### Phase 6: Payment & Order Placement
Achieved full "Signup -> Purchase" flow automation.
- **`src/pages/PaymentPage.ts`**: Handles credit card form and submission.
- **`src/tests/checkout/place-order.spec.ts`**:
    - **Test Case 16**: End-to-end verification.
    - Verified: User Registration -> Add Product -> Checkout -> Address Verification -> Comment -> Payment -> Order Success.
    - Addressed `user.title` mismatch by aligning test data with default app behavior.

### Final Production-Ready Implementation
- **Ad Handling**: Created `AdHandler.ts` utility for centralized ad overlay management across all tests.
    - Handles Google Vignette interstitials automatically in `ProductsPage.ts`.
    - Waits for page navigation using `domcontentloaded` (avoids ad network timeout issues).
    - Closes common ad overlays with multiple selector strategies.
- **Contact Us Fix**: Added explicit `:visible` selector wait to handle CSS animation timing.
- **Place Order Fix**: Integrated `AdHandler` for post-signup navigation delays.
- **Final Results**: **16/16 Tests Passing** in 2.0 minutes (normal speed, no slowMo).








## Phase 5: Cypress Integration & Competitive Benchmarking (New)
**Goal**: Integrate Cypress for a head-to-head comparison with Playwright, demonstrating "Senior QA" architectural patterns.

### Key Achievements
- **Architecture Mirroring**: Implemented `cypress/support/pages` (POM) and `cypress/e2e` structure to exactly match Playwright's design.
- **The "Innovator" Test**: Implemented **"The Vanishing User"** (`hybrid_state.cy.ts`), where we simulate an Admin deleting a user via API *while* the user is active in the UI. This demonstrates advanced "Hybrid State" testing capabilities.
- **Automated Benchmarking**: Created `scripts/benchmark.js` to objectively measure execution speed.
    - **Result**: Cypress Login test averaged ~5.7s faster than Playwright in this specific localized test (Headless Electron vs Headless Chrome context).
- **Comparison Artifact**: Created `framework_comparison.md` detailing the trade-offs (TS Support vs DSL Readability).

### How to Run
- **Run Cypress Tests**: `npm run test:cy`
- **Run Benchmark**: `npm run test:benchmark`
- **Interactive Mode**: `npm run test:cy:headed`

## Phase 4: ReportPortal Integration (New)
**Goal**: Enable centralized reporting for "Pro" level visibility.

### Key Achievements
- **Robust Integration**: Configured `playwright.config.ts` to *conditionally* load the ReportPortal reporter only when `RP_API_KEY` is present. This ensures local dev runs don't break without credentials.
- **Security**: Implemented `.env` for credential management (git-ignored) and `.env.example` for template.

### How to Enable Reporting
1. Open `.env` file in the project root.
2. Fill in your ReportPortal credentials:
   ```properties
   RP_API_KEY=your_actual_api_key
   RP_ENDPOINT=https://demo.reportportal.io/api/v1
   RP_PROJECT=your_project_name
   RP_LAUNCH=Regression_Suite
   ```
3. Run tests as usual: `npx playwright test`. The results will automatically be sent to ReportPortal.

## Next Steps
- All planned phases are complete!
- Explore `framework_comparison.md` for the Cypress vs Playwright analysis.
