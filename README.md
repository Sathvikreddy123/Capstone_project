# 🎭 AutomationExercise - Dual Framework Suite

A "Senior QA" grade automation repository featuring a direct head-to-head comparison between **Playwright** and **Cypress**, implementing advanced patterns (POM, API Interception, Hybrid State) on [Automation Exercise](https://automationexercise.com).

## 🏆 Key Features

### 1. Robust Page Object Model (POM)
- **Strict Logic Separation**: Page classes (`src/pages`, `cypress/support/pages`) contain *only* locators and actions. Tests contain *only* assertions.
- **Ad Handling**: Centralized `AdHandler` utility automatically dismisses Google Vignettes and overlays.
- **Data Encapsulation**: Dynamic user data generation for every test run (No hardcoded credentials).

### 2. Hybrid API/UI Testing
- **API Tests**: Standalone `APIRequestContext` suite in `src/api` for fast feedback on Backend.
- **"The Vanishing User"**: A special Cypress test (`hybrid_state.cy.ts`) that deletes a logged-in user via API *during* their UI session to verify state resilience.

### 3. Reporting & Benchmarking
- **ReportPortal**: "Pro" integration with conditional loading (won't break local runs).
- **Benchmark Script**: `npm run test:benchmark` compares execution speed between frameworks.

## 🚀 Quick Start

### Playwright (Main Suite)
```bash
# Run all tests (UI + API)
npx playwright test

# Run API tests only
npx playwright test src/api

# Run with ReportPortal (Requires .env)
# Create .env file with RP_API_KEY
npx playwright test
```

### Cypress (Comparison Suite)
```bash
# Run Cypress Headless
npm run test:cy

# Open Cypress Test Runner
npm run test:cy:headed
```

### Performance Benchmark
```bash
# Compare Login Speed (PW vs Cy)
npm run test:benchmark
```

## 📂 Project Structure

```text
├── src/
│   ├── api/          # Pure API Tests (Playwright)
│   ├── pages/        # Playwright Page Objects (POM)
│   └── tests/        # Playwright UI Tests
├── cypress/
│   ├── e2e/          # Cypress Tests
│   └── support/      # Cypress Pages & Commands
├── scripts/          # Benchmark & Utilities
└── playwight.config.ts
```

## 📊 Framework Comparison
See [docs/framework_comparison.md](docs/framework_comparison.md) for a detailed analysis of Developer Experience, Architecture, and Speed results from this project.

## 📚 Documentation
Detailed documentation including Implementation Plans, Walkthroughs, and Technical Design docs can be found in the [`docs/`](./docs) directory.
