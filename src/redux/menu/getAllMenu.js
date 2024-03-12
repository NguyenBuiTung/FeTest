import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

const initialState = {
  menu: null,
  isLoading: false,
};
export const getMenu = createAsyncThunk("menu/getMenu", async () => {
  try {
    const response = await http.get(`/admin/menus`);
    // console.log(response)
    return response.data.data.menus;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
const getAllMenu = createSlice({
  name: "getAllMenu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        state.menu = action.payload;
        state.isLoading = false;
      })
      .addCase(getMenu.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      });
  },
});

// export const {} = getAllMenu.actions;

export default getAllMenu.reducer;
