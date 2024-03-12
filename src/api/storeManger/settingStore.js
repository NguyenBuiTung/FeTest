import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const settingStore = createAsyncThunk(
  "storeManger/settingStore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/branch-setting`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const listSettingStore = createAsyncThunk(
  "storeManger/listSettingStore",
  async (branch_id, { rejectWithValue }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/branch-setting?branch_id=${branch_id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
