import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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
        addInvoice(state, action) {
            const existingInvoice = state.invoices.find(
                (invoice) => invoice.invoiceCode === action.payload.invoiceCode
            );
        
            if (!existingInvoice) {
                toast.success(`Hóa đơn mới: ${action.payload.invoiceCode}`);
                state.invoices = [...state.invoices, action.payload];
            }
            state.isFetching = false;
            state.error = false;
        },
        updateInvoiceStatus(state, action) {
            const { invoiceCode, status } = action.payload;
            const invoiceIndex = state.invoices?.findIndex(
                (invoice) => invoice.invoiceCode === invoiceCode && invoice.status !== status
            );
            if (invoiceIndex !== -1) {
                toast.success(`Cập nhật trạng thái hóa đơn: ${invoiceCode} - ${status}`);
                state.invoices[invoiceIndex] = {
                    ...state.invoices[invoiceIndex],
                    status,
                };
            }
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
    addInvoice,
    updateInvoiceStatus,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;