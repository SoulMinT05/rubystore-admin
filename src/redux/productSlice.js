import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProducts: (state, action) => {
            state.products = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex((u) => u._id === action.payload.productId);
            console.log('state.products[index]: ', JSON.parse(JSON.stringify(state.products[index])));

            if (index !== -1) {
                state.products[index] = {
                    ...state.products[index],
                    ...action.payload.product,
                };
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter((b) => b._id !== action.payload.productId);
        },
        deleteMultipleProducts: (state, action) => {
            const deleteProduct = action.payload.productIds;
            state.products = state.products.filter((product) => !deleteProduct.includes(product._id));
        },
    },
});

export const { fetchProducts, addProduct, updateProduct, deleteProduct, deleteMultipleProducts } = productSlice.actions;

export default productSlice.reducer;
