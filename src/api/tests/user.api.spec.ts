import { test, expect } from '@playwright/test';
import { UserClient, UserData } from '../clients/UserClient';
import { generateUserData, generateMinimalUserData } from '../data/api-test-data';

test.describe('User API Tests', () => {
    let userClient: UserClient;
    let createdUsers: Array<{ email: string; password: string }> = [];

    test.beforeEach(async () => {
        userClient = new UserClient();
        await userClient.init();
        createdUsers = []; // Reset tracking
    });

    test.afterEach(async ({ }, testInfo) => {
        // Fail-safe cleanup: delete all created users
        for (const user of createdUsers) {
            try {
                await userClient.deleteAccount(user.email, user.password);
                testInfo.annotations.push({
                    type: 'api-cleanup',
                    description: `Deleted user: ${user.email}`
                });
            } catch (error) {
                testInfo.annotations.push({
                    type: 'api-cleanup-failure',
                    description: `Failed to delete user ${user.email}: ${error}`
                });
            }
        }

        await userClient.dispose();
    });

    // ========== POSITIVE SCENARIOS ==========

    test('should create user account successfully', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-001' });

        const userData = generateUserData('create_success');

        const response = await userClient.createAccount(userData);

        // Track for cleanup
        createdUsers.push({ email: userData.email, password: userData.password });

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(201);
        expect(response.body.message).toBe('User created!');
    });

    test('should login with valid credentials', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-002' });

        // First create a user
        const userData = generateUserData('login_valid');
        await userClient.createAccount(userData);
        createdUsers.push({ email: userData.email, password: userData.password });

        // Then verify login
        const response = await userClient.verifyLogin(userData.email, userData.password);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.message).toBe('User exists!');
    });

    test('should delete user account successfully', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-003' });

        // First create a user
        const userData = generateUserData('delete_success');
        await userClient.createAccount(userData);

        // Then delete the user
        const response = await userClient.deleteAccount(userData.email, userData.password);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(200);
        expect(response.body.message).toBe('Account deleted!');

        // Don't track for cleanup since we already deleted it
    });

    // ========== NEGATIVE SCENARIOS ==========

    test('should reject duplicate email registration', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-004' });

        const userData = generateUserData('duplicate_email');

        // Create user first time
        await userClient.createAccount(userData);
        createdUsers.push({ email: userData.email, password: userData.password });

        // Try to create same user again
        const response = await userClient.createAccount(userData);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(400);
        expect(response.body.message).toBe('Email already exists!');
    });

    test('should reject login with invalid credentials', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-005' });

        const response = await userClient.verifyLogin('nonexistent@test.com', 'wrongpassword');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(404);
        expect(response.body.message).toBe('User not found!');
    });

    test('should reject login with correct email but wrong password', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-006' });

        // First create a user
        const userData = generateUserData('wrong_password');
        await userClient.createAccount(userData);
        createdUsers.push({ email: userData.email, password: userData.password });

        // Try to login with wrong password
        const response = await userClient.verifyLogin(userData.email, 'WrongPassword123');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(404);
        expect(response.body.message).toBe('User not found!');
    });

    test('should reject registration with missing required fields', async ({ }, testInfo) => {
        testInfo.annotations.push({ type: 'test-case-id', description: 'API-USER-007' });

        // Try to create user with only email (missing name and password)
        const response = await userClient.createAccount({
            email: `missing_fields_${Date.now()}@test.com`
        } as UserData);

        // Assertions - API should reject missing required fields
        expect(response.status).toBe(200);
        expect(response.body.responseCode).toBe(400);
        expect(response.body.message).toBe('Bad request, name parameter is missing in POST request.');
    });
});
