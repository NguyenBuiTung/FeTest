import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";

export const getListRank = createAsyncThunk(
  "customer/rankcustomer/getListRank",
  async ({ currentPage, pageSize, value }) => {
    try {
      const apiUrl =
        value === undefined
          ? `/mcoupon/api/v1/membership-class?has_paginate&size=${pageSize}&page=${currentPage}`
          : `/mcoupon/api/v1/membership-class?branch_id=${value}&has_paginate&size=${pageSize}&page=${currentPage}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListRankAll = createAsyncThunk(
  "customer/rankcustomer/getListRankAll",
  async (value) => {
    try {
      const apiUrl =
        value === undefined
          ? "/mcoupon/api/v1/membership-class"
          : `/mcoupon/api/v1/membership-class?branch_id=${value}`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createRankCustomer = createAsyncThunk(
  "customer/rankcustomer/createRankCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/mcoupon/api/v1/membership-class`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteRankCustomer = createAsyncThunk(
  "customer/rankcustomer/deleteRankCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/mcoupon/api/v1/membership-class/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editRank = createAsyncThunk(
  "customer/rankcustomer/editRank",
  async (data, { rejectWithValue }) => {
    // console.log( {
    //   name: data.name,
    //   purchase_amount: data.purchase_amount,
    //   branch_id:
    //     data.branch === `${data.branch}` ? data.branchs.id : data.branch,
    // })
    try {
      const response = await http.put(
        `/mcoupon/api/v1/membership-class/${data.id}`,
        {
          name: data.name,
          purchase_amount: data.purchase_amount,
          branch_id:
            data.branch === `${data.branch}` ? data.branchs.id : data.branch,
        }
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
