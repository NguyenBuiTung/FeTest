import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListStore = createAsyncThunk(
  "storeManger/getListStore",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/branchs?has_parent=true?has_paginate&page=${currentPage}&size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListStoreAll = createAsyncThunk(
  "storeManger/getListStoreAll",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/branchs`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createStore = createAsyncThunk(
  "storeManger/createStore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/mcoupon/api/v1/branchs`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editStore = createAsyncThunk(
  "storeManger/editStore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(`/mcoupon/api/v1/branchs/${data.id}`, {
        name: data.name,
        tax_code:data.tax_code,
        address_detail: data.address_detail,
        province_id: data.province_id,
        district_id: data.district_id,
        ward_id: data.ward_id,
        parent_id:data.parent_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteStore = createAsyncThunk(
  "storeManger/deleteStore",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await http.delete(`/mcoupon/api/v1/branchs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
