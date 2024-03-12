import { createSlice } from "@reduxjs/toolkit";
import { getAllUser, getInfoUser, getUserShop } from "../../api/User/infoUser";

const initialState = {
  user: null,
  loadUser: false,
  allUser: null,
  isLoadAllUser: false,
  userShop:null,
  isLoading:false
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfoUser.pending, (state) => {
        state.loadUser = true;
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loadUser = false;
      })
      .addCase(getInfoUser.rejected, (state, action) => {
        state.loadUser = false;
        // state.eroi = action.error.message;
      })
      .addCase(getAllUser.pending, (state) => {
        state.isLoadAllUser = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.allUser = action.payload;
        state.isLoadAllUser = false;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.isLoadAllUser = false;
        // state.eroi = action.error.message;
      })
      .addCase(getUserShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserShop.fulfilled, (state, action) => {
        state.userShop = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserShop.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      });
  },
});

// export const {} = user.actions

export default user.reducer;
