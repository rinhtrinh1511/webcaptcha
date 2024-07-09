import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialStateMB = {
  MBHistory: [],
};

const wsSliceMB = createSlice({
  name: "MBHistory",
  initialState: initialStateMB,
  reducers: {
    setHistoryMB(state, action) {
      state.MBHistory = action.payload;
    },
  },
});

export const { setHistoryMB } = wsSliceMB.actions;

export const connectHistoryMBWebSocket = (token) => async (dispatch) => {
  const socket = io("wss://icaptcha.online:8443/historyMB");

  socket.on("connect", () => {
    console.log("Socket.io");
    socket.emit("token", { token });
  });

  socket.on("mbHistory", (data) => {
    dispatch(setHistoryMB(data));
  });

  socket.on("disconnect", () => {
    console.log("Socket.io disconnected.");
  });

  return socket;
};

export default wsSliceMB.reducer;
