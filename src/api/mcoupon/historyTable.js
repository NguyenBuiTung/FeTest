import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const restoreProgram = createAsyncThunk(
    "mcoupon/restoreProgram",
    async (id) => {
      try {
        const response = await http.post(`/mcoupon/api/v1/campaigns/trash/${id}/un-trash`);
        // console.log(response);
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );
export const restorePrograms = createAsyncThunk(
    "mcoupon/restorePrograms",
    async (arrayID) => {
      try {
        const response = await http.post(`/mcoupon/api/v1/campaigns/trash/mass-un-trash`,arrayID);
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );
export const restoreProgramAll = createAsyncThunk(
    "mcoupon/restoreProgramAll",
    async () => {
      try {
        const response = await http.post(`/mcoupon/api/v1/campaigns/trash/un-trash-all`);
        return response.data;
      } catch (error) {
        throw new Error("Có lỗi xảy ra trong quá trình kết nối");
      }
    }
  );