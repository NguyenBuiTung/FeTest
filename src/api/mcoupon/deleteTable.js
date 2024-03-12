import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const deletePro = createAsyncThunk("mcoupon/deletePro", async (id) => {
    try {
      const response = await http.delete(`/mcoupon/api/v1/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  });
  export const deletePros = createAsyncThunk(
    "mcoupon/deletePros",
    async (codes) => {
      console.log(codes);
      try {
        const response = await http.post(`/mcoupon/api/v1/campaigns/mass-delete`,codes);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    }
  );