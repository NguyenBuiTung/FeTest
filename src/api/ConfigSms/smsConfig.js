import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getInfoConfig = createAsyncThunk(
  "ConfigSms/getInfoConfig",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/branch-configsms?has_paginate&size=${pageSize}&page=${currentPage}`
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export const getHistorySms = createAsyncThunk(
  "ConfigSms/getHistorySms",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/sent-sms`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateConfigSms = createAsyncThunk(
  "ConfigSms/updateConfigSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/branch-configsms`,
        data
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const sentsms = createAsyncThunk(
  "ConfigSms/sentsms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/sent-sms`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const sentsmsone = createAsyncThunk(
  "ConfigSms/sentsmsone",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/sent-sms-one`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStatusSms = createAsyncThunk(
  "ConfigSms/updateStatusSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/mcoupon/api/v1/update-configsms/${data.id}`,
        { is_active: data.is_active }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteConfigSms = createAsyncThunk(
  "ConfigSms/deleteConfigSms",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/mcoupon/api/v1/branch-configsms/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
