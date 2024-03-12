import { createSlice } from "@reduxjs/toolkit";
import { getListVoucher } from "../../api/voucher/voucher";

const initialState = {
  listVoucher: null,
  isLoadingVoucher: false,
};

const voucherRedux = createSlice({
  name: "voucherRedux",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListVoucher.pending, (state) => {
        state.isLoadingVoucher = true;
      })
      .addCase(getListVoucher.fulfilled, (state, action) => {
        state.listVoucher = action.payload;
        state.isLoadingVoucher = false;
      })
      .addCase(getListVoucher.rejected, (state, action) => {
        state.isLoadingVoucher = false;
      });
  },
});

// export const {} = voucherRedux.actions;

export default voucherRedux.reducer;
