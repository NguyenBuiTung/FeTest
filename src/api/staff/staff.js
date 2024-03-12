import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListStaff = createAsyncThunk(
  "staff/getListStaff",
  async ({ currentPage, pageSize, value }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/staffs?has_paginate&branch_id=${
          value === undefined ? "null" : value
        }&page=${currentPage}&size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListStaffAll = createAsyncThunk(
  "staff/getListStaffAll",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/staffs`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListStaffHistory = createAsyncThunk(
  "staff/getListStaffHistory",
  async (id) => {
    try {
      const response = await http.get(`/mcoupon/api/v1/staff-histories?staff_id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/staffs`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async (data, { rejectWithValue }) => {
 
console.log(data)
    try {
      const response = await http.put(`/mcoupon/api/v1/staffs/${data.id}`, {
        full_name: data.full_name,
        phone: data.phone,
        birth_day: data.birth_day,
        email: data.email,
        gender: data.gender,
        branch_id:
          data.branch === `${data.branch}` ? data.branchs.id : data.branch,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/mcoupon/api/v1/staffs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
