// store/store.js

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authSlice';
import warehouseReducer from './reducers/warehouseSlice';
import orderReducer from './reducers/orderSlice';
import productReducer from './reducers/productSlice';
import categoryReducer from './reducers/categorySlice';
import supplierReducer from './reducers/supplierSlice';
import employeeReducer from './reducers/employeeSlice';
import promotionReducer from './reducers/promotionSlice';
import unitReducer from './reducers/unitSlice';
import priceReducer from './reducers/priceSlice'
import invoiceReducer from './reducers/invoiceSlice';
import customerReducer from './reducers/customerSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers(
    {
        auth: authReducer,
        warehouse: warehouseReducer,
        order: orderReducer,
        product: productReducer,
        category: categoryReducer,
        supplier: supplierReducer,
        employee: employeeReducer,
        promotion: promotionReducer,
        unit: unitReducer,
        price: priceReducer,
        invoice: invoiceReducer,
        customer: customerReducer
    });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // serializableCheck: {
            //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            // },
            immutableCheck: false, // Tắt ImmutableStateInvariantMiddleware
            serializableCheck: false, // Tắt kiểm tra tuần tự hóa

        }),
});

export let persistor = persistStore(store);
