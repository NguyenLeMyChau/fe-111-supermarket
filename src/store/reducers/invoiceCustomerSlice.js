import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    invoicesCustomer: null,
    isFetching: false,
    error: false,
};

const invoiceCustomerSlice = createSlice({
    name: 'invoiceCustomer',
    initialState,
    reducers: {
        getInvoiceCustomerStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getInvoiceCustomerSuccess(state, action) {
            state.invoicesCustomer = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getInvoiceCustomerFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetInvoiceCustomer(state) {
            state.invoicesCustomer = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getInvoiceCustomerStart, getInvoiceCustomerSuccess, getInvoiceCustomerFailed, resetInvoiceCustomer } = invoiceCustomerSlice.actions;
export default invoiceCustomerSlice.reducer;