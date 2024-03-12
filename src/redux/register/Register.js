import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

const initialState = {
  data: null,
  isLoading: false,
  dataUser:null
};
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await http.post(`/auth/api/v1/register`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const Register = createSlice({
  name: "Register",
  initialState,
  reducers: {
    setDataUser:(state,action)=>{
      state.dataUser=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        // state.eroi = action.error.message;
      });
  },
});

export const {setDataUser} = Register.actions;

export default Register.reducer;
