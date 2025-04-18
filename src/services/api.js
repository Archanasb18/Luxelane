import axios from 'axios';

const BASE_URL = 'https://api.escuelajs.co/api/v1';


export const getAllProducts = async (callback, successCallback) => {
    console.log('getAllProductsAPi', `${BASE_URL}/products`)
    try {
        callback?.(); // optional loading state handler
        const response = await axios.get(`${BASE_URL}/products`);
        successCallback?.(response.data); // optional success handler
        return response.data;
    } catch (error) {
        console.error('getAllProducts error:', error);
        throw error;
    }
};

export const getProductsByCategory = async (categoryId, callback, successCallback) => {

    const endpointPath = categoryId === null ? `categories/` : `categories/${categoryId}`;
    console.log('Fetching products by category from API:', `${BASE_URL}/${endpointPath}`)
    try {
        callback?.();
        const response = await axios.get(`${BASE_URL}/${endpointPath}`);
        console.log('Products by category Response from API:', response.data)
        successCallback?.(response.data);
        return response.data;
    } catch (error) {
        console.error(`getProductsByCategory error (ID: ${categoryId}):`, error.response?.data || error.message);
        throw error;
    }
};

