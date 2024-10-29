import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productsCustomer: null,
    isFetching: false,
    error: false,
};

const productCustomerSlice = createSlice({
    name: 'productCustomer',
    initialState,
    reducers: {
        getProductCustomerStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getProductCustomerSuccess(state, action) {
            state.productsCustomer = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getProductCustomerFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetProductCustomer(state) {
            state.productsCustomer = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});


export const { getProductCustomerStart, getProductCustomerSuccess, getProductCustomerFailed, resetProductCustomer } = productCustomerSlice.actions;
export default productCustomerSlice.reducer;