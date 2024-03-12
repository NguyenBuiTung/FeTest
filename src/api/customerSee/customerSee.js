import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListCustomerSee = createAsyncThunk(
  "customerSee/getListCustomerSee",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/customers/coupon-codes?has_paginate&size=${pageSize}&page=${currentPage}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getPointCustomerSee = createAsyncThunk(
  "customerSee/getPointCustomerSee",
  async (id) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/customers/get-point?branch_id=${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListStoreCustomer = createAsyncThunk(
  "customerSee/getListStoreCustomer",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(`/mcoupon/api/v1/customers/branchs?has_paginate&size=${pageSize}&page=${currentPage}`);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListStoreCustomerAll = createAsyncThunk(
  "customerSee/getListStoreCustomerAll",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/customers/branchs`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const exchangePoint = createAsyncThunk(
  "customerSee/exchangePoint",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/customers/coupon-codes/exchange-point-for-code`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);