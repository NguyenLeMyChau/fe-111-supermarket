import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: null,
    isFetching: false,
    error: false,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategoryStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getCategorySuccess(state, action) {
            state.categories = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getCategoryFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetCategory(state) {
            state.categories = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getCategoryStart, getCategorySuccess, getCategoryFailed, resetCategory } = categorySlice.actions;
export default categorySlice.reducer;