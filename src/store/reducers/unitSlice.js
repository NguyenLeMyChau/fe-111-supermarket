import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    units: null,
    isFetching: false,
    error: false,
};

const unitSlice = createSlice({
    name: 'unit',
    initialState,
    reducers: {
        getUnitStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getUnitSuccess(state, action) {
            state.units = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getUnitFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetUnit(state) {
            state.units = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getUnitStart, getUnitSuccess, getUnitFailed, resetUnit } = unitSlice.actions;
export default unitSlice.reducer;