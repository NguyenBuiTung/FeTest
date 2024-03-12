import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const createTrade = createAsyncThunk(
  "trade/createTrade",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/transactions`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const priviewMoney = createAsyncThunk(
  "trade/priviewMoney",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/transactions/real-revenue`,
        data
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getListHistory = createAsyncThunk(
  "trade/getListHistory",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/transactions?has_paginate&page=${currentPage}&size=${pageSize}`
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getListDetailHistory = createAsyncThunk(
  "trade/getListDetailHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.get(`/mcoupon/api/v1/transactions/${id}`);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getPointCustomer = createAsyncThunk(
  "trade/getPointCustomer",
  async ({ branch_id, customer_id }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/transactions/customer-point?branch_id=${branch_id}&customer_id=${customer_id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getListVoucherTrade = createAsyncThunk(
  "trade/getListVoucherTrade",
  async ({ branch_id, customer_id }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/coupon-codes/coupon-by-customer?branch_id=${branch_id}&customer_id=${customer_id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const checkVoucher = createAsyncThunk(
  "trade/checkVoucher",
  async (data) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/transactions/check-coupon`,data
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
