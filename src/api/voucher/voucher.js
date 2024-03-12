import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListVoucher = createAsyncThunk(
  "voucher/getListVoucher",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/coupon-codes?has_paginate&page=${currentPage}&size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/coupon-codes`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await http.delete(`/mcoupon/api/v1/coupon-codes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editVoucher = createAsyncThunk(
  "voucher/editVoucher",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/mcoupon/api/v1/coupon-codes/${data.id}`,
        {
          code: data.code,
          branch_id: data.branch_id,
          is_active: data.is_active,
          start_date:data.start_date,
          end_date:data.end_date,
          exchange_point: data?.exchange_point,
          preferential_type: data?.preferential_type,
          preferential_value: data?.preferential_value,
          maximum_reduction: data.maximum_reduction,
          minimum_value: data.minimum_value,
          usage_limit: data?.usage_limit,
          number_use: data?.number_use,
          campaign_id: data?.campaign_id,
        }
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
