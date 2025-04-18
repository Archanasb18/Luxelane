import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductsByCategory } from '../../services/api';

// Thunks
export const fetchProducts = createAsyncThunk('product/fetchProducts', async () => {
    return await getAllProducts();
});

export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchProductsByCategory',
    async ({ categoryId, callback, successCallback }) => {
        const data = await getProductsByCategory(categoryId, callback, successCallback);
        return data;
    }
);

// Initial state
const initialState = {
    allProducts: [],
    allCategories: [],
    categories: [],
    loading: false,
    error: null,
};

// Utility to handle loading and error
const handleAsync = (builder, thunk, onSuccess) => {
    builder
        .addCase(thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.loading = false;
            onSuccess(state, action);
        })
        .addCase(thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
};

// Slice
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        handleAsync(builder, fetchProducts, (state, action) => {
            state.allProducts = action.payload;
        });
        handleAsync(builder, fetchProductsByCategory, (state, action) => {
            state.categories = action.payload;
        });
    },
});

export default productSlice.reducer;
