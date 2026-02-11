const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

const runs = 3;

async function runCommand(command) {
    const start = performance.now();
    try {
        execSync(command, { stdio: 'ignore' });
    } catch (e) {
        // Ignore errors for benchmarking purposes, just logging time
        // In a real scenario, we'd log failures.
    }
    const end = performance.now();
    return (end - start) / 1000; // seconds
}

async function benchmark() {
    console.log('Running Benchmarks (3 Runs per Framework)...');
    console.log('--------------------------------------------');

    let pwTimes = [];
    let cyTimes = [];

    console.log('Running Playwright (Login Spec)...');
    for (let i = 0; i < runs; i++) {
        const time = await runCommand('npx playwright test src/tests/login/login.spec.ts');
        pwTimes.push(time);
        console.log(`Run ${i + 1}: ${time.toFixed(2)}s`);
    }

    console.log('\nRunning Cypress (Login Spec)...');
    for (let i = 0; i < runs; i++) {
        const time = await runCommand('npx cypress run --spec cypress/e2e/login.cy.ts --headless');
        cyTimes.push(time);
        console.log(`Run ${i + 1}: ${time.toFixed(2)}s`);
    }

    const pwAvg = pwTimes.reduce((a, b) => a + b, 0) / runs;
    const cyAvg = cyTimes.reduce((a, b) => a + b, 0) / runs;

    console.log('\nResults:');
    console.log('--------------------------------------------');
    console.log(`Playwright Avg: ${pwAvg.toFixed(2)}s`);
    console.log(`Cypress Avg:    ${cyAvg.toFixed(2)}s`);
    console.log('--------------------------------------------');

    if (pwAvg < cyAvg) {
        console.log(`Playwright is ${(cyAvg - pwAvg).toFixed(2)}s faster on average.`);
    } else {
        console.log(`Cypress is ${(pwAvg - cyAvg).toFixed(2)}s faster on average.`);
    }
}

benchmark();
