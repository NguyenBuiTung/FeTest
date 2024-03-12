import { createSlice } from "@reduxjs/toolkit";
import { getListCustomerSee } from "../../api/customerSee/customerSee";
import { getListTranstionCustomer } from "../../api/customerSee/transactionCustomer";

const initialState = {
  listCustomerSee: null,
  isLoading: false,
  listTransationCustomer:null,
  isLoadList:false
};

const customerSee = createSlice({
  name: "customerSee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCustomerSee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListCustomerSee.fulfilled, (state, action) => {
        state.listCustomerSee = action.payload;
        state.isLoading = false;
      })
      .addCase(getListCustomerSee.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      })
      .addCase(getListTranstionCustomer.pending, (state) => {
        state.isLoadList = true;
      })
      .addCase(getListTranstionCustomer.fulfilled, (state, action) => {
        state.listTransationCustomer = action.payload;
        state.isLoadList = false;
      })
      .addCase(getListTranstionCustomer.rejected, (state, action) => {
        state.isLoadList = false;
        // state.eroi = action.error.message;
      });
  },
});

export const {} = customerSee.actions;

export default customerSee.reducer;
