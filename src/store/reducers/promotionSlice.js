import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    promotions: null,
    isFetching: false,
    error: false,
};

const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        getPromotionStart(state) {
            state.promotions = null;
            state.isFetching = true;
            state.error = false;
        },
        getPromotionSuccess(state, action) {
            state.promotions = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getPromotionFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetPromotion(state) {
            state.promotions = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getPromotionStart, getPromotionSuccess, getPromotionFailed, resetPromotion } = promotionSlice.actions;
export default promotionSlice.reducer;