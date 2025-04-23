import axios from 'axios';

const BASE_URL = 'https://api.escuelajs.co/api/v1';


export const getAllProducts = async (params = {}, callback = () => {}, successCallback = () => {}) => {
    const endpointPath = Object.keys(params).length
    ? `products?${new URLSearchParams(params)}`
    : 'products';

    try {
        callback?.();
        const { data } = await axios.get(`${BASE_URL}/${endpointPath}`);
        successCallback(data);
        return data;
    } catch (error) {
        console.error('getAllProducts error:', error);
        throw error;
    }
};

export const getProductsByCategory = async (
    categoryId,
    callback = () => {},
    successCallback = () => {}
) => {
    const endpointPath = categoryId == null ? 'categories/' : `categories/${categoryId}`;
    try {
        callback();
        const { data } = await axios.get(`${BASE_URL}/${endpointPath}`);
        successCallback(data);
        return data;
    } catch (error) {
        console.error(`getProductsByCategory error (ID: ${categoryId}):`, error?.response?.data || error.message);
        throw error;
    }
};

