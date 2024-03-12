import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListCustomer = createAsyncThunk(
  "customer/getListCustomer",
  async ({ currentPage, pageSize,value }) => {
    try {
      const apiUrl =
      value === undefined
        ? `/mcoupon/api/v1/customer/getList?has_paginate&size=${pageSize}&page=${currentPage}`
        : `/mcoupon/api/v1/customer/getList?search=${value}&has_paginate&size=${pageSize}&page=${currentPage}`;
    const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailCustomer = createAsyncThunk(
  "customer/getDetailCustomer",
  async (id) => {
    try {
      const response = await http.get(`/mcoupon/api/v1/customer/getId/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListCustomerAll = createAsyncThunk(
  "customer/getListCustomerAll",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/customer/getList`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/customer/store`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCustomer = createAsyncThunk(
  "customer/editCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/customer/update/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/mcoupon/api/v1/customer/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCustomers = createAsyncThunk(
  "customer/deleteCustomers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/customer/mass-delete`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const checkPhoneCustomer = createAsyncThunk(
  "customer/checkPhoneCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/customer/check-phone`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
