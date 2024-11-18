import { createSlice } from "@reduxjs/toolkit";

const productPaySlice = createSlice({
  name: "productPay",
  initialState: {
    productPay: [],
    totalAmount: 0,
    customer: null,
    producRefund: [],
    totalRefund:0,
    invoiceCode:"",
    invoiceRefund: {},
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
    setProductRefund: (state, action) => {
      state.producRefund = action.payload.productRefund;
      state.totalRefund = action.payload.totalRefund;
      state.invoiceCode = action.payload.invoiceCode;
      state.invoiceRefund= action.payload.invoiceRefund;
    },
    clearProductRefund: (state) => {
      state.producRefund = [];
      state.totalRefund = 0;
      state.invoiceCode = "";
      state.invoiceRefund= {};
    },
  },
});

// Export all actions
export const { setProductPay, clearProductPay, setCustomer, clearCustomer,setProductRefund,clearProductRefund } = productPaySlice.actions;

export default productPaySlice.reducer;
