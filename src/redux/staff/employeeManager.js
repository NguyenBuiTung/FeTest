import { createSlice } from "@reduxjs/toolkit";
import { getListStaff, getListStaffAll } from "../../api/staff/staff";

const initialState = {
  listStaff: null,
  isLoadingStaff: false,
  allListStaff:null,
  isLoadStaffAll:false
};

const employeeManager = createSlice({
  name: "employeeManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListStaff.pending, (state) => {
        state.isLoadingStaff = true;
      })
      .addCase(getListStaff.fulfilled, (state, action) => {
        state.listStaff = action.payload;
        state.isLoadingStaff = false;
      })
      .addCase(getListStaff.rejected, (state, action) => {
        state.isLoadingStaff = false;
      })
      .addCase(getListStaffAll.pending, (state) => {
        state.isLoadStaffAll = true;
      })
      .addCase(getListStaffAll.fulfilled, (state, action) => {
        state.allListStaff = action.payload;
        state.isLoadStaffAll = false;
      })
      .addCase(getListStaffAll.rejected, (state, action) => {
        state.isLoadStaffAll = false;
      });
  },
});

// export const {} = employeeManager.actions

export default employeeManager.reducer;
