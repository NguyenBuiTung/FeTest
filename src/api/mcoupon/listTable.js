import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getLsPrCoupon = createAsyncThunk(
  "mcoupon/getLsPrCoupon",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/campaigns?has_paginate&page=${currentPage}&size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getLsPrCouponAll = createAsyncThunk(
  "mcoupon/getLsPrCouponAll",
  async (id) => {
    try {
      const apiUrl =
        id === undefined
          ? "/mcoupon/api/v1/campaigns"
          : `/mcoupon/api/v1/campaigns?branch_id=${id}`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const editPro = createAsyncThunk("mcoupon/edit", async (data) => {
  try {
    const response = await http.put(`/mcoupon/api/v1/campaigns/${data.id}`, {
      name: data.name,
      customer_category_ids: data.customer_category_ids,
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active,
      branch_id: data.branch_id,
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});
export const getLsRestoreCoupon = createAsyncThunk(
  "mcoupon/getLsRestoreCoupon",
  async ({ currentPage, pageSize }) => {
    try {
      const response = await http.get(
        `/mcoupon/api/v1/campaigns/trash?page=${currentPage}&size=${pageSize}`
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const exportExcelMcoupon = createAsyncThunk(
  "mcoupon/exportExcelMcoupon",
  async () => {
    try {
      const response = await http.get(`/mcoupon/api/v1/campaigns/export-excel`);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
