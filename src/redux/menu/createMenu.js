import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

const initialState = {
  create: null,
  isLoad: false,
};
export const createMn = createAsyncThunk("menu/createMn", async (data) => {
  try {
    const response = await http.post(`/admin/menus`, data);
    return response.data.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
export const updateMn = createAsyncThunk("menu/updateMn", async (data) => {
  // console.log(data);
  try {
    const response = await http.patch(`/admin/menus/${data.key}`, {
      name: data.name,
      position: data.position,
      url: data.url,
    });
    return response;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
export const deleteMn = createAsyncThunk("menu/deleteMn", async (id) => {
  try {
    const response = await http.delete(`/admin/menus/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
const createMenu = createSlice({
  name: "createMenu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMn.pending, (state) => {
        state.isLoad = true;
      })
      .addCase(createMn.fulfilled, (state, action) => {
        state.create = action.payload;
        state.isLoad = false;
      })
      .addCase(createMn.rejected, (state, action) => {
        state.isLoad = false;
        // state.eroi = action.error.message;
      });
  },
});

// export const {} = createMenu.actions

export default createMenu.reducer;
