import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: null,
    isFetching: false,
    error: false,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        getOrderStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getOrderSuccess(state, action) {
            state.orders = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getOrderFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetOrder(state) {
            state.orders = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getOrderStart, getOrderSuccess, getOrderFailed, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;