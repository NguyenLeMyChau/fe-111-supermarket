import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    carts: null,
    isFetching: false,
    error: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        getCartStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getCartSuccess(state, action) {
            state.carts = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getCartFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetCart(state) {
            state.carts = null;
            state.isFetching = false;
            state.error = false;
        },
        updateProductQuantity(state, action) {
            const { productId, quantity, total } = action.payload;
            const product = state.carts?.find(product => product.product_id === productId);
            if (product) {
                product.quantity = quantity;
                product.total = total;
            }
        },
    }
});

export const { getCartStart, getCartSuccess, getCartFailed, resetCart, updateProductQuantity } = cartSlice.actions;
export default cartSlice.reducer;