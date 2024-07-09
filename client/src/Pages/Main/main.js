import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import "../../assets/styles/main.scss";
import { Link } from "react-router-dom";
import captchaNro from "../../assets/images/captcha_nro.png";
import Fade from "react-reveal/Fade";
import Slide from "react-reveal/Slide";
import MB from "../../assets/images/mb.webp";
import vps from "../../assets/images/vps-logo.png";
import bidv from "../../assets/images/bidv.webp";
import ctt from "../../assets/images/ctt.png";
import tool from "../../assets/images/tool.jpg";

function HomePage() {
  return (
    <>
      <Header />
      <Fade>
        <div className="wrap-home-page">
          <div className="captcha-home">
            <span>Dịch vụ CAPTCHA</span>
            <div className="service-all">
              <Slide left>
                <div className="home-service nro">
                  <img src={captchaNro} alt="" style={{ width: "100%" }} />
                  <p style={{ fontWeight: "600" }}>captcha nro</p>
                  <p>
                    Với công nghệ AI
                    <br />
                    giải chính xác lên đến 95%
                  </p>
                  <Link to="/captcha-nro" className="button-24" role="button">
                    Xem Chi Tiết
                  </Link>
                </div>
              </Slide>
              <Fade bottom>
                <div className="home-service mb">
                  <img
                    src={MB}
                    alt=""
                    style={{
                      width: "99.7%",
                      height: 170,
                    }}
                  />
                  <p style={{ fontWeight: "600" }}>captcha MBbank</p>
                  <p>
                    Với công nghệ AI <br />
                    giải chính xác lên đến 99%
                  </p>
                  <Link
                    to="/captcha-mbbank"
                    className="button-24"
                    role="button"
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
              </Fade>
              <Fade bottom>
                <div className="home-service mb">
                  <img
                    src={bidv}
                    alt=""
                    style={{
                      width: "100%",
                      height: 170,
                    }}
                  />
                  <p style={{ fontWeight: "600" }}>captcha BIDV</p>
                  <p>
                    Với công nghệ AI <br />
                    giải chính xác lên đến 99%
                  </p>
                  <Link to="/" className="button-24" role="button">
                    Coming soon
                  </Link>
                </div>
              </Fade>
              <Fade bottom>
                <div className="home-service mb">
                  <img
                    src={ctt}
                    alt=""
                    style={{
                      width: "100%",
                      height: 170,
                    }}
                  />
                  <p style={{ fontWeight: "600" }}>Cổng thanh toán</p>
                  <p>
                    Tích hợp cổng thanh toán <br />
                    vào website
                  </p>
                  <Link to="/" className="button-24" role="button">
                    Coming soon
                  </Link>
                </div>
              </Fade>
            </div>
          </div>
          <div className="captcha-home">
            <span>Dịch vụ Server Cloud</span>
            <div className="service-all">
              <Fade bottom>
                <div className="home-service nro">
                  <img
                    src={tool}
                    alt=""
                    style={{ width: "100%", height: 170 }}
                  />

                  <p style={{ fontWeight: "600" }}>Tool nro</p>
                  <p>
                    Danh mục tool NRO
                    <br />
                    Treo game không lo mất kết nối
                  </p>

                  <Link to="/tools" className="button-24" role="button">
                    Xem Chi Tiết
                  </Link>
                </div>
              </Fade>
              <Fade bottom>
                <div className="home-service mb">
                  <img
                    src={vps}
                    alt=""
                    style={{ width: "100%", height: 168 }}
                  />
                  <p style={{ fontWeight: "600" }}>Máy chủ VPS</p>
                  <p>
                    Cung cấp dịch vụ server <br /> Treo game, Hosting,...
                  </p>
                  <a
                    className="button-24"
                    role="button"
                    href="https://icloudviet.com"
                  >
                    Xem Chi Tiết
                  </a>
                </div>
              </Fade>
              <Fade bottom>
                <div className="home-service nro">
                  <img
                    src={tool}
                    alt=""
                    style={{ width: "100%", height: 170 }}
                  />

                  <p style={{ fontWeight: "600" }}>Tool nro</p>
                  <p>
                    Danh mục tool NRO
                    <br />
                    Treo game không lo mất kết nối
                  </p>

                  <Link to="/tools" className="button-24" role="button">
                    Xem Chi Tiết
                  </Link>
                </div>
              </Fade>
              <Fade bottom>
                <div className="home-service mb">
                  <img
                    src={vps}
                    alt=""
                    style={{ width: "100%", height: 168 }}
                  />
                  <p style={{ fontWeight: "600" }}>Máy chủ VPS</p>
                  <p>
                    Cung cấp dịch vụ server <br /> Treo game, Hosting,...
                  </p>
                  <a
                    className="button-24"
                    role="button"
                    href="https://icloudviet.com"
                  >
                    Xem Chi Tiết
                  </a>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      </Fade>
      <Footer />
    </>
  );
}

export default HomePage;
