import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../../assets/styles/detail.scss";
import { useDispatch, useSelector } from "react-redux";
import { Payment, getDetail } from "../../redux/APi/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faSnowflake,
} from "@fortawesome/fontawesome-free-regular";
import { reset } from "../../redux/Slice/payment";
import { calculateTimeDifference, formatNumber } from "../formatNumber";
import Swal from "sweetalert2";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { faNfcDirectional } from "@fortawesome/free-brands-svg-icons";
import DetailImg from "../../assets/images/detail.png";
import { resetD } from "../../redux/Slice/getDetail";
import Loadding from "../Loading/loading";
import tools from "../../assets/images/toolDetail.jpg";
import VND from "../vnd";

function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const category = state.category;
  const dataRef = useRef({ id, category });
  const { detail, isLoadings } = useSelector((state) => state.detail);
  const { info } = useSelector((state) => state.info);
  const { isLoading } = useSelector((state) => state.payment);
  const [paymentType, setPaymentType] = useState("monthly");
  const [count, setCount] = useState(1);
  const dataPost = dataRef.current;
  const [dataPay, setDataPay] = useState({
    numCaptcha: 1,
    type: "",
    priceForOne: 0,
    numConnect: 0,
    nameTool: "",
    paymentType: "",
  });
  const totalPrice = count * detail.price;

  let adjustedPrice = 15;
  let priceMB = 10;

  if (detail.nro === 0) {
    if (totalPrice >= 200000) {
      adjustedPrice = 5;
    } else if (totalPrice >= 100000) {
      adjustedPrice = 8;
    } else if (totalPrice >= 50000) {
      adjustedPrice = 12;
    }
  } else if (detail.mb === 2) {
    if (totalPrice >= 40000) {
      priceMB = 5;
    } else if (totalPrice >= 20000) {
      priceMB = 7;
    } else if (totalPrice >= 10000) {
      priceMB = 8;
    }
  }

  const handleRadioChange = (event) => {
    if (event.target.value === "monthly") {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "tools",
        priceForOne: detail.price,
        nameTool: detail.name,
        paymentType: event.target.value,
      }));
    } else {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "tools",
        priceForOne: detail.priceM,
        nameTool: detail.name,
        paymentType: event.target.value,
      }));
    }
    setPaymentType(event.target.value);
  };

  useEffect(() => {
    dispatch(resetD());
  }, [dispatch]);

  const finalPrice = count * adjustedPrice;
  const finalPriceMB = count * priceMB;
  const { payment, isSuccess, error } = useSelector((state) => state.payment);

  const [checkPay, setCheckPay] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    dataRef.current = { id, category };
  }, [id, category]);

  useEffect(() => {
    dispatch(getDetail(dataPost));
  }, [dispatch, dataPost]);

  useEffect(() => {
    if (!isSuccess && checkPay && error) {
      Swal.fire({
        icon: "error",
        text:
          dataPay.type === "captcha_nro" ||
          dataPay.type === "captcha_mb" ||
          dataPay.type === "tools"
            ? dataPay.numCaptcha > 0
              ? `Còn thiếu ${error}đ`
              : `${error.message}`
            : dataPay.type === "captcha_month"
            ? dataPay.numCaptcha > 3
              ? info.usd < finalPrice || finalPriceMB
                ? `Còn thiếu ${formatNumber(error)}đ`
                : `${error.message}`
              : dataPay.numCaptcha > 0
              ? `Còn thiếu ${formatNumber(error)}đ`
              : `${error.message}`
            : `Còn thiếu ${formatNumber(error)}đ`,
        timer: 5000,
      });
      setCheckPay(false);
      dispatch(reset());
    } else if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: payment,
        showConfirmButton: false,
        timer: 1000,
      });
      dispatch(reset());
      setCheckPay(false);
      setTimeout(() => {
        navigator("/control");
      }, 1000);
    }
  }, [
    isSuccess,
    error,
    checkPay,
    payment,
    navigator,
    dispatch,
    dataPay.numCaptcha,
    dataPay.type,
    dataPay.price,
    info.usd,
    finalPrice,
    finalPriceMB,
  ]);

  const [captchaMonth, setCaptchaMonth] = useState([]);
  const diffDays = calculateTimeDifference(captchaMonth[0]);

  useEffect(() => {
    if (info.length !== 0) {
      setCaptchaMonth(JSON.parse(info.captcha_month));
    }
  }, [info]);
  useEffect(() => {
    if (detail.nro === 0) {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "captcha_nro",
        priceForOne: detail.price,
      }));
    } else if (detail.month_nro === 1) {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "captcha_month",
        priceForOne: detail.price,
        numConnect: 0,
      }));
    } else if (detail.mb === 2) {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "captcha_mb",
        priceForOne: detail.price,
      }));
    } else if (detail.name && paymentType === "lifetime") {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "tools",
        priceForOne: detail.price,
        nameTool: detail.name,
        paymentType,
      }));
    } else if (detail.name && paymentType === "monthly") {
      setDataPay((prevDataPay) => ({
        ...prevDataPay,
        type: "tools",
        priceForOne: detail.priceM,
        nameTool: detail.name,
        paymentType,
      }));
    }
  }, [detail, paymentType]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        let type =
          detail.nro === 0
            ? "captcha_nro"
            : detail.month_nro === 1
            ? "captcha_month"
            : detail.mb === 2
            ? "captcha_mb"
            : "tools";
        setDataPay((prevDataPay) => ({
          ...prevDataPay,
          numCaptcha: newCount,
          type,
        }));
        return newCount;
      });
    } else if (e.key === "ArrowDown") {
      setCount((prevCount) => {
        const newCount = Math.max(0, prevCount - 1);

        let type =
          detail.nro === 0
            ? "captcha_nro"
            : detail.month_nro === 1
            ? "captcha_month"
            : detail.mb === 2
            ? "captcha_mb"
            : "tools";
        setDataPay((prevDataPay) => ({
          ...prevDataPay,
          numCaptcha: newCount,
          type,
        }));
        return newCount;
      });
    }
  };

  const handlePayment = async () => {
    if (!localStorage.getItem("token")) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập để tiếp tục",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    setCheckPay(true);
    await dispatch(Payment(localStorage.getItem("token"), dataPay));
  };

  const handleChange = (e) => {
    const newCount = Math.max(0, parseInt(e.target.value, 10) || 0);
    setCount(newCount);

    let type =
      detail.nro === 0
        ? "captcha_nro"
        : detail.month_nro === 1
        ? "captcha_month"
        : detail.mb === 2
        ? "captcha_mb"
        : "tools";

    setDataPay((prevDataPay) => ({
      ...prevDataPay,
      numCaptcha: newCount,
      type,
    }));
  };
  return (
    <>
      <Header /> {isLoading && <Loadding />}
      <div id="detal-wrap" className="detal-wrap">
        <div className="menu-detail">
          {detail.nro === 0 || detail.month_nro === 1 || detail.mb === 2
            ? !isLoadings && <img src={DetailImg} alt="img" id="img_media" />
            : !isLoadings && <img src={tools} alt="img" id="img_media" />}

          <div className="info-captcha" id="info-captcha">
            <div className="title-detail" id="title-detail">
              <FontAwesomeIcon icon={faSnowflake} className="snow-spin" />{" "}
              {detail.nro === 0 || detail.month_nro === 1
                ? "API CAPTCHA NRO"
                : detail.mb === 2
                ? "API CAPTCHA MBbank"
                : "Tool Ngọc rồng Online"}
            </div>
            <div className="title-category">
              Danh mục:{" "}
              {detail.nro === 0
                ? "Captcha theo lượt"
                : detail.month_nro === 1
                ? "Captcha theo tháng"
                : detail.mb === 2
                ? "Captcha MBbank"
                : detail.name}
            </div>
            {(detail.nro === 0 || detail.mb === 2) && (
              <div className="price-captcha-detail">
                Giá: {VND(detail.price)}/lượt cho đơn hàng dưới {detail.title}đ
                <br />
                <span style={{ color: "#01ad00" }}>
                  <FontAwesomeIcon icon={faBolt} bounce /> Hệ thống sẽ tự quy
                  đổi nếu giá tiền nếu hơn {detail.title}đ
                </span>
              </div>
            )}
            {detail.month_nro === 1 && (
              <div className="price-captcha-detail">
                Giá: {formatNumber(detail.price)}đ/tháng
              </div>
            )}
            <div className="description-captcha" id="description-captcha">
              {detail.nro === 0 || detail.month_nro === 1 ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} beat /> dùng được cho
                  mod thứ 3 nếu được hỗ trợ.
                  <br />
                  <FontAwesomeIcon icon={faCheckCircle} beatFade /> Giải captcha
                  tự động chỉ tính lượt giải đúng.
                  <br />
                  <FontAwesomeIcon icon={faCheckCircle} bounce /> Một số tool DP
                  mới hỗ trợ, test trước khi mua (free 1 lượt test)
                  <br />
                  <FontAwesomeIcon icon={faNfcDirectional} shake /> Bạn có thể
                  tự thêm vào dự án của mình xem chi tiết tại đây
                </>
              ) : detail.mb === 2 ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} beat /> Công nghệ OCR
                  giải chính xác đến 99%.
                  <br />
                  <FontAwesomeIcon icon={faCheckCircle} beatFade /> Giải captcha
                  tự động chỉ tính lượt giải đúng.
                  <br />
                  <FontAwesomeIcon icon={faCheckCircle} bounce /> Test trước khi
                  mua (free 1 lượt test)
                  <br />
                  <FontAwesomeIcon icon={faNfcDirectional} shake /> Bạn có thể
                  tự thêm vào dự án của mình xem chi tiết tại đây
                </>
              ) : (
                detail.description &&
                JSON.parse(detail.description).map((data, index) => (
                  <div key={index}>
                    <FontAwesomeIcon icon={faCheckCircle} beat /> {data}
                  </div>
                ))
              )}
            </div>
            <div className="price-captcha">
              {detail.nro === 0 && (
                <div className="for-month">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#24b102",
                    }}
                  >
                    số lượt còn lại của bạn:{" "}
                    <span style={{ color: "#db2626" }}>
                      {formatNumber(info.captcha_nro)
                        ? formatNumber(info.captcha_nro)
                        : 0}{" "}
                      lượt{" "}
                    </span>
                    | Số dư:{" "}
                    <span style={{ color: "#db2626" }}>
                      {info.usd ? VND(info.usd) : VND(0)}
                    </span>
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    mua theo lượt
                  </span>
                  <input
                    type="number"
                    value={count}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                  />
                  <span
                    style={{
                      marginRight: 12,
                      fontWeight: 600,
                      color: "#ff720a",
                    }}
                  >
                    Giá:{" "}
                    {formatNumber(finalPrice) ? formatNumber(finalPrice) : 0}đ
                  </span>
                  <button onClick={handlePayment}>Thanh Toán</button>
                </div>
              )}
              {detail.month_nro === 1 && (
                <div className="for-month">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#24b102",
                    }}
                  >
                    số ngày còn lại của bạn:{" "}
                    <span style={{ color: "red" }}>
                      {diffDays.days ? diffDays.days : 0} ngày,{" "}
                      {diffDays.hours ? diffDays.hours : 0} giờ{" "}
                    </span>
                    | Số dư:{" "}
                    <span style={{ color: "#db2626" }}>
                      {info.usd ? VND(info.usd) : VND(0)}
                    </span>
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    mua theo tháng
                  </span>
                  <input
                    type="number"
                    value={count}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                  />

                  <span
                    style={{
                      marginRight: 12,
                      fontWeight: 600,
                      color: "#ff720a",
                    }}
                  >
                    Giá: {VND(detail.price) ? VND(detail.price) : 0}
                  </span>
                  <button onClick={handlePayment}>Thanh Toán</button>
                </div>
              )}
              {detail.mb === 2 && (
                <div className="for-month">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#24b102",
                    }}
                  >
                    số lượt còn lại của bạn:{" "}
                    <span style={{ color: "#db2626" }}>
                      {formatNumber(info.captcha_mb)
                        ? formatNumber(info.captcha_mb)
                        : 0}{" "}
                      lượt{" "}
                    </span>
                    | Số dư:{" "}
                    <span style={{ color: "#db2626" }}>
                      {info.usd ? VND(info.usd) : VND(0)}
                    </span>
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    mua theo tháng
                  </span>
                  <input
                    type="number"
                    value={count}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                  />

                  <span
                    style={{
                      marginRight: 12,
                      fontWeight: 600,
                      color: "#ff720a",
                    }}
                  >
                    Giá: {VND(detail.price) ? VND(detail.price) : 0}
                  </span>
                  <button onClick={handlePayment}>Thanh Toán</button>
                </div>
              )}
              {detail.name && (
                <div className="for-month">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#24b102",
                    }}
                  >
                    Số dư còn lại của bạn:{" "}
                    <span style={{ color: "#db2626" }}>
                      {info.usd ? VND(info.usd) : VND(0)}
                    </span>
                  </span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>
                      <input
                        type="radio"
                        value="monthly"
                        checked={paymentType === "monthly"}
                        onChange={handleRadioChange}
                        style={{ width: "12px" }}
                      />
                      Mua theo tháng:{" "}
                      <span style={{ color: "#db2626", fontWeight: 600 }}>
                        {VND(detail.priceM) ? VND(detail.priceM) : 0}
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="lifetime"
                        checked={paymentType === "lifetime"}
                        onChange={handleRadioChange}
                        style={{ width: "12px" }}
                      />
                      Mua vĩnh viễn Giá:{" "}
                      <span style={{ color: "#db2626", fontWeight: 600 }}>
                        {VND(detail.price) ? VND(detail.price) : 0}
                      </span>
                    </label>
                  </div>
                  <button onClick={handlePayment}>Thanh Toán</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
//SpinToSuccess
export default Detail;
