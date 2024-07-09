import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  topup: [],
  isSuccess: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "topup",
  initialState: initialState,
  reducers: {
    topuptStart: (state) => {
      state.isLoading = true;
    },
    topupSuccess: (state, action) => {
      state.isLoading = false;
      state.topup = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    topuptFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = false;
    },
    reset: (state, action) => {
      state.isLoading = true;
      state.topup = [];
      state.isSuccess = false;
      state.error = null;
    },
  },
});

export const { topuptStart, topupSuccess, topuptFailure, reset } =
  paymentSlice.actions;

export default paymentSlice.reducer;
