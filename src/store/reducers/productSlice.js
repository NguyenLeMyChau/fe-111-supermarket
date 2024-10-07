import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: null,
    isFetching: false,
    error: false,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProductStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getProductSuccess(state, action) {
            state.products = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getProductFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetProduct(state) {
            state.products = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getProductStart, getProductSuccess, getProductFailed, resetProduct } = productSlice.actions;
export default productSlice.reducer;