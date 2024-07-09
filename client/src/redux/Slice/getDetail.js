import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadings: false,
  detail: [],
  isSuccess: false,
  error: null,
};

const detailSlice = createSlice({
  name: "getDetail",
  initialState: initialState,
  reducers: {
    detailStart: (state) => {
      state.isLoadings = true;
    },
    detailSuccess: (state, action) => {
      state.isLoadings = false;
      state.detail = action.payload;
      state.isSuccess = true;
      state.error = null;
    },
    detailFailure: (state, action) => {
      state.isLoadings = false;
      state.error = action.payload;
      state.isSuccess = false;
    },
    resetD: (state, action) => {
      state.isLoadings = true;
      state.detail = [];
      state.isSuccess = false;
      state.error = null;
    },
  },
});

export const { detailStart, detailSuccess, detailFailure, resetD } =
  detailSlice.actions;

export default detailSlice.reducer;
