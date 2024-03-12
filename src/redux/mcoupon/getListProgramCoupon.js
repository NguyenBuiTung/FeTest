import { createSlice } from '@reduxjs/toolkit'
import { getLsPrCoupon, getLsPrCouponAll, getLsRestoreCoupon } from '../../api/mcoupon/listTable';
import { deletePros } from '../../api/mcoupon/deleteTable';

const initialState = {
    dataTable:null,
    isLoading:false,
    dataRestore:null,
    loading:false,
    isLoadingDelete:false,
    listAllCoupon:null,
    isLoadAllCoupon:false
}

const getListProgramCoupon = createSlice({
  name: "getListProgramCoupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLsPrCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLsPrCoupon.fulfilled, (state, action) => {
        state.dataTable = action.payload;
        state.isLoading = false;
      })
      .addCase(getLsPrCoupon.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      })
      .addCase(getLsPrCouponAll.pending, (state) => {
        state.isLoadAllCoupon = true;
      })
      .addCase(getLsPrCouponAll.fulfilled, (state, action) => {
        state.listAllCoupon = action.payload;
        state.isLoadAllCoupon = false;
      })
      .addCase(getLsPrCouponAll.rejected, (state, action) => {
        state.isLoadAllCoupon = false;
        // state.eroi = action.error.message;
      })
      .addCase(getLsRestoreCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLsRestoreCoupon.fulfilled, (state, action) => {
        state.dataRestore = action.payload;
        state.loading = false;
      })
      .addCase(getLsRestoreCoupon.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePros.pending, (state) => {
        state.isLoadingDelete = true;
      })
      .addCase(deletePros.fulfilled, (state, action) => {
        state.isLoadingDelete = false;
      })
      .addCase(deletePros.rejected, (state, action) => {
        state.isLoadingDelete = false;
        state.error = action.error;
      });
  },
});

// export const {} = getLsPrCouponAllgramCoupon.actions

export default getListProgramCoupon.reducer