import React, { useEffect } from "react";
import "../../assets/styles/footer.scss";
import Fade from "react-reveal/Fade";

function Footer() {
  useEffect(() => {
    const loadParticlesJS = () => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.onload = () => {
        window.particlesJS("snow", {
          particles: {
            number: {
              value: 60,
              density: {
                enable: true,
                value_area: 350,
              },
            },
            color: {
              value: "#fec949",
            },
            opacity: {
              value: 1,
              random: true,
              anim: {
                enable: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
              },
            },
            line_linked: {
              enable: true,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "top",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: true,
                rotateX: 300,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: false,
              },
              onclick: {
                enable: false,
              },
              resize: false,
            },
          },
          retina_detect: true,
        });
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadParticlesJS();
  }, []);

  return (
    <footer>
      <Fade bottom>
        <div id="snow" className="snow"></div>
        <div className="footer-wrap" id="footer-wrap">
          <div className="about-us">
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              về chúng tôi
            </span>{" "}
            <br />{" "}
            <span>
              Dịch vụ giải captcha với mức chi phí siêu rẻ,
              <br /> với công nghệ AI hiện đại có thể giải chính xác hơn 95%.
              <br />
              và cung cấp vps giá rẻ, uy tín, bảo hành.
            </span>
          </div>

          <div className="contact">
            <span style={{ fontSize: 20, fontWeight: "bold" }}>liên hệ</span>
            <br />
            <span>Contact for work: 0969.938.892</span>
            <br />
            {/* <span>Future with GTTeam Technolegy</span> */}
          </div>
        </div>
        <div className="copyright">
          &copy; Copyright 2024 Phát triển bởi
          <span>
            <a href="https://www.facebook.com/ring.dev123/"> Ring</a>
          </span>
          . all right reserved
        </div>{" "}
      </Fade>
    </footer>
  );
}

export default Footer;
