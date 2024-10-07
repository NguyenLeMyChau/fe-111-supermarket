import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    suppliers: null,
    isFetching: false,
    error: false,
};

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        getSupplierStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getSupplierSuccess(state, action) {
            state.suppliers = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getSupplierFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetSupplier(state) {
            state.suppliers = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getSupplierStart, getSupplierSuccess, getSupplierFailed, resetSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;