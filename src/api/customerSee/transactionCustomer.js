import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListTranstionCustomer = createAsyncThunk(
    "customerSee/getListTranstionCustomer",
    async ({ currentPage, pageSize,value }) => {
      try {
        const apiUrl =
        value === undefined
          ? `/mcoupon/api/v1/customers/transactions?has_paginate&size=${pageSize}&page=${currentPage}`
          : `/mcoupon/api/v1/customers/transactions?branch_id=${value}&has_paginate&size=${pageSize}&page=${currentPage}`;
      const response = await http.get(apiUrl);
        // const response = await http.get(
        //   `/mcoupon/api/v1/customers/transactions?branch_id=${value}&has_paginate&size=${pageSize}&page=${currentPage}`
        // );
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );