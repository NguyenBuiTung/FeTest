import { createSlice } from "@reduxjs/toolkit";
import { getListDetailHistory, getListHistory } from "../../api/trade/trade";

const initialState = {
  listHistoryTrade: null,
  isLoadHistory: false,
  detailHistory: null,
  isLoading: false,
  hasFetchedData: false,
};

const trade = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setHasFetchedData: (state, action) => {
      state.hasFetchedData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListHistory.pending, (state) => {
        state.isLoadHistory = true;
      })
      .addCase(getListHistory.fulfilled, (state, action) => {
        state.listHistoryTrade = action.payload;
        state.isLoadHistory = false;
      })
      .addCase(getListHistory.rejected, (state, action) => {
        state.isLoadHistory = false;
      })
      .addCase(getListDetailHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListDetailHistory.fulfilled, (state, action) => {
        state.detailHistory = action.payload;
        state.isLoading = false;
      })
      .addCase(getListDetailHistory.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {setHasFetchedData} = trade.actions;

export default trade.reducer;
