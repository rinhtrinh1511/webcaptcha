import { configureStore } from "@reduxjs/toolkit";
import getCaptchaNro from "./Slice/getCaptcha";
import websocket from "./Slice/websocket";
import login from "./Slice/login";
import getInfo from "./Slice/getInfo";
import getDetail from "./Slice/getDetail";
import payment from "./Slice/payment";
import topup from "./Slice/topup";
import wsTopup from "./Slice/wsTopup";
import wsMB from "./Slice/wsMB";
import Resetpassword from "./Slice/Resetpassword";

const store = configureStore({
  reducer: {
    getData: getCaptchaNro,
    websocket: websocket,
    authentication: login,
    info: getInfo,
    detail: getDetail,
    payment: payment,
    topup: topup,
    wsTopup: wsTopup,
    wsMB: wsMB,
    repassword: Resetpassword,
  },
  devTools: false,
});

export default store;
