import { createSlice } from "@reduxjs/toolkit";
import { getListCustomer, getListCustomerAll } from "../../api/customer/customer";

const initialState = {
  listCustomer: null,
  isLoadCustomer: false,
  allListCustomer:null,
  isLoadAllCustomer:false
};

const customer = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCustomer.pending, (state) => {
        state.isLoadCustomer = true;
      })
      .addCase(getListCustomer.fulfilled, (state, action) => {
        state.listCustomer = action.payload;
        state.isLoadCustomer = false;
      })
      .addCase(getListCustomer.rejected, (state, action) => {
        state.isLoadCustomer = false;
      })
      .addCase(getListCustomerAll.pending, (state) => {
        state.isLoadAllCustomer = true;
      })
      .addCase(getListCustomerAll.fulfilled, (state, action) => {
        state.allListCustomer = action.payload;
        state.isLoadAllCustomer = false;
      })
      .addCase(getListCustomerAll.rejected, (state, action) => {
        state.isLoadAllCustomer = false;
      });
  },
});

// export const {} = customer.actions;

export default customer.reducer;
