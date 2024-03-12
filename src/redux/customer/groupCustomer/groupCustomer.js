import { createSlice } from "@reduxjs/toolkit";
import { getListGroupCustomer, getListGroupCustomerALl } from "../../../api/customer/groupCustomer/groupCustomer";

const initialState = {
  listGroupCustomer: null,
  isLoadingGroupCustomer: false,
  allListGroupCustomer:null,
  isLoadAllGroupCustomer:false
};

const groupCustomer = createSlice({
  name: "groupCustomer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListGroupCustomer.pending, (state) => {
        state.isLoadingGroupCustomer = true;
      })
      .addCase(getListGroupCustomer.fulfilled, (state, action) => {
        state.listGroupCustomer = action.payload;
        state.isLoadingGroupCustomer = false;
      })
      .addCase(getListGroupCustomer.rejected, (state, action) => {
        state.isLoadingGroupCustomer = false;
      })
      .addCase(getListGroupCustomerALl.pending, (state) => {
        state.isLoadAllGroupCustomer = true;
      })
      .addCase(getListGroupCustomerALl.fulfilled, (state, action) => {
        state.allListGroupCustomer = action.payload;
        state.isLoadAllGroupCustomer = false;
      })
      .addCase(getListGroupCustomerALl.rejected, (state, action) => {
        state.isLoadAllGroupCustomer = false;
      });
  },
});

// export const {} = groupCustomer.actions;

export default groupCustomer.reducer;
