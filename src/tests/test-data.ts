export const testData = {
    signup: {
        validUser: {
            name: 'Test Setup User',
            email: `test_user_${Date.now()}@test.com`, // Dynamic to avoid conflict
            password: 'Password123!',
            dob: { day: '10', month: 'January', year: '1990' },
            firstName: 'Test',
            lastName: 'User',
            company: 'TestCompany',
            address1: '123 Test St',
            address2: 'Apt 4B',
            country: 'United States',
            state: 'California',
            city: 'Los Angeles',
            zipcode: '90001',
            mobile: '1234567890'
        }
    }
};
