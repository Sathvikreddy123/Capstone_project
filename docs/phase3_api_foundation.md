# Phase 3: API Test Suite Foundation - Implementation Summary

## Objective
Establish a robust, standalone API automation layer using Playwright's `APIRequestContext` to validate backend functionality independently of the UI.

## 🏗️ Architecture

### 1. Base API Client (`src/api/clients/BaseApiClient.ts`)
- **Context Management**: Wraps `APIRequestContext` with automatic initialization and disposal.
- **Base URL Handling**: Enforces consistent base URL with trailing slash (`https://automationexercise.com/api/`) to ensure correct relative path resolution.
- **Error Handling**: Standardized response wrapper.

### 2. Domain Clients
- **UserClient** (`src/api/clients/UserClient.ts`): Handles user operations (Create, Login, Delete, Update, Get Detail).
  - Implements fail-safe cleanup logic.
- **ProductClient** (`src/api/clients/ProductClient.ts`): Handles product operations (List All, Search, List Brands).
  - Includes response schema validation in tests.

### 3. Data Generation (`src/api/data/api-test-data.ts`)
- Uses `faker` to generate dynamic, robust test data.
- **Factories**:
  - `generateUserData(scenario)`: customizable user data for various scenarios (valid, invalid email, wrong password, etc.).
  - `generateMinimalUserData()`: for boundary testing.

## 🧪 Test Coverage (11 Tests)

### User API (`src/api/tests/user.api.spec.ts`)
| ID | Test Case | Type | Status |
|----|-----------|------|--------|
| API-USER-001 | Create user account successfully | Positive | ✅ PASS |
| API-USER-002 | Login with valid credentials | Positive | ✅ PASS |
| API-USER-003 | Delete user account successfully | Positive | ✅ PASS |
| API-USER-004 | Reject duplicate email registration | Negative | ✅ PASS |
| API-USER-005 | Reject login with invalid credentials | Negative | ✅ PASS |
| API-USER-006 | Reject login with wrong password | Negative | ✅ PASS |
| API-USER-007 | Reject registration with missing fields | Negative | ✅ PASS |

### Product API (`src/api/tests/product.api.spec.ts`)
| ID | Test Case | Type | Status |
|----|-----------|------|--------|
| API-PRODUCT-001 | Retrieve all products successfully | Positive | ✅ PASS |
| API-PRODUCT-002 | Search products by term successfully | Positive | ✅ PASS |
| API-PRODUCT-003 | Retrieve all brands successfully | Positive | ✅ PASS |
| API-PRODUCT-004 | Return empty for non-matching search | Negative | ✅ PASS |

## 🔧 Key Improvements & Fixes
- **URL Resolution**: Fixed 403 Forbidden errors by ensuring `BaseApiClient` uses a trailing slash (`/api/`) and client methods use relative paths avoiding double slashes.
- **Test Discovery**: Updated `playwright.config.ts` (`testDir: './src'`) to run both UI and API tests.
- **Fail-Safe Cleanup**: `User API Tests` include an `afterEach` hook to attempt deletion of any users created during the test, preventing data pollution.

## 🚀 Usage
Run API tests specifically:
```bash
npx playwright test --grep "API"
```
Run all tests (UI + API):
```bash
npx playwright test
```
