import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    prices: null,
    isFetching: false,
    error: false,
};

const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: {
        getPriceStart(state) {
            state.prices = null;
            state.isFetching = true;
            state.error = false;
        },
        getPriceSuccess(state, action) {
            state.prices = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getPriceFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetPrice(state) {
            state.prices = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getPriceStart, getPriceSuccess, getPriceFailed, resetPrice } = priceSlice.actions;
export default priceSlice.reducer;
