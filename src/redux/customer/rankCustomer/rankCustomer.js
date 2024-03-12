import { createSlice } from '@reduxjs/toolkit'
import { getListRank, getListRankAll } from '../../../api/customer/rankcustomer/rankcustomer';

const initialState = {
    listRank:null,
    isLoading:false,
    listRankAll:null,
    isLoadingAll:false

}

const rankCustomer = createSlice({
  name: "rankCustomer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListRank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListRank.fulfilled, (state, action) => {
        state.listRank = action.payload;
        state.isLoading = false;
      })
      .addCase(getListRank.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getListRankAll.pending, (state) => {
        state.isLoadingAll = true;
      })
      .addCase(getListRankAll.fulfilled, (state, action) => {
        state.listRankAll = action.payload;
        state.isLoadingAll = false;
      })
      .addCase(getListRankAll.rejected, (state, action) => {
        state.isLoadingAll = false;
      });
  },
});

// export const {} = rankCustomer.actions

export default rankCustomer.reducer