import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const editUser = createAsyncThunk(
    "User/editUser",
    async (data,{ rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/updateAuth`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
export const editPassWord = createAsyncThunk(
    "User/editPassWord",
    async (data,{ rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/resetPassword`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );