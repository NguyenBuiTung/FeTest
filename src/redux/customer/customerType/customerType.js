import { createSlice } from "@reduxjs/toolkit";
import { getListCustomerType, getListCustomerTypeAll } from "../../../api/customer/customertype/listCustomerType";

const initialState = {
  listCustomerType: null,
  isLoading: false,
  allListCustomerType:null,
  isLoadAll:false
};

const customerType = createSlice({
  name: "customerType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCustomerType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListCustomerType.fulfilled, (state, action) => {
        state.listCustomerType = action.payload;
        state.isLoading = false;
      })
      .addCase(getListCustomerType.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getListCustomerTypeAll.pending, (state) => {
        state.isLoadAll = true;
      })
      .addCase(getListCustomerTypeAll.fulfilled, (state, action) => {
        state.allListCustomerType = action.payload;
        state.isLoadAll = false;
      })
      .addCase(getListCustomerTypeAll.rejected, (state, action) => {
        state.isLoadAll = false;
      });
  },
});

// export const {} = customerType.actions;

export default customerType.reducer;
