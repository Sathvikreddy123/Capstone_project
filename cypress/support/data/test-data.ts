export const generateUserData = () => {
    const randomString = Math.random().toString(36).substring(7);
    return {
        name: `CypressUser_${randomString}`,
        email: `cy_${randomString}@test.com`,
        password: 'Password123!',
        title: 'Mr',
        birth_date: '10',
        birth_month: '10',
        birth_year: '1990',
        firstname: 'Cypress',
        lastname: 'User',
        company: 'Test Company',
        address1: '123 Test St',
        address2: 'Apt 4B',
        country: 'United States',
        zipcode: '10001',
        state: 'New York',
        city: 'New York',
        mobile_number: '1234567890'
    };
};
