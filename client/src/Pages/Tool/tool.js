import React, { useEffect, useState, useRef } from "react";
import "../../assets/styles/tools.scss";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getTools } from "../../redux/APi/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNodeJs } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function Tool() {
  const dispatch = useDispatch();
  const { Tools } = useSelector((state) => state.getData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    getTools(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 2000);

    return () => clearInterval(interval);
  });

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === Tools.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Tools.length - 1 : prev - 1));
  };

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <React.Fragment>
      <Header />
      <div className="main-wrap">
        <div className="allTool-title">
          <div className="aTool-container-title">
            <div className="box-allTool">
              <h1>
                <FontAwesomeIcon icon={faNodeJs} /> Danh Mục Tool
              </h1>
            </div>
            <div className="allTool-gradient-border"></div>
          </div>
        </div>
        <div className="box-product-tool">
          <div className="slideshow-wrapper" ref={slideRef}>
            {Tools.map((item, index) => {
              const priceFormatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price);
              return (
                <div
                  className="box-slider"
                  key={index}
                  style={{
                    transform: `translateX(-${
                      currentSlide * (width <= 492 ? 100 : 50)
                    }%)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  <div className="slider-tool">
                    <img
                      loading="lazy"
                      src={
                        "https://i.ytimg.com/vi/yfHpn8YX9LQ/maxresdefault.jpg"
                      }
                      alt="logo"
                    />
                    <div className="name-tool">{item.name}</div>
                    <div className="price">Giá {priceFormatted}</div>
                    <div className="price-count">Số lượt mua: {item.count}</div>
                    <Link to={`/view/${item.id}`} state={{ category: "tools" }}>
                      <div className="view-tool">Quất luôn</div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div onClick={handlePrevSlide} className="prev-slide">
          <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
        </div>
        <div onClick={handleNextSlide} className="next-slide">
          <FontAwesomeIcon icon={faChevronRight} size="2xl" />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Tool;
