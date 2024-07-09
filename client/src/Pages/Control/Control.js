import React, { useEffect, useRef, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import "../../assets/styles/control.scss";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTimeDifference,
  formatNumber,
} from "../../Components/formatNumber";
import Button from "@mui/material/Button";
import { ChangeKeyNro } from "../../redux/APi/api";

function Control() {
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const [captchaMonth, setCaptchaMonth] = useState([]);
  const [api, setApi] = useState([]);
  const [ip, setIP] = useState([]);
  const { info } = useSelector((state) => state.info);
  const diffDays = calculateTimeDifference(captchaMonth[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (info.length !== 0) {
      setApi(JSON.parse(info.api_key));
      setCaptchaMonth(JSON.parse(info.captcha_month));
      setIP(JSON.parse(info.ip));
    }
  }, [info]);

  const handleExtend = (data) => {
    Swal.fire({
      title: "Bạn Có Muốn Gia Hạn Thêm?",
      icon: "question",
      iconHtml: "؟",
      text: "*lưu ý gia hạn mặc định là 1 tháng",
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    });
  };

  const handleChange = (data) => {
    Swal.fire({
      title: "Nhập License Mà Bạn Muốn Đổi",
      input: "text",
      inputLabel: "Key License Của Bạn",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "hãy nhập môt key nào đó hoặc không...";
        }
      },
    }).then(async (result) => {
      const keyData = {
        oldKey: data.key_pc,
        newKey: result.value,
        id: data.id,
      };
      if (result.isConfirmed) {
        await dispatch(ChangeKeyNro(localStorage.getItem("token"), keyData))
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: data.data,
              showConfirmButton: false,
              timer: 1000,
            });
            setTimeout(() => {
              window.location.href = "/control";
            }, 1500);
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: err,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      } else if (result.isDismissed) {
        console.log("User cancelled or dismissed the dialog");
      }
    });
  };

  const handleDownload = (data) => {
    const fileUrl = "URL_CỦA_TỆP";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "TÊN_TỆP");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopy = (inputRef) => {
    const copyText = inputRef.current.value;

    const tempInput = document.createElement("input");
    tempInput.value = copyText;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");

    document.body.removeChild(tempInput);

    Swal.fire({
      icon: "success",
      title: "Copied to clipboard!",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  return (
    <>
      <Header />
      <div className="control-wrap">
        <div className="menu-control-wrap">
          <div className="token-api">
            <div className="title-control">
              <span className="title-api">API Captcha NRO</span>
            </div>
            <div className="control-text" id="control-text">
              {captchaMonth ? (
                <span>
                  HSD:&nbsp;
                  <span style={{ color: "red" }}>
                    {diffDays.days ? diffDays.days : 0} ngày,{" "}
                    {diffDays.hours ? diffDays.hours : 0} giờ
                  </span>
                  &nbsp;| số máy kết nối: &nbsp;
                  <span style={{ color: "red" }}>
                    {ip.length}/{captchaMonth[1] ? captchaMonth[1] : 0}
                  </span>{" "}
                  &nbsp; | Trạng thái: &nbsp;
                  <span style={{ color: "red" }}>Dùng theo tháng</span> &nbsp;
                </span>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: 24,
              }}
            >
              <input
                id="input_hiden"
                type="text"
                value={`http://icaptcha.online/SolveCaptcha/${
                  api[0] ? api[0] : "DoanXemLaGiNao"
                }`}
                ref={inputRef1}
                disabled
              />
              <button onClick={() => handleCopy(inputRef1)}>Copy API</button>
            </div>

            <div className="control-text" id="control-text">
              <span>
                HSD:&nbsp;<span style={{ color: "red" }}>Không giới hạn</span>{" "}
                &nbsp;| số lượt còn lại: &nbsp;
                <span style={{ color: "red" }}>
                  {info.captcha_nro === 0
                    ? 0
                    : info.captcha_nro
                    ? formatNumber(info.captcha_nro)
                    : 0}
                </span>
                &nbsp; | Trạng thái: &nbsp;
                <span style={{ color: "red" }}>Dùng theo lượt</span> &nbsp;
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: 24,
                marginBottom: 24,
              }}
            >
              <input
                id="input_hiden"
                type="text"
                value={`http://icaptcha.online/SolveCaptcha/${
                  api[1] ? api[1] : "DoanXemLaGiNao"
                }`}
                disabled
                ref={inputRef2}
              />
              <button onClick={() => handleCopy(inputRef2)}>Copy API</button>
            </div>
            <div className="title-control">
              <span className="title-api">API Captcha MBbank</span>
            </div>
            <div className="control-text" id="control-text">
              <span>
                HSD:&nbsp;<span style={{ color: "red" }}>Không giới hạn</span>{" "}
                &nbsp;| số lượt còn lại: &nbsp;
                <span style={{ color: "red" }}>
                  {info.captcha_mb ? info.captcha_mb : 0}
                </span>
                &nbsp; | Trạng thái: &nbsp;
                <span style={{ color: "red" }}>Dùng theo lượt</span> &nbsp;
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: 24,
                marginBottom: 24,
              }}
            >
              <input
                id="input_hiden"
                type="text"
                value={`https://icaptcha.online/SolveCaptchaMB/${
                  info.key_mb ? info.key_mb : "DoanXemLaGiNao"
                }`}
                disabled
                ref={inputRef3}
              />
              <button onClick={() => handleCopy(inputRef3)}>Copy API</button>
            </div>
          </div>
          <div className="token-api" id="token-api">
            <div className="title-control">
              <span className="title-api">thông tin Tool nro</span>
            </div>
            <div className="table-container" id="table-container">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>key License</th>
                    <th>HSD còn</th>
                    <th>Trạng thái</th>
                    <th>hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {info?.key_nro?.map((data, index) => {
                    let exp;
                    let days;
                    let hours;
                    if (data.vip) {
                      exp = "unlimited";
                    } else {
                      const targetDate = new Date(data.expiration_at);
                      const now = new Date();
                      //  const utc7Offset = 7 * 60 * 60 * 1000;
                      const nowUtc7 = new Date(now.getTime());
                      const timeDifference = targetDate - nowUtc7;
                      days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                      hours = Math.floor(
                        (timeDifference % (1000 * 60 * 60 * 24)) /
                          (1000 * 60 * 60)
                      );
                      // const minutes = Math.floor(
                      //   (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                      // );
                      // const seconds = Math.floor(
                      //   (timeDifference % (1000 * 60)) / 1000
                      // );
                    }
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td id="key_license">{data.name_tool}</td>
                        <td style={{ color: "green" }} id="key_license">
                          {data.key_pc ? data.key_pc : "chưa kích hoạt"}{" "}
                        </td>
                        <td style={{ color: "red" }}>
                          {data.vip
                            ? exp
                            : days < 0 && hours < 0
                            ? "Expires"
                            : days + "d " + hours + "h"}
                        </td>
                        <td style={{ color: "red" }}>
                          {data.ban ? "Ban" : "Active"}
                        </td>
                        <td id="actions">
                          <Button onClick={() => handleExtend(data)}>
                            Gia hạn
                          </Button>
                          <Button onClick={() => handleChange(data)}>
                            Đổi key
                          </Button>{" "}
                          <Button onClick={() => handleDownload(data)}>
                            tải tool
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Control;
