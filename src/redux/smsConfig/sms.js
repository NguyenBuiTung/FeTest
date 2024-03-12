import { createSlice } from "@reduxjs/toolkit";
import { getHistorySms, getInfoConfig } from "../../api/ConfigSms/smsConfig";

const initialState = {
  listConfig: null,
  isLoadConfig: false,
  listHistorySms:null,
  isLoadHistorySms:false
};

const sms = createSlice({
  name: "sms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfoConfig.pending, (state) => {
        state.isLoadConfig = true;
      })
      .addCase(getInfoConfig.fulfilled, (state, action) => {
        state.listConfig = action.payload;
        state.isLoadConfig = false;
      })
      .addCase(getInfoConfig.rejected, (state, action) => {
        state.isLoadConfig = false;
      })
      .addCase(getHistorySms.pending, (state) => {
        state.isLoadHistorySms = true;
      })
      .addCase(getHistorySms.fulfilled, (state, action) => {
        state.listHistorySms = action.payload;
        state.isLoadHistorySms = false;
      })
      .addCase(getHistorySms.rejected, (state, action) => {
        state.isLoadHistorySms = false;
      })
  },
});

// export const {} = sms.actions;

export default sms.reducer;
