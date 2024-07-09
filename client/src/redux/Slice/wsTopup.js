import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const initialStateTopup = {
  topupHistory: [],
  isSuccessH: false,
};

const wsSliceTopup = createSlice({
  name: "topupHistory",
  initialState: initialStateTopup,
  reducers: {
    setHistoryTopup(state, action) {
      state.topupHistory = action.payload;
      state.isSuccessH = true;
    },
    resetH(state, action) {
      state.topupHistory = [];
      state.isSuccessH = false;
    },
  },
});

export const { setHistoryTopup, resetH } = wsSliceTopup.actions;

export const connectHistoryTopupWebSocket = (token) => async (dispatch) => {
  const socket = io("wss://icaptcha.online:8443/historyTopup");

  socket.on("connect", () => {
    console.log("Socket.io");
    socket.emit("token", { token });
  });

  socket.on("history", (data) => {
    dispatch(setHistoryTopup(data));
  });

  socket.on("disconnect", () => {
    console.log("Socket.io disconnected.");
  });

  return socket;
};

export default wsSliceTopup.reducer;
