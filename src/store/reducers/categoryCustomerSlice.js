import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categoriesCustomer: null,
    isFetching: false,
    error: false,
};

const categoryCustomerSlice = createSlice({
    name: 'categoryCustomer',
    initialState,
    reducers: {
        getCategoryCustomerStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getCategoryCustomerSuccess(state, action) {
            state.categoriesCustomer = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getCategoryCustomerFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetCategoryCustomer(state) {
            state.categoriesCustomer = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getCategoryCustomerStart, getCategoryCustomerSuccess, getCategoryCustomerFailed, resetCategoryCustomer } = categoryCustomerSlice.actions;
export default categoryCustomerSlice.reducer;