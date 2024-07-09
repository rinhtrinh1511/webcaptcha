import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  payment: [],
  isSuccess: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "paymentInfo",
  initialState: initialState,
  reducers: {
    paymentStart: (state) => {
      state.isLoading = true;
    },
    paymentSuccess: (state, action) => {
      state.isLoading = false;
      state.payment = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    paymentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = false;
    },
    reset: (state, action) => {
      state.isLoading = false;
      state.payment = [];
      state.isSuccess = false;
      state.error = null;
    },
  },
});

export const { paymentStart, paymentSuccess, paymentFailure, reset } =
  paymentSlice.actions;

export default paymentSlice.reducer;
