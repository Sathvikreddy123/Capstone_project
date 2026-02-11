import { UserData } from '../clients/UserClient';

/**
 * Generate unique test user data
 */
export function generateUserData(prefix: string = 'api_test'): UserData {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);

    return {
        name: `${prefix}_user_${timestamp}`,
        email: `${prefix}_${timestamp}_${randomSuffix}@test.com`,
        password: 'Test@123',
        title: 'Mr',
        birth_date: '15',
        birth_month: '6',
        birth_year: '1990',
        firstname: 'Test',
        lastname: 'User',
        company: 'Test Company',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        country: 'United States',
        zipcode: '12345',
        state: 'California',
        city: 'Los Angeles',
        mobile_number: '1234567890',
    };
}

/**
 * Generate minimal user data (only required fields)
 */
export function generateMinimalUserData(prefix: string = 'api_test'): UserData {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);

    return {
        name: `${prefix}_user_${timestamp}`,
        email: `${prefix}_${timestamp}_${randomSuffix}@test.com`,
        password: 'Test@123',
    };
}
