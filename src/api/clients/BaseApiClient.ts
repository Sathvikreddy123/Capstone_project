import { APIRequestContext, request } from '@playwright/test';

export interface ApiResponse<T = any> {
    status: number;
    body: T;
    headers: Record<string, string>;
}

export class BaseApiClient {
    protected request: APIRequestContext | null = null;
    protected baseURL: string;

    constructor(baseURL: string = 'https://automationexercise.com/api/') {
        this.baseURL = baseURL;
    }

    /**
     * Initialize the API request context
     * Must be called before making any API calls
     */
    async init(): Promise<void> {
        if (!this.request) {
            this.request = await request.newContext({
                baseURL: this.baseURL,
                extraHTTPHeaders: {
                    'Accept': '*/*',
                },
            });
        }
    }

    /**
     * Dispose the API request context
     * Should be called after tests complete
     */
    async dispose(): Promise<void> {
        if (this.request) {
            await this.request.dispose();
            this.request = null;
        }
    }

    /**
     * Make a GET request
     */
    protected async get<T = any>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        if (!this.request) {
            throw new Error('API client not initialized. Call init() first.');
        }

        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        const response = await this.request.get(url);

        return {
            status: response.status(),
            body: await this.parseResponse<T>(response),
            headers: response.headers(),
        };
    }

    /**
     * Make a POST request with form data
     */
    protected async post<T = any>(endpoint: string, data: Record<string, any>): Promise<ApiResponse<T>> {
        if (!this.request) {
            throw new Error('API client not initialized. Call init() first.');
        }

        const response = await this.request.post(endpoint, {
            form: data,
        });

        return {
            status: response.status(),
            body: await this.parseResponse<T>(response),
            headers: response.headers(),
        };
    }

    /**
     * Make a DELETE request with form data
     */
    protected async delete<T = any>(endpoint: string, data: Record<string, any>): Promise<ApiResponse<T>> {
        if (!this.request) {
            throw new Error('API client not initialized. Call init() first.');
        }

        const response = await this.request.delete(endpoint, {
            form: data,
        });

        return {
            status: response.status(),
            body: await this.parseResponse<T>(response),
            headers: response.headers(),
        };
    }

    /**
     * Make a PUT request with form data
     */
    protected async put<T = any>(endpoint: string, data: Record<string, any>): Promise<ApiResponse<T>> {
        if (!this.request) {
            throw new Error('API client not initialized. Call init() first.');
        }

        const response = await this.request.put(endpoint, {
            form: data,
        });

        return {
            status: response.status(),
            body: await this.parseResponse<T>(response),
            headers: response.headers(),
        };
    }

    /**
     * Parse response body as JSON
     */
    private async parseResponse<T>(response: any): Promise<T> {
        try {
            return await response.json();
        } catch (error) {
            // If JSON parsing fails, return text
            return await response.text() as any;
        }
    }
}
