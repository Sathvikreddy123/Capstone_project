# Automated Test Suite Documentation

This document detailed the technical implementation and coverage of the 27 Playwright tests and Cypress scenarios.

## 🏗️ Technical Architecture

The test suite follows **industry best practices** for reliability, maintainability, and speed.

*   **Page Object Model (POM)**: UI interactions are encapsulated in `src/pages/`, reducing code duplication and making tests readable.
*   **API Client Abstraction**: API tests use dedicated clients in `src/api/clients/` to handle request construction and response parsing.
*   **Self-Healing Ad Handling**: A custom `AdHandler` utility automatically detects and closes dynamic ad overlays (Google Vignettes using `addLocatorHandler`), preventing flaky timeouts.
*   **Dynamic Data Management**: User data is generated dynamically (`Date.now()`) to avoid conflicts. Cleanup is handled robustly in `afterEach` hooks using API calls where possible for speed.

---

## 🎭 Playwright Tests (27 Total)

### 🖥️ UI Tests (16 Tests)

**Technical Highlights:**
*   **Selectors**: Robust strategies using `data-qa` attributes, text matching, and layout-based locators.
*   **Resilience**: `expect.poll` and auto-waiting assertions used for dynamic content.
*   **State Management**: `test.beforeEach` for setup and `test.afterEach` for cleanup ensure test isolation.

#### 1. Signup & Account Creation (`src/tests/signup/signup.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-1** | `should create account and auto-login...` | **End-to-End Flow**: Validates the complete registration lifecycle. Uses PO `fillAddressDetails` with a typed data object. Verifies persistence by reloading/navigating. |
| **TC-5** | `should show error when registering with existing email` | **State Cleanup**: Creates a user, then attempts to register again. Critical for verifying idempotency and error handling. |
| **Negative-Empty** | `should prevent signup with empty fields` | **HTML5 Validation**: Verifies browser-native validation prevents form submission (URL doesn't change). |
| **Negative-Mandatory** | `should prevent account creation when mandatory fields are missing` | **DOM Evaluation**: Uses `element.evaluate(e => !e.validity.valid)` to inspect the browser's native validity state for specific fields (like password). |
| **Boundary-Email** | `should validate email format and reject invalid emails` | **Loop Optimization**: Iterates through invalid payloads *without* reloading the page (leveraging client-side validation) to speed up execution time significantly. |
| **Boundary-Whitespace** | `should trim whitespace from name input` | **Data Transformation**: Verifies backend/frontend sanitization logic by checking that `InputValue.trim()` matches the original input. |
| **UX-Validation** | `should display validation messages for mandatory fields` | **Accessibility**: Checks for the presence of visible validation feedback (native tooltips or UI messages). |

#### 2. Login (`src/tests/login/login.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-2** | `should login successfully with valid credentials` | **Session Management**: Verifies successful cookie/token exchange. Validates "Logged in as" element visibility. |
| **TC-3** | `should show error when logging in with incorrect credentials` | **Error State**: Assets that generic error messages appear for security (avoiding user enumeration). |
| **TC-4** | `should show error when using valid email with wrong password` | **Security Boundary**: specifically tests authentication failure despite valid identification. |

#### 3. Products (`src/tests/products/products.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-9** | `should search and display products...` | **Collection Assertion**: Iterates through search results to ensure *every* item contains the search term (case-insensitive). |
| **TC-12** | `should add multiple products to cart...` | **Interaction Chaining**: Handles modal dialogs ("Added to Cart") and continues navigation. Verifies `cart_info_table` row count matches added items. |

#### 4. Contact Us (`src/tests/contact-us/contact-us.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-6** | `should submit contact form with file upload...` | **File I/O**: Generates a temporary file using `fs`, uploads it via `setInputFiles` (Playwright's robust file chooser handler), and cleans up afterwards. |
| **TC-7** | `should navigate to test cases page...` | **Ad Resilience**: Uses `AdHandler` to intercept and close the Google Vignette that frequently blocks this specific navigation path. |

#### 5. Checkout (`src/tests/checkout/place-order.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-16** | `should complete end-to-end purchase flow...` | **Complex Workflow**: Integrates 5 different Page Objects. Validates data flow across pages (Address entered in Signup -> displayed in Checkout). Simulates payment processing. |

#### 6. User Data (`src/tests/user-data/verify-address.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **TC-23** | `should verify delivery and billing address...` | **Data Integrity**: strict equality checks between the source-of-truth object (test data) and the rendered DOM elements on the checkout summary. |

---

### 🔌 API Tests (11 Tests)

**Technical Highlights:**
*   **Speed**: Runs directly against endpoints, typically <100ms per test.
*   **Validation**: Validation of HTTP Status Codes, Response JSON Schema, and Logical consistency.
*   **Clients**: Uses `request.newContext()` for isolation.

#### 1. User API (`src/api/tests/user.api.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **API-USER-001** | `should create user account successfully` | **POST Request**: Validates `201 Created` and success message structure. |
| **API-USER-002** | `should login with valid credentials` | **POST Request**: Verifies `200 OK` and presence of authentication token/success flag. |
| **API-USER-003** | `should delete user account successfully` | **DELETE Request**: Verifies resource removal. Critical for self-cleaning tests. |
| **API-USER-004** | `should reject duplicate email registration` | **400 Bad Request**: Validates backend constraint enforcement for unique constraints. |
| **API-USER-005** | `should reject login with invalid credentials` | **404 Not Found**: Validates handling of non-existent resources. |
| **API-USER-006** | `should reject login with correct email but wrong password` | **Security**: Ensures granular error codes (or generic ones) are returned for auth failures. |
| **API-USER-007** | `should reject registration with missing required fields` | **Input Validation**: Verifies backend validation layer catches missing required parameters (e.g., Payload validation). |

#### 2. Product API (`src/api/tests/product.api.spec.ts`)
| Test ID | Test Name | Technical Explanation |
| :--- | :--- | :--- |
| **API-PRODUCT-001** | `should retrieve all products successfully` | **Schema Validation**: Checks that the response array contains objects with required fields (`id`, `name`, `price`). |
| **API-PRODUCT-002** | `should search products by term successfully` | **Query Param Logic**: Tests the search algorithm via API. |
| **API-PRODUCT-003** | `should retrieve all brands successfully` | **GET Request**: Simple retrieval validation. |
| **API-PRODUCT-004** | `should return empty results for non-matching...` | **Edge Case**: Verifies API handles no-match scenarios gracefully (empty array vs null vs error). |

---

## 🌲 Cypress Tests (3 Tests)

**Technical Highlights:**
*   **Network Stubbing**: Use `cy.intercept` to stabilize flaky network calls.
*   **Hybrid Testing**: Combines API setup (`cy.request`) with UI validation.

#### 1. Login (`cypress/e2e/login.cy.ts`)
- **Login Functionality**: Uses `cy.fixture` to separate test data. Mocks the login network request to ensure stability and isolate frontend logic from backend latency.

#### 2. Hybrid State / Advanced (`cypress/e2e/hybrid_state.cy.ts`)
- **The Vanishing User (Hybrid State)**:
    - **Concept**: Tests "Zombie Session" behavior—simulation of a race condition or administrative action.
    - **Mechanism**:
        1. **Setup**: Create user via API (fast).
        2. **Action**: Login via UI.
        3. **Intervention**: Delete user via API *while* browser session is active.
        4. **Verification**: Checks if the UI properly handles the invalidated session (e.g., redirects to login, shows error on action, or updates "Logged in" state).
