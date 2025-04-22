import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductsByCategory } from '../../services/api';

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async ({ params, callback, successCallback }) => {
        const data = await getAllProducts(params, callback, successCallback);
        return data;
    }
);
export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchProductsByCategory',
    async ({ categoryId, callback, successCallback }) => {
        const data = await getProductsByCategory(categoryId, callback, successCallback);
        return data;
    }
);

// Initial states
const initialState = {
    allProducts: [],
    allCategories: [],
    categories: [],
    cartItems: {},
    minPrice: '',
    maxPrice: '',
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
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const id = product.id;
            if (state.cartItems[id]) {
                state.cartItems[id].quantity += 1;
            } else {
                state.cartItems[id] = { ...product, quantity: 1 };
            }
        },
        incrementQuantity: (state, action) => {
            const id = action.payload;
            if (state.cartItems[id]) {
                state.cartItems[id].quantity += 1;
            }
        },
        decrementQuantity: (state, action) => {
            const id = action.payload;
            if (state.cartItems[id]) {
                if (state.cartItems[id].quantity > 1) {
                    state.cartItems[id].quantity -= 1;
                } else {
                    delete state.cartItems[id];
                }
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            delete state.cartItems[id];
        },
        clearCart: (state) => {
            state.cartItems = {};
        },
        setMinPrice: (state, action) => {
            state.minPrice = action.payload;
        },
        setMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
        },
    },
    extraReducers: (builder) => {
        handleAsync(builder, fetchProducts, (state, action) => {
            state.allProducts = action.payload;
        });
        handleAsync(builder, fetchProductsByCategory, (state, action) => {
            state.categories = action.payload;
        });

    },
});
export const {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    setMinPrice, setMaxPrice 
} = productSlice.actions;

// Then export the reducer as default
export default productSlice.reducer;
