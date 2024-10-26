import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: null,
    products: [],
    isFetching: false,
    error: false,
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        getTransactionStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getTransactionSuccess(state, action) {
            state.transactions = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getTransactionFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetTransaction(state) {
            state.transactions = null;
            state.isFetching = false;
            state.error = false;
            state.products = [];
        }
    },
});

export const { getTransactionStart, getTransactionSuccess, getTransactionFailed, resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;