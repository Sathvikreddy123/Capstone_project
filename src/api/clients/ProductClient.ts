import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: {
        usertype: {
            usertype: string;
        };
        category: string;
    };
}

export interface ProductsApiResponse {
    responseCode: number;
    products?: Product[];
}

export interface BrandsApiResponse {
    responseCode: number;
    brands?: Array<{
        id: number;
        brand: string;
    }>;
}

export class ProductClient extends BaseApiClient {
    /**
     * Get all products
     */
    async getAllProducts(): Promise<ApiResponse<ProductsApiResponse>> {
        return this.get<ProductsApiResponse>('productsList');
    }

    /**
     * Search for products by search term
     */
    async searchProducts(searchTerm: string): Promise<ApiResponse<ProductsApiResponse>> {
        return this.post<ProductsApiResponse>('searchProduct', { search_product: searchTerm });
    }

    /**
     * Get all brands
     */
    async getAllBrands(): Promise<ApiResponse<BrandsApiResponse>> {
        return this.get<BrandsApiResponse>('brandsList');
    }
}
