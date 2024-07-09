// WebSocketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  count: 0,
};

const wsSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setCount(state, action) {
      state.count = action.payload;
    },
  },
});

export const { setCount } = wsSlice.actions;

export const connectWebSocket = () => (dispatch) => {
  const socket = io("wss://icaptcha.online:8443/count");

  socket.on("connect", () => {
    console.log("Socket.io connected.");
  });

  socket.on("count", (data) => {
    dispatch(setCount(data.count));
  });

  socket.on("disconnect", () => {
    console.log("Socket.io disconnected.");
  });

  return socket;
};

export default wsSlice.reducer;
