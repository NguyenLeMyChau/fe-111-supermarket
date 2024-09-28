import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dataManager: {
        suppliers: null,
        products: null,
        categories: null,
        employees: null,
        promotions: null,
        isFetching: false,
        error: false,
        isFetched: false, // Thêm thuộc tính này để kiểm tra xem dữ liệu đã được fetch chưa
    },
};

const commonDataSlice = createSlice({
    name: 'commonData',
    initialState,
    reducers: {
        getDataManagerStart(state) {
            state.dataManager.isFetching = true;
        },
        getDataManagerSuccess(state, action) {
            state.dataManager.isFetching = false;
            state.dataManager.isFetched = true;
            state.dataManager.suppliers = action.payload.suppliers;
            state.dataManager.categories = action.payload.categories;
            state.dataManager.products = action.payload.products;
            state.dataManager.employees = action.payload.employees;
            state.dataManager.promotions = action.payload.promotions;
        },
        getDataManagerFailed(state) {
            state.dataManager.isFetching = false;
            state.dataManager.error = true;
            state.dataManager.isFetched = false;
        },
        resetDataManager(state) {
            state.dataManager = {
                suppliers: [],
                categories: [],
                employees: [],
                products: [],
                promotions: [],
                isFetched: false,
            };
        }
    },
});

export const { getDataManagerStart, getDataManagerSuccess, getDataManagerFailed, resetDataManager } = commonDataSlice.actions;
export default commonDataSlice.reducer;