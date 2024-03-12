import {  createSlice } from "@reduxjs/toolkit";
import {  settings } from "../../utils/config";
import { loginUser } from "../../api/login/login";

const initialState = {
  token: null,
  loading: false,
};

const Login = createSlice({
  name: "Login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        settings.setCookie("access_token", action?.payload?.data?.access_token, 30);
        settings.setCookie("type_user", action?.payload?.data?.type_user, 30);
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

// export const {} = Login.actions

export default Login.reducer;
