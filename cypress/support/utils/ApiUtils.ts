export class ApiUtils {
    static createUser(userData: any) {
        return cy.request({
            method: 'POST',
            url: '/api/createAccount',
            form: true,
            body: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                title: userData.title,
                birth_date: userData.birth_date,
                birth_month: userData.birth_month,
                birth_year: userData.birth_year,
                firstname: userData.firstname,
                lastname: userData.lastname,
                company: userData.company,
                address1: userData.address1,
                address2: userData.address2,
                country: userData.country,
                zipcode: userData.zipcode,
                state: userData.state,
                city: userData.city,
                mobile_number: userData.mobile_number
            }
        });
    }

    static deleteUser(email: string, password: string) {
        return cy.request({
            method: 'DELETE',
            url: '/api/deleteAccount',
            form: true,
            body: {
                email: email,
                password: password
            },
            failOnStatusCode: false // Allow checking for failure status in tests
        });
    }
}
