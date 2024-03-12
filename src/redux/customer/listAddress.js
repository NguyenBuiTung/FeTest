import { createSlice } from '@reduxjs/toolkit'
import { getAddress, getDistrict, getProvince, getWard } from '../../api/customer/listAddress';

const initialState = {
    options: [],
    option2: [],
    option3: [],
    loading: false,
    loading2: false,
    loading3: false,
    loadAddress:false,
    dataAddress:null
}

const listAddress = createSlice({
  name: "listAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get api province cấp 1
      .addCase(getProvince.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProvince.fulfilled, (state, action) => {
        state.options = action?.payload?.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        state.loading = false;
      })
      .addCase(getProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Get api districts cấp 2
      .addCase(getDistrict.pending, (state) => {
        state.loading2 = true;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.option2 = action?.payload?.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        state.loading2 = false;
      })
      .addCase(getDistrict.rejected, (state, action) => {
        state.loading2 = false;
        state.error = action.error.message;
      })
      //Get api wards cấp 3
      .addCase(getWard.pending, (state) => {
        state.loading3 = true;
      })
      .addCase(getWard.fulfilled, (state, action) => {
        state.option3 = action?.payload?.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        state.loading3 = false;
      })
      .addCase(getWard.rejected, (state, action) => {
        state.loading3 = false;
        state.error = action.error.message;
      })
      .addCase(getAddress.pending, (state) => {
        state.loadAddress = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.dataAddress =action.payload
        state.loadAddress = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loadAddress = false;
        state.error = action.error.message;
      });
  },
});

export const {} = listAddress.actions

export default listAddress.reducer