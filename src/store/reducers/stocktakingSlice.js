import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stocktakings: [],
    isFetching: false,
    error: false,
};

const stocktakingSlice = createSlice({
    name: 'stocktaking',
    initialState,
    reducers: {
        getStocktakingStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getStocktakingSuccess(state, action) {
            state.stocktakings = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getStocktakingFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetStocktaking(state) {
            state.stocktakings = [];
            state.isFetching = false;
            state.error = false;
        }
    },
});

export const { getStocktakingStart, getStocktakingSuccess, getStocktakingFailed, resetStocktaking } = stocktakingSlice.actions;
export default stocktakingSlice.reducer;