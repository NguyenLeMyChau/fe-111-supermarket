import { createSlice } from "@reduxjs/toolkit";

const productPaySlice = createSlice({
  name: "productPay",
  initialState: {
    productPay: [],
    totalAmount: 0,
    customer: null,
  },
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload.customer;
    },
    setProductPay: (state, action) => {
      state.productPay = action.payload.productPay;
      state.totalAmount = action.payload.totalAmount;
    },
    clearProductPay: (state) => {
      state.productPay = [];
      state.totalAmount = 0;
    },
    clearCustomer: (state) => {
      state.customer = null;
    },
  },
});

// Export all actions
export const { setProductPay, clearProductPay, setCustomer, clearCustomer } = productPaySlice.actions;

export default productPaySlice.reducer;
