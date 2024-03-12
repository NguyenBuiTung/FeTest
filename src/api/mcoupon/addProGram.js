import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const createProgram = createAsyncThunk(
  "mcoupon/createProgram",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/campaigns`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data); // Trả về dữ liệu lỗi để xử lý ở nơi gọi dispatch
      }
      throw new Error(error);
    }
  }
);