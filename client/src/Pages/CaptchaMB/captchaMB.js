import React, { useEffect } from "react";
import "../../assets/styles/captchanro.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/fontawesome-free-regular";
import { useDispatch, useSelector } from "react-redux";
import { fetchCount, getCaptchaMB } from "../../redux/APi/api";
import Skeleton from "@mui/material/Skeleton";
import { connectWebSocket } from "../../redux/Slice/websocket";
import { formatNumber } from "../../Components/formatNumber";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Mb from "../../assets/images/mb.webp";

function CaptchaMB() {
  // CaptchaNro, isSuccess, error
  const { isLoading, CaptchaMB } = useSelector((state) => state.getData);
  const dispatch = useDispatch();
  const { count } = useSelector((state) => state.websocket);

  useEffect(() => {
    const ws = dispatch(connectWebSocket());
    return () => {
      ws.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const getData = async () => {
      await fetchCount(dispatch);
      await getCaptchaMB(dispatch);
    };
    getData();
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="content">
        <div className="content-wrap">
          <div className="info-captcha">
            <span id="capt_month">
              Captcha đã giải trong tháng: {formatNumber(count)}
            </span>
          </div>
          <div className="menu-item-captcha">
            <span className="title-cpt" id="title-cpt">
              Dịch vụ captcha theo Lượt
            </span>
            <div className="menu-item-list">
              <ul className="item-list">
                {isLoading &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <li key={index} className="item-has-clildren">
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={164}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={6}
                        width={"70%"}
                        sx={{
                          marginTop: 2,
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: 4,
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={6}
                        width={"70%"}
                        sx={{
                          marginTop: 2,
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: 4,
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={6}
                        width={"70%"}
                        sx={{
                          marginTop: 2,
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: 4,
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={6}
                        width={"70%"}
                        sx={{
                          marginTop: 2,
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: 4,
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={6}
                        width={"70%"}
                        sx={{
                          marginTop: 2,
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: 4,
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={48}
                        width={"72%"}
                        sx={{
                          borderRadius: 2,
                          marginTop: 6,
                          marginLeft: "auto",
                          marginRight: "auto",
                          marginBottom: 4,
                        }}
                      />
                    </li>
                  ))}
                {!isLoading &&
                  CaptchaMB.map((item, index) => (
                    <li
                      className="item-has-clildren"
                      id="item-has-clildren"
                      key={index}
                    >
                      <div className="item-info">
                        <img src={Mb} alt="img" />
                        <span style={{ fontSize: 16 }}>
                          gói captcha MB {item.title}đ
                        </span>
                        <br />
                        <span style={{ color: "green" }}>
                          Giá: {formatNumber(item.price)}đ/1 Lượt
                        </span>
                        <br />
                        <span>
                          <FontAwesomeIcon icon={faCheckCircle} /> Tiết kiệm
                          thời gian
                        </span>
                        <br />
                        <span>
                          <FontAwesomeIcon icon={faCheckCircle} /> Giải siêu tốc
                        </span>
                        <br />
                        <span>
                          <FontAwesomeIcon icon={faCheckCircle} /> Hỗ trợ 24/7
                        </span>
                        <Link
                          to={`/view/${item.id}`}
                          state={{ category: "captcha_mb" }}
                        >
                          <div className="item-view">
                            <div className="view-detail">
                              <span>xem chi tiết</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CaptchaMB;
