import { createSlice } from "@reduxjs/toolkit";
import { getDashBoard } from "../../api/dashboard/dashboard";

const initialState = {
  dataDashBoard: null,
  isLoading: false,
};

const dashboard = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashBoard.fulfilled, (state, action) => {
        state.dataDashBoard = action?.payload;
        state.isLoading = false;
      })
      .addCase(getDashBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.error;
      });
  },
});

export const {} = dashboard.actions;

export default dashboard.reducer;
