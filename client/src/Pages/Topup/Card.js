import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import "../../assets/styles/card.scss";
import Swal from "sweetalert2";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { TopUp } from "../../redux/APi/api";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/Slice/topup";
import { connectHistoryTopupWebSocket } from "../../redux/Slice/wsTopup";
import convertUtcToUtcPlus7 from "../../Components/formatDateSql";
import VND from "../../Components/vnd";

function Thesieure() {
  const dispatch = useDispatch();
  const [isTopup, setIsTopup] = useState(false);
  const { topupHistory, isSuccessH } = useSelector((state) => state.wsTopup);

  useEffect(() => {
    let ws;
    const initWebSocket = async () => {
      if (localStorage.getItem("token")) {
        ws = await dispatch(
          connectHistoryTopupWebSocket(localStorage.getItem("token"))
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

  const [infoCard, setInfoCard] = useState({
    telco: " ",
    amount: " ",
    code: "",
    serial: "",
  });

  const { topup, error, isSuccess } = useSelector((state) => state.topup);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfoCard({ ...infoCard, [name]: value });
  };

  useEffect(() => {
    if (!isSuccess && error && isTopup) {
      Swal.fire({
        icon: "error",
        text: error,
      });
      dispatch(reset());
    } else if (isSuccess && isTopup) {
      if (isSuccess) {
        if (topup.status === 99) {
          Swal.fire({
            text: topup.message,
            icon: "success",
          });
          dispatch(reset());
        } else {
          Swal.fire({
            text: topup.message,
            icon: "error",
          });
          dispatch(reset());
        }
      } else {
        Swal.fire({
          icon: "error",
          text: topup.message,
        });
        dispatch(reset());
      }
    }
  }, [isSuccess, error, dispatch, topup, isTopup]);

  const handleTopup = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      Swal.fire({
        text: "Vui lòng đăng nhập để tiếp tục",
        icon: "error",
      });
    } else {
      dispatch(TopUp(localStorage.getItem("token"), infoCard));
      setIsTopup(true);
    }
  };

  const renderMenuItem = (value, label) => (
    <MenuItem key={value} value={value} style={menuItemStyle}>
      {label}
    </MenuItem>
  );

  const renderSelect = (value, name, options, label) => (
    <div className="form-column">
      <label htmlFor={name}>{label}</label>
      <FormControl fullWidth size="small">
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          onChange={(e) => setInfoCard({ ...infoCard, [name]: e.target.value })}
          style={selectStyle}
        >
          {options.map((option) => renderMenuItem(option.value, option.label))}
        </Select>
      </FormControl>
    </div>
  );

  return (
    <React.Fragment>
      <Header />
      <div className="menu-card-wrap">
        <div className="card">
          <div className="card-wrap">
            <span>Nạp tiền bằng thẻ cào</span>
            <form action="" className="form-wrap">
              <div className="form-row">
                {renderSelect(
                  infoCard.telco,
                  "telco",
                  [
                    { value: " ", label: "chọn loại thẻ" },
                    { value: "VIETTEL", label: "Viettel" },
                    { value: "MOBIFONE", label: "mobifone" },
                    { value: "VINAPHONE", label: "vinafone" },
                    { value: "VNMOBI", label: "Vietnammobi" },
                    { value: "ZING", label: "Zing card" },
                  ],
                  "Loại thẻ"
                )}
              </div>
              <div className="form-row">
                {renderSelect(
                  infoCard.amount,
                  "amount",
                  [
                    { value: " ", label: "chọn mệnh giá" },
                    { value: "10000", label: "10.000đ" },
                    { value: "20000", label: "20.000đ" },
                    { value: "30000", label: "30.000đ" },
                    { value: "40000", label: "40.000đ" },
                    { value: "50000", label: "50.000đ" },
                    { value: "100000", label: "100.000đ" },
                    { value: "200000", label: "200.000đ" },
                    { value: "500000", label: "500.000đ" },
                    { value: "1000000", label: "1.00.0000đ" },
                  ],
                  "mệnh Giá"
                )}
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="code">Mã thẻ</label>
                  <TextField
                    id="code"
                    name="code"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Mã Thẻ"
                    onChange={handleChange}
                    InputProps={{
                      style: {
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      },
                      placeholder: "Mã Thẻ",
                      classes: { root: "placeholder" },
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="serial">Serial</label>
                  <TextField
                    id="serial"
                    name="serial"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Số Serial"
                    onChange={handleChange}
                    InputProps={{
                      style: {
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      },
                      placeholder: "Số Seri",
                      classes: { root: "placeholder" },
                    }}
                  />
                </div>
              </div>
              <div className="form-row" onClick={handleTopup}>
                <div className="form-column">
                  <div className="change-form">Nạp thẻ</div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="note1">
          <span>Lưu ý</span>
          <p>1. Nạp tiền thông qua API của THESIEURE sẽ được duyệt tự động.</p>
          <p>2. chọn sai mệnh giá sẽ bị trừ 50% giá trị.</p>
          <p>
            3. Server lỏ có thể xử lý ngay lập tức (quá 3 lần sai thì đợi vài
            tiếng).
          </p>
          <p>4. nạp thẻ quá lâu mà chưa thấy cộng, vui lòng liên hệ admin.</p>
          <p>5. Server update liên tục không cần spam F5(reload) làm gì.</p>
        </div>
      </div>
      <div className="banggia">
        <span>Bảng phí đổi thẻ cào</span>
        <table>
          <thead>
            <tr>
              <th>Nhóm</th>
              <th>10,000đ</th>
              <th>20,000đ</th>
              <th>30,000đ</th>
              <th>50,000đ</th>
              <th>100,000đ</th>
              <th>200,000đ</th>
              <th>500,000đ</th>
              <th>1,000,000đ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VIETTEL</td>
              <td>16.5%</td>
              <td>12.5%</td>
              <td>16.5%</td>
              <td>12%</td>
              <td>12%</td>
              <td>15%</td>
              <td>16%</td>
              <td>19.5%</td>
            </tr>
            <tr>
              <td>MOBIFONE</td>
              <td>19%</td>
              <td>19%</td>
              <td>19%</td>
              <td>17.5%</td>
              <td>16.5%</td>
              <td>16%</td>
              <td>16%</td>
              <td>15.5%</td>
            </tr>
            <tr>
              <td>VINAFONE</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
            </tr>
            <tr>
              <td>ZING</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "24px" }}>
          <label htmlFor="">Lịch sử giao dịch</label>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>số Serial</th>
                <th>Mã thẻ</th>
                <th>loại thẻ</th>
                <th>mệnh giá</th>
                <th>Nhận được</th>
                <th>Thời gian</th>
                <th>trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {!isSuccessH ? (
                <tr>
                  <td colSpan="8">
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
              ) : isSuccessH && topupHistory.length > 0 ? (
                topupHistory.map((data, index) => {
                  let status, color, font;
                  if (parseInt(data.status) === 3) {
                    status = "Thẻ lỗi";
                    color = "#e13e21";
                    font = "#fff";
                  } else if (parseInt(data.status) === 99) {
                    status = "Xin chờ";
                    color = "rgb(250 255 16)";
                    font = "#504000";
                  } else if (parseInt(data.status) === 1) {
                    status = "Thành công";
                    color = "rgb(123 201 0)";
                  }

                  return (
                    <tr key={`row-${index}`}>
                      <td key={`item-${index}-1`}>{index + 1}</td>
                      <td key={`item-${index}-2`}>{data.serial}</td>
                      <td key={`item-${index}-3`}>{data.code}</td>
                      <td key={`item-${index}-3`}>{data.telco}</td>
                      <td key={`item-${index}-4`}>
                        {VND(data.declared_value)}
                      </td>
                      <td key={`item-${index}-5`}>
                        {data.amount ? VND(data.amount) : 0}
                      </td>
                      <td key={`item-${index}-6`}>
                        {convertUtcToUtcPlus7(data.time)}
                      </td>
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
                          {" "}
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

export default Thesieure;

const selectStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};

const menuItemStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};
