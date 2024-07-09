import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import "../../assets/styles/login.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/APi/api";
import Toast from "../../Components/Toast";
import { reset } from "../../redux/Slice/login";
import Loadding from "../../Components/Loading/loading";
import Fade from "react-reveal/Fade";
import Fade1 from "react-reveal/Reveal";

function Regiser() {
  const [isSigup, setIsSignup] = useState(false);
  const { isSuccess, error, isLoading } = useSelector(
    (state) => state.authentication
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: "",
    account: "",
    password: "",
    confirmPassword: "",
  });

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(signup(data, navigate));
    setIsSignup(true);
  };
  useEffect(() => {
    if (!isSuccess && error && isSigup) {
      Toast.fire({
        icon: "error",
        title: error,
      });
      dispatch(reset());
    } else if (isSuccess && isSigup) {
      Toast.fire({
        icon: "success",
        title: "Đăng ký thành công",
      });
      dispatch(reset());
    }
  }, [isSuccess, error, dispatch, isSigup]);

  return (
    <React.Fragment>
      <Header />
      {isLoading && <Loadding />}
      <div className="login-wrap">
        <span className="title-name-login">ĐĂNG KÝ TÀI KHOẢN</span>
        <br />
        <div className="login-form">
          <Box
            sx={{
              "& > :not(style)": { m: 1 },
            }}
          >
            <Fade right>
              <TextField
                id="filled-email-input"
                label="Email"
                type="email"
                size="small"
                variant="outlined"
                fullWidth
                name="email"
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
                id="filled-text-input"
                label="account"
                type="text"
                size="small"
                variant="outlined"
                fullWidth
                name="account"
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
              />{" "}
            </Fade>
            <Fade right>
              <TextField
                id="outlined-password-input"
                label="password"
                type="password"
                autoComplete="current-password"
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
                id="outlined-confirm-password-input"
                label="confirm password"
                type="password"
                autoComplete="current-password"
                size="small"
                variant="outlined"
                fullWidth
                name="confirmPassword"
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
                onClick={handleLogin}
              >
                Sign Up
              </Button>
            </Fade1>
          </Box>
          <div className="more-login">
            <div className="divider">or continue with</div>
            <div className="fb-gg">
              <Link>
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="36"
                  height="40"
                  viewBox="0 0 48 63"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </Link>
              <Link>
                <FontAwesomeIcon icon={faFacebook} size="2xl" color="#0866FF" />
              </Link>
              <Link>
                <FontAwesomeIcon icon={faGithub} size="2xl" color="black" />
              </Link>
            </div>
            <div className="navigate-signup">
              <span>
                Bạn có tài khoản?<Link to={"/login"}>Đăng nhập ngay</Link>
              </span>
            </div>
          </div>
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

export default Regiser;
