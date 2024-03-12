import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";
export const getListGroupCustomer = createAsyncThunk(
  "groupCustomer/getListGroupCustomer",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/group-customers?has_paginate&size=${pageSize}&page=${currentPage}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getListGroupCustomerALl = createAsyncThunk(
  "groupCustomer/getListGroupCustomerALl",
  async (value) => {
    try {
      const apiUrl =
        value === undefined
          ? "/mcoupon/api/v1/group-customers"
          : `/mcoupon/api/v1/group-customers?branch_id=${value}`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      // return rejectWithValue(error.response.data);
    }
  }
);

export const createGroupCustomer = createAsyncThunk(
  "groupCustomer/createGroupCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/group-customers`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteGroupCustomer = createAsyncThunk(
  "groupCustomer/deleteGroupCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/mcoupon/api/v1/group-customers/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editGroupCustomer = createAsyncThunk(
  "groupCustomer/editGroupCustomer",
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await http.put(
        `/mcoupon/api/v1/group-customers/${data.id}`,
        {
          name: data.name,
          customer_id: data?.customer_id,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
