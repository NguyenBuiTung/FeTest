import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";
import axios from "axios";

export const getInfoUser = createAsyncThunk("User/getInfoUser", async () => {
  try {
    const response = await http.get(`/auth/api/v1/getUser`);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

export const getUserShop = createAsyncThunk(
  "User/getUserShop",
  async ({ currentPage, pageSize, value }) => {
    try {
      let apiUrl = `https://jsonplaceholder.typicode.com/posts?has_paginate&page=${currentPage}&size=${pageSize}`;
      // Kiểm tra nếu có giá trị tìm kiếm (value) và branchId
      if (value) {
        apiUrl += `&id=${value}`;
      }
      
      const response = await axios.get(apiUrl);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllUser = createAsyncThunk("User/getAllUser", async () => {
  try {
    const response = await http.get(`/auth/api/v1/admin/get-shops`);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});
