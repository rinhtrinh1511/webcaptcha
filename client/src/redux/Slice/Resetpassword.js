import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: [],
  isSuccess: false,
  error: null,
};

const ResetPasswordSlice = createSlice({
  name: "repassword",
  initialState: initialState,
  reducers: {
    resetStart: (state) => {
      state.isLoading = true;
    },
    resetSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    resetFailure: (state, action) => {
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

export const { resetStart, resetSuccess, resetFailure, reset } =
  ResetPasswordSlice.actions;

export default ResetPasswordSlice.reducer;
