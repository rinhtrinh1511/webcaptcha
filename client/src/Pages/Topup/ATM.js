import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/atm.scss";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/fontawesome-free-regular";
import { useDispatch, useSelector } from "react-redux";
import { connectHistoryMBWebSocket } from "../../redux/Slice/wsMB";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import VND from "../../Components/vnd";

function ATM() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const atmKey = state.atmKey;
  const { MBHistory } = useSelector((state) => state.wsMB);

  useEffect(() => {
    if (MBHistory && MBHistory.length > 0 && localStorage.getItem("token")) {
      setIsLoading(false);
    }
  }, [MBHistory]);

  useEffect(() => {
    let ws;
    const initWebSocket = async () => {
      if (localStorage.getItem("token")) {
        ws = await dispatch(
          connectHistoryMBWebSocket(localStorage.getItem("token"))
        );
      }
    };

    initWebSocket();

    return () => {
      if (ws && typeof ws.disconnect === "function") {
        ws.disconnect();
      }
    };
  }, [dispatch]);

  const handleCopy = (ref) => {
    const content = ref.current.textContent || ref.current.innerText;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied to clipboard!",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        console.error("Không thể sao chép nội dung", err);
      });
  };

  return (
    <React.Fragment>
      <Header />
      <div className="atm">
        <p style={{ color: "red" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              color: "#03c51c",
            }}
          >
            Nạp tiền qua ngân hàng
          </span>
          <br />
          Thực hiện chuyển khoản ngân hàng vào số tài khoản bên dưới. Vui lòng
          nhập đúng nội dung chuyển khoản và chờ ở trang này cho đến khi hệ
          thống cập nhật lịch sử thành công.
        </p>
        <div id="atm-response" className="atm-response">
          <div
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px)",
            }}
            className="vietqr"
          >
            <p>
              <span
                style={{
                  fontSize: 18,
                  marginBottom: 12,
                  display: "inline-block",
                  color: "#5252c3",
                }}
              >
                Chuyển khoản theo thông tin bên dưới
              </span>
              <br /> Mở App Ngân hàng quét mã QRCode và nhập số tiền cần chuyển
            </p>
            <img
              src={`https://img.vietqr.io/image/MB-0969938892-compact.png?addInfo=Nap${atmKey}`}
              alt="a"
              style={{ width: 320, margin: "12px 0" }}
            />
          </div>
          <div>
            <p>
              <span
                style={{
                  fontSize: 18,
                  marginBottom: 12,
                  display: "inline-block",
                  color: "#5252c3",
                }}
              >
                Chuyển khoản theo thông tin bên dưới
              </span>
              <br /> chuyển đúng thông tin bên dưới để được cộng tiền thần tốc.
            </p>
            <img
              src={`https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png`}
              alt="a"
              style={{ width: 120, margin: "12px 0" }}
            />
            <div className="table-atm">
              <table>
                <tbody>
                  <tr>
                    <td>Chủ tài khoản:</td>
                    <td
                      style={{
                        textAlign: "start",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Trịnh Văn Rinh
                    </td>
                  </tr>
                  <tr>
                    <td>Số Tài khoản: </td>
                    <td style={{ textAlign: "start", color: "#4db700" }}>
                      <span ref={ref1}>0969938892</span>{" "}
                      <FontAwesomeIcon
                        icon={faCopy}
                        title="copy"
                        color="#504747"
                        onClick={() => handleCopy(ref1)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Nội dung:</td>
                    <td style={{ textAlign: "start", color: "#ff0000c7" }}>
                      <span ref={ref2}>Nap{atmKey}</span>{" "}
                      <FontAwesomeIcon
                        icon={faCopy}
                        color="#504747"
                        title="copy"
                        onClick={() => handleCopy(ref2)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Ngân hàng:</td>
                    <td
                      style={{
                        textAlign: "start",
                        fontWeight: 800,
                        fontSize: 18,
                        color: "#0d0defde",
                      }}
                    >
                      Quân đội (MB)
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: "1rem" }}>
                Đang chờ chuyển khoản (có giao dịch mới sẽ tự update không cần
                F5)
                <br />
                <span
                  style={{
                    color: "red",
                    display: "inline-block",
                    marginTop: 12,
                  }}
                >
                  Lưu ý: Nếu sau 2 phút chưa nhận được tiền vui lòng F5 (Reload)
                  trang này
                </span>{" "}
                <Stack sx={{ width: "100%", marginTop: 2 }} spacing={2}>
                  <LinearProgress color="secondary" />
                </Stack>
              </div>
            </div>
          </div>
        </div>

        <div className="h-mb">
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Lịch sử giao dịch
          </p>
          <table>
            <thead>
              <tr>
                <th>STK</th>
                <th>TK nhận</th>
                <th>Số tiền</th>
                <th>Mã giao dịch</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && localStorage.getItem("token") ? (
                <tr>
                  <td colSpan="7">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="secondary" />
                    </Box>
                  </td>
                </tr>
              ) : MBHistory && MBHistory.length > 0 ? (
                MBHistory.map((data, index) => {
                  let status, color, font;
                  if (parseInt(data.isSuccess) === 0) {
                    status = "Xin chờ";
                    color = "rgb(250 255 16)";
                    font = "#504000";
                  } else {
                    status = "Thành công";
                    color = "rgb(123 201 0)";
                  }

                  const des = data.description.match(/Trace\s*(\d+)/g);
                  return (
                    <tr key={`row-${index}`}>
                      <td key={`item-${index}-1`}>{index + 1}</td>
                      <td key={`item-${index}-2`}>{data.accountNo}</td>
                      <td key={`item-${index}-3`}>{VND(data.creditAmount)}</td>
                      <td key={`item-${index}-5`}>{des[0].match(/\d+/)[0]}</td>
                      <td key={`item-${index}-4`}>{data.transactionDate}</td>
                      <td
                        key={`item-${index}-7`}
                        style={{
                          color: font ? font : "white",
                        }}
                      >
                        <span
                          style={{
                            background: color,
                            padding: 4,
                            boxSizing: "border-box",
                            borderRadius: 4,
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">
                    <div style={{ marginTop: "1rem" }}>
                      <svg
                        width="64"
                        height="41"
                        viewBox="0 0 64 41"
                        xmlns="https://www.w3.org/2000/svg"
                      >
                        <g
                          transform="translate(0 1)"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <ellipse
                            fill="#f5f5f5"
                            cx="32"
                            cy="33"
                            rx="32"
                            ry="7"
                          ></ellipse>
                          <g fillRule="nonzero" stroke="#d9d9d9">
                            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                            <path
                              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                              fill="#fafafa"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p>Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default ATM;
