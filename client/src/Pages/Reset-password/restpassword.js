import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import "../../assets/styles/login.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import Fade1 from "react-reveal/Jello";

import SpinToSuccess from "../../Components/SpinToSuceess/SpinToSS";
import { RePassword } from "../../redux/APi/api";
import Swal from "sweetalert2";
import { reset } from "../../redux/Slice/Resetpassword";
function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkReset, setCheckReset] = useState(false);
  const { data, isLoading, isSuccess, error } = useSelector(
    (state) => state.repassword
  );
  const [token, setToken] = useState("");
  const [dataReset, setDataReset] = useState({
    password: "",
    confirmpassword: "",
    token,
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    setToken(token);
    setDataReset((prevData) => ({ ...prevData, token }));
  }, []);

  useEffect(() => {
    if (isSuccess && checkReset && !error) {
      Swal.fire({
        text: data,
        timer: 2000,
        icon: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      dispatch(reset());
    } else if (!isSuccess && error && checkReset) {
      Swal.fire({
        text: error,
        icon: "error",
        timer: 2000,
      });
      dispatch(reset());
    }
  }, [dispatch, error, data, isSuccess, navigate, checkReset]);
  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    setDataReset((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReset = () => {
    dispatch(RePassword(dataReset));
    setCheckReset(true);
  };

  return (
    <React.Fragment>
      <Header />
      <div
        className="login-wrap"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        <span className="title-name-login">Quên mật khẩu</span>
        <br />
        <span
          style={{
            fontSize: "20px",
            display: "inline-block",
            fontWeight: 400,
            marginTop: 12,
          }}
        ></span>

        <div className="login-form">
          <Box
            sx={{
              "& > :not(style)": { m: 1 },
            }}
          >
            <Fade right>
              <TextField
                id="filled-text-input"
                label="Password"
                type="text"
                size="small"
                variant="outlined"
                fullWidth
                name="password"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Chakra Petch, Arial, sans-serif",
                    fontWeight: "500",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Chakra Petch, Arial, sans-serif",
                    fontSize: "16px",
                    fontWeight: "600",
                  },
                }}
                onChange={handleTextFieldChange}
              />
            </Fade>
            <Fade left>
              <TextField
                id="outlined-password-input"
                label="Confirm Password"
                type="text"
                autoComplete="current-password"
                size="small"
                variant="outlined"
                fullWidth
                name="confirmpassword"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Chakra Petch, Arial, sans-serif",
                    fontWeight: "500",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Chakra Petch, Arial, sans-serif",
                    fontSize: "16px",
                    fontWeight: "600",
                  },
                }}
                onChange={handleTextFieldChange}
              />
            </Fade>
            <Fade1>
              <Button
                variant="contained"
                fullWidth
                style={buttonStyle}
                onClick={handleReset}
              >
                {isLoading ? <SpinToSuccess /> : "Change Password"}
              </Button>{" "}
            </Fade1>
          </Box>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
const buttonStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontWeight: "bold",
  fontSize: "16px",
};

export default ResetPassword;
