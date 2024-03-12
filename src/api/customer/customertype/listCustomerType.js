import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";

export const getListCustomerType = createAsyncThunk(
    "customer/customertype/getListCustomerType",
    async ({ currentPage, pageSize }) => {
      try {
        const response = await http.get(`/mcoupon/api/v1/customer-categories?has_paginate&size=${pageSize}&page=${currentPage}`);
        // console.log(response)
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );
  export const getListCustomerTypeAll = createAsyncThunk(
    "customer/customertype/getListCustomerTypeAll",
    async () => {
      try {
        const response = await http.get(`/mcoupon/api/v1/customer-categories`);
        // console.log(response)
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );
export const createCustomerType = createAsyncThunk(
    "customer/customertype/createCustomerType",
    async (data,{rejectWithValue}) => {
      try {
        const response = await http.post(`/mcoupon/api/v1/customer-categories`,data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
export const editCustomerType = createAsyncThunk(
    "customer/customertype/editCustomerType",
    async (data,{rejectWithValue}) => {
      try {
        const response = await http.put(`/mcoupon/api/v1/customer-categories/${data.id}`,data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
export const deleteCustomerType = createAsyncThunk(
    "customer/customertype/deleteCustomerType",
    async (id,{rejectWithValue}) => {
      try {
        const response = await http.delete(`/mcoupon/api/v1/customer-categories/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );