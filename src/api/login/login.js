import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const loginUser = createAsyncThunk("login/loginUser", async (data) => {
  try {
    const response = await http.post(`/auth/api/v1/login`, data);
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
export const logoutUser = createAsyncThunk("login/logoutUser", async () => {
  try {
    const response = await http.get(`/auth/api/v1/logout`);
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
// export const loginGoogle = createAsyncThunk(
//   "login/loginGoogle",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await http.post(`/auth/api/v1/login/google`, data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
