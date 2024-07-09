import axios from "axios";
import {
  getFalse,
  getStart,
  getSuccessMB,
  getSuccessMonth,
  getSuccessNRO,
  getSuccessTools,
} from "../Slice/getCaptcha";
import { setCount } from "../Slice/websocket";
import { loginFailure, loginStart, loginSuccess } from "../Slice/login";
import { infoFailure, infoStart, infoSuccess } from "../Slice/getInfo";
import { detailFailure, detailStart, detailSuccess } from "../Slice/getDetail";
import { paymentFailure, paymentStart, paymentSuccess } from "../Slice/payment";
import { topupSuccess, topuptFailure, topuptStart } from "../Slice/topup";
import { resetFailure, resetStart, resetSuccess } from "../Slice/Resetpassword";

const API = "";
export const login = (data, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API}/api/v1/login`, data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("__s", response.data.success);
    navigate("/");
    dispatch(loginSuccess(response.data));
  } catch (error) {
    dispatch(
      loginFailure(error.response ? error.response.data : error.message)
    );
  }
};

export const signup = (data, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API}/api/v1/signup`, data);
    navigate("/login");
    dispatch(loginSuccess(response.data));
  } catch (error) {
    dispatch(
      loginFailure(error.response ? error.response.data : error.message)
    );
  }
};

export const getCaptchaNro = async (dispatch) => {
  dispatch(getStart());
  try {
    const res = await axios.get(`${API}/api/v1/captcha`);
    dispatch(getSuccessNRO(res.data));
  } catch (error) {
    dispatch(getFalse(error.response ? error.response.data : error.message));
  }
};

export const getCaptchaMB = async (dispatch) => {
  dispatch(getStart());
  try {
    const res = await axios.get(`${API}/api/v1/captchamb`);
    dispatch(getSuccessMB(res.data));
  } catch (error) {
    dispatch(getFalse(error.response ? error.response.data : error.message));
  }
};

export const getCaptchaNroCombo = async (dispatch) => {
  dispatch(getStart());
  try {
    const res = await axios.get(`${API}/api/v1/captchacombo`);
    dispatch(getSuccessMonth(res.data));
  } catch (error) {
    dispatch(getFalse(error.response ? error.response.data : error.message));
  }
};

export const getTools = async (dispatch) => {
  dispatch(getStart());
  try {
    const res = await axios.get(`${API}/api/v1/tools`);
    dispatch(getSuccessTools(res.data));
  } catch (error) {
    dispatch(getFalse(error.response ? error.response.data : error.message));
  }
};

export const fetchCount = async (dispatch) => {
  try {
    const response = await axios(`${API}/api/v1/captchacount`);
    dispatch(setCount(response.data[0].count));
  } catch (error) {
    console.error("Error fetching count:", error);
  }
};

export const getInfo = (token) => async (dispatch) => {
  dispatch(infoStart());
  try {
    const response = await axios(`${API}/api/v1/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(infoSuccess(response.data));
  } catch (error) {
    dispatch(infoFailure(error.response ? error.response.data : error.message));
  }
};

export const getDetail = (data) => async (dispatch) => {
  dispatch(detailStart());
  try {
    const response = await axios.post(`${API}/api/v1/getitem`, data);
    dispatch(detailSuccess(response.data));
  } catch (error) {
    dispatch(
      detailFailure(error.response ? error.response.data : error.message)
    );
  }
};

export const Payment = (token, data) => async (dispatch) => {
  dispatch(paymentStart());
  try {
    const response = await axios.post(`${API}/api/v1/payment`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(paymentSuccess(response.data));
  } catch (error) {
    dispatch(
      paymentFailure(error.response ? error.response.data : error.message)
    );
  }
};

export const TopUp = (token, data) => async (dispatch) => {
  dispatch(topuptStart());
  try {
    const response = await axios.post(`${API}/api/v1/topup`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(topupSuccess(response.data));
  } catch (error) {
    dispatch(
      topuptFailure(error.response ? error.response.data : error.message)
    );
  }
};

export const ChangeKeyNro = (token, data) => async () => {
  try {
    const response = await axios.post(`${API}/api/v1/changekeynro`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const ForgotPassword = (email) => async () => {
  try {
    const response = await axios.post(`${API}/reset-password`, { email });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const RePassword = (data) => async (dispatch) => {
  dispatch(resetStart());
  try {
    const response = await axios.post(`${API}/repassword`, data);
    dispatch(resetSuccess(response.data));
  } catch (error) {
    dispatch(
      resetFailure(error.response ? error.response.data : error.message)
    );
  }
};
