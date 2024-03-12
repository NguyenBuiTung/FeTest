import { createSlice } from "@reduxjs/toolkit";
import {
  getListStoreCustomer,
  getListStoreCustomerAll,
} from "../../api/customerSee/customerSee";

const initialState = {
  listStoreCustomer: null,
  isLoading: false,
  listStoreCustomerAll: null,
  isLoadingStore: false,
};

const storeCustomer = createSlice({
  name: "storeCustomer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListStoreCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListStoreCustomer.fulfilled, (state, action) => {
        state.listStoreCustomer = action.payload;
        state.isLoading = false;
      })
      .addCase(getListStoreCustomer.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      })
      .addCase(getListStoreCustomerAll.pending, (state) => {
        state.isLoadingStore = true;
      })
      .addCase(getListStoreCustomerAll.fulfilled, (state, action) => {
        state.listStoreCustomerAll = action.payload;
        state.isLoadingStore = false;
      })
      .addCase(getListStoreCustomerAll.rejected, (state, action) => {
        state.isLoadingStore = false;
        // state.eroi = action.error.message;
      });
  },
});

// export const {} = storeCustomer.actions

export default storeCustomer.reducer;
