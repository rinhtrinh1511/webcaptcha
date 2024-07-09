import React, { useState, useEffect } from "react";
import "../../assets/styles/toTop.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="back-to-top">
      {isVisible && (
        <div onClick={scrollToTop} className="back-to-top-button">
          <FontAwesomeIcon icon={faCircleUp} size="2x" />
        </div>
      )}
    </div>
  );
};

export default BackToTop;
