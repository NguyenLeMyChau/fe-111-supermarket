import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customers: null,
    isFetching: false,
    error: false,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        getCustomerStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getCustomerSuccess(state, action) {
            state.customers = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getCustomerFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetCustomer(state) {
            state.customers = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getCustomerStart, getCustomerSuccess, getCustomerFailed, resetCustomer } = customerSlice.actions;
export default customerSlice.reducer;