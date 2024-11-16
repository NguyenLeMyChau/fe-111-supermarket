import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    invoices: null,
    invoiceRefund: null,
    isFetching: false,
    error: false,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        getInvoiceStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getInvoiceSuccess(state, action) {
            state.invoices = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getInvoiceFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetInvoice(state) {
            state.invoices = null;
            state.isFetching = false;
            state.error = false;
        },
        getInvoiceRefundStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getInvoiceRefundSuccess(state, action) {
            state.invoiceRefund = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getInvoiceRefundFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetRefundInvoice(state) {
            state.invoiceRefund = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const {
    getInvoiceStart,
    getInvoiceSuccess,
    getInvoiceFailed,
    resetInvoice,
    getInvoiceRefundStart,
    getInvoiceRefundSuccess,
    getInvoiceRefundFailed,
    resetRefundInvoice,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;