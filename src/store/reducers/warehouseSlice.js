import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    warehouse: null,
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
        getWarehouseFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetWarehouse(state) {
            state.warehouse = null;
            state.isFetching = false;
            state.error = false;
        }
    },
});

export const { getWarehouseStart, getWarehouseSuccess, getWarehouseFailed, resetWarehouse } = warehouseSlice.actions;
export default warehouseSlice.reducer;