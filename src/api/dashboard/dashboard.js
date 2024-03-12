import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getDashBoard = createAsyncThunk(
  "dashboard/getDashBoard",
  async (id) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/dashboard?branch_id=${id}`
      );
    //   console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getTotalTargetGroup = createAsyncThunk(
  "dashboard/getTotalTargetGroup",
  async ({branch_id,time_start,time_end}) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/total-target-group?branch_id=${branch_id}&time_start=${time_start}&time_end=${time_end}`
      );
    //   console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getTotalTargetGroupDate = createAsyncThunk(
  "dashboard/getTotalTargetGroupDate",
  async ({branch_id,time_start,time_end}) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/dashboard/transaction-by-date?branch_id=${branch_id}&time_start=${time_start}&time_end=${time_end}`
      );
    //   console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getTargetTimeline = createAsyncThunk(
  "dashboard/getTargetTimeline",
  async ({branch_id,time_start,time_end}) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/target-timeline?branch_id=${branch_id}&time_start=${time_start}&time_end=${time_end}`
      );
    //   console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getTopTargetGroup = createAsyncThunk(
  "dashboard/getTopTargetGroup",
  async ({branch_id,time_start,time_end}) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/top-target-group?branch_id=${branch_id}&time_start=${time_start}&time_end=${time_end}`
      );
    //   console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
