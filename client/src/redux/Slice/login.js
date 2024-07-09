import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: [],
  isSuccess: false,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = false;
    },
    reset: (state, action) => {
      state.isLoading = false;
      state.data = [];
      state.isSuccess = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, reset } =
  loginSlice.actions;

export default loginSlice.reducer;
