import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  CaptchaNro: [],
  CaptchaMonth: [],
  CaptchaMB: [],
  Tools: [],
  isSuccess: false,
  error: null,
};

const getCaptchaNro = createSlice({
  name: "getData",
  initialState: initialState,
  reducers: {
    getStart: (state) => {
      state.isLoading = true;
    },
    getSuccessNRO: (state, action) => {
      state.isLoading = false;
      state.CaptchaNro = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    getSuccessMonth: (state, action) => {
      state.isLoading = false;
      state.CaptchaMonth = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    getSuccessMB: (state, action) => {
      state.isLoading = false;
      state.CaptchaMB = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    getSuccessTools: (state, action) => {
      state.isLoading = false;
      state.Tools = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    getFalse: (state, action) => {
      state.isLoading = true;
      state.error = action.payload;
      state.isSuccess = false;
    },
  },
});

export const {
  getStart,
  getSuccessNRO,
  getSuccessMonth,
  getSuccessMB,
  getFalse,
  getSuccessTools,
} = getCaptchaNro.actions;

export default getCaptchaNro.reducer;
