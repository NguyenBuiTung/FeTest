import { createSlice } from "@reduxjs/toolkit";
import { createProgram } from "../../api/mcoupon/addProGram";

const initialState = {
  proGramCoupon: null,
  loading: false,
  error: null,
};

const addProgram = createSlice({
  name: "addProgram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.proGramCoupon = action?.payload;
        state.loading = false;
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error;
      });
  },
});

// export const {} = addProgram.actions

export default addProgram.reducer;
