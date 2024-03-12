import { createSlice } from '@reduxjs/toolkit'
import { getListStore, getListStoreAll } from '../../api/storeManger/store';

const initialState = {
    listStore:null,
    isLoadStore:false,
    allListStore:null,
    isLoadStoreAll:false
}

const storeManager = createSlice({
  name: "storeManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListStore.pending, (state) => {
        state.isLoadStore = true;
      })
      .addCase(getListStore.fulfilled, (state, action) => {
        state.listStore = action.payload;
        state.isLoadStore = false;
      })
      .addCase(getListStore.rejected, (state, action) => {
        state.isLoadStore = false;
      })
      .addCase(getListStoreAll.pending, (state) => {
        state.isLoadStoreAll = true;
      })
      .addCase(getListStoreAll.fulfilled, (state, action) => {
        state.allListStore = action.payload;
        state.isLoadStoreAll = false;
      })
      .addCase(getListStoreAll.rejected, (state, action) => {
        state.isLoadStoreAll = false;
      })
  },
});

// export const {} = storeManager.actions

export default storeManager.reducer