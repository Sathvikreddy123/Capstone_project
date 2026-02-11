import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface UserData {
    name: string;
    email: string;
    password: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    mobile_number?: string;
}

export interface UserApiResponse {
    responseCode: number;
    message: string;
}

export class UserClient extends BaseApiClient {
    /**
     * Create a new user account
     */
    async createAccount(userData: UserData): Promise<ApiResponse<UserApiResponse>> {
        return this.post<UserApiResponse>('createAccount', userData);
    }

    /**
     * Verify user login credentials
     */
    async verifyLogin(email: string, password: string): Promise<ApiResponse<UserApiResponse>> {
        return this.post<UserApiResponse>('verifyLogin', { email, password });
    }

    /**
     * Delete user account
     */
    async deleteAccount(email: string, password: string): Promise<ApiResponse<UserApiResponse>> {
        return this.delete<UserApiResponse>('deleteAccount', { email, password });
    }

    /**
     * Get user details by email
     */
    async getUserByEmail(email: string): Promise<ApiResponse<any>> {
        return this.get('getUserDetailByEmail', { email });
    }

    /**
     * Update user account
     */
    async updateAccount(userData: UserData): Promise<ApiResponse<UserApiResponse>> {
        return this.put<UserApiResponse>('updateAccount', userData);
    }
}
