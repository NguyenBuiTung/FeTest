import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getProvince = createAsyncThunk(
    "customer/getProvince",
    async () => {
      const response = await http.get("/api/v1/province");
    //   console.log(response);
      return response.data;
    }
  );
  export const getDistrict = createAsyncThunk(
    "customer/getDistrict",
    async (province) => {
      const response = await http.get(`/api/v1/district/?province_id=${province}`);
    //   console.log(response)
      return response.data;
    }
  );
  export const getWard = createAsyncThunk(
    "customer/getWard",
    async (district) => {
      const response = await http.get(`/api/v1/ward?district_id=${district}`);
      return response.data;
    }
  );
  export const getAddress = createAsyncThunk(
    "customer/getAddress",
    async () => {
      const response = await http.get(`/mcoupon/api/v1/address`);
      // console.log(response)
      return response.data.data;
    }
  );

