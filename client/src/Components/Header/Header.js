import React, { useEffect, useState } from "react";
import "../../assets/styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowRightFromBracket,
  faBars,
  faCreditCard,
  faDice,
  faDiceD6,
  faGear,
  faHandHoldingDollar,
  faHome,
  faUser,
  faUserPlus,
  faVirusCovid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPaypal,
  faConnectdevelop,
  faBitcoin,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInfo } from "../../redux/APi/api";
import { reset } from "../../redux/Slice/getInfo";
import BackToTop from "../BackToTop/BackToTop";
import Swal from "sweetalert2";
import { resetH } from "../../redux/Slice/wsTopup";
import Fade from "react-reveal/Fade";
import VND from "../vnd";

function Header() {
  const [rotate, setRotate] = useState(false);
  const [drop, setDrop] = useState(false);
  const dispatch = useDispatch();
  const { info, error, isSuccess } = useSelector((state) => state.info);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [shownAlert, setShownAlert] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (token) {
      dispatch(getInfo(token));
    }
  }, [dispatch, token]);

  const checkLogin = localStorage.getItem("__s");

  const handleHover = () => {
    setRotate(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("__s");
    localStorage.removeItem("token");
    dispatch(reset());
    dispatch(resetH());
    navigate("/login");
  };

  const handleMouseLeave = () => {
    setRotate(false);
  };

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDropItem = () => {
    setDrop((prevDrop) => !prevDrop);
  };

  useEffect(() => {
    if (!shownAlert && !isSuccess && error) {
      setShownAlert(true);
      Swal.fire({
        title: "Vui lòng đăng nhập lại",
        icon: "warning",
        text: error?.message,
        iconHtml: "؟",
        confirmButtonText: "ok",
        timer: 5000,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token");
          localStorage.removeItem("__s");
          dispatch(reset());
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  }, [error, dispatch, isSuccess, shownAlert]);
  return (
    <header>
      <BackToTop />

      <div className={`header-container ${scrolled ? "scrolled" : ""}`}>
        <div className="header-wrap">
          <Fade left>
            <div className="logo">
              <Link to={"/"}>
                <img src={logo} alt="" />
              </Link>
            </div>
          </Fade>
          <Fade top>
            <div className="action" id="action">
              <ul className="right-header">
                <Link to={"/"}>
                  <li className="menu-item-has-children">
                    <FontAwesomeIcon icon={faHome} pull="left" />
                    Trang chủ
                  </li>
                </Link>
                <li
                  className="menu-item-has-children"
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon icon={faHandHoldingDollar} pull="left" />
                  nạp tiền
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    pull="right"
                    className={rotate ? "abx rotate" : "abx"}
                  />
                  <ul className="dropdown">
                    <Link to={"/atm"} state={{ atmKey: info.atm_key }}>
                      <li className="content-dropdown">
                        <FontAwesomeIcon icon={faCreditCard} pull="left" />
                        <span>Ngân hàng</span>
                      </li>
                    </Link>
                    <Link to={"/card"}>
                      <li className="content-dropdown">
                        <FontAwesomeIcon icon={faDiceD6} pull="left" />
                        <span>Thẻ cào</span>
                      </li>
                    </Link>
                    <li className="content-dropdown">
                      <FontAwesomeIcon icon={faPaypal} pull="left" />
                      <span>PayPal</span>
                    </li>
                  </ul>
                </li>
                <li
                  className="menu-item-has-children"
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon
                    icon={faGear}
                    pull="left"
                    className={rotate ? "abx rotate" : "abx"}
                  />
                  Hướng dẫn
                </li>
                {checkLogin ? (
                  <>
                    <Link to={"/control"}>
                      <li
                        className="menu-item-has-children"
                        onMouseEnter={handleHover}
                        onMouseLeave={handleMouseLeave}
                      >
                        <FontAwesomeIcon
                          icon={faConnectdevelop}
                          pull="left"
                          className={rotate ? "abx rotate" : "abx"}
                        />
                        bảng điều khiển
                      </li>
                    </Link>
                    <li
                      className="menu-item-has-children"
                      onMouseEnter={handleHover}
                      onMouseLeave={handleMouseLeave}
                    >
                      <FontAwesomeIcon
                        icon={faDice}
                        pull="left"
                        className={rotate ? "abx rotate" : "abx"}
                      />
                      Tài khoản
                      <ul className="dropdown profile">
                        <li
                          className="content-dropdown"
                          style={{ paddingTop: 8 }}
                        >
                          <FontAwesomeIcon icon={faBitcoin} pull="left" />
                          <span>SD: {info.usd ? VND(info.usd) : 0 + "đ"}</span>
                        </li>
                        <Link to={"/"}>
                          <li className="content-dropdown">
                            <FontAwesomeIcon icon={faVirusCovid} pull="left" />
                            <span>thông tin</span>
                          </li>
                        </Link>
                        <li
                          className="content-dropdown"
                          style={{ paddingTop: 8 }}
                          onClick={handleLogOut}
                        >
                          <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            pull="left"
                          />
                          <span>Đăng xuất</span>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <Link to={"/login"}>
                      <li className="menu-item-has-children login">
                        <FontAwesomeIcon icon={faUser} pull="left" />
                        Đăng nhập
                      </li>
                    </Link>
                    <Link to={"/signup"}>
                      <li className="menu-item-has-children resgister">
                        <FontAwesomeIcon icon={faUserPlus} pull="left" /> Đăng
                        ký
                      </li>
                    </Link>
                  </>
                )}
              </ul>
            </div>
            <div className="action-hiden" id="action-hiden">
              <FontAwesomeIcon
                icon={faBars}
                cursor={"pointer"}
                size="2x"
                onClick={handleDropItem}
                className="icon-hiden"
              />
              {drop && (
                <div className="drop-acction-hiden">
                  <ul>
                    <Link to={"/control"}>
                      <li className="item-hiden">Bảng điều khiển</li>
                    </Link>
                    <Link to={"/atm"} state={{ atmKey: info.atm_key }}>
                      <li className="item-hiden">Nạp tiền</li>
                    </Link>
                    {localStorage.getItem("token") ? (
                      <li className="item-hiden" onClick={handleLogOut}>
                        Đăng xuất
                      </li>
                    ) : (
                      <Link to={"/login"}>
                        <li className="item-hiden">Đăng Nhập</li>
                      </Link>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </Fade>
        </div>
      </div>
    </header>
  );
}
export default Header;
