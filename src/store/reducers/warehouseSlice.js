import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    warehouse: null,
    products: [],
    isFetching: false,
    error: false,
};

const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState,
    reducers: {
        getWarehouseStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getWarehouseSuccess(state, action) {
            state.warehouse = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getProductsByWarehouseIdSucess(state, action) {
            state.isFetching = false;
            state.error = false;
            state.products = action.payload;
        },
        getWarehouseFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetWarehouse(state) {
            state.warehouse = null;
            state.isFetching = false;
            state.error = false;
            state.products = [];
        }
    },
});

export const { getWarehouseStart, getWarehouseSuccess, getWarehouseFailed, resetWarehouse, getProductsByWarehouseIdSucess } = warehouseSlice.actions;
export default warehouseSlice.reducer;