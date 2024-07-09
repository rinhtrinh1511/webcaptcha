const { getTime } = require("../utils/time");
const { Signature } = require("./hwei");

const authMiddleware = async (req, res, next) => {
  try {
    const route = req.path;
    const toolPathRegex = /^\/view\/\d+$/;
    const vpsPathRegex = /^\/vps\/\d+$/;
    if (
      route === "/login" ||
      route === "/signup" ||
      route === "/captchacount" ||
      route === "/captcha" ||
      route === "/captchacombo" ||
      route === "/getitem" ||
      route === "/captchamb" ||
      route === "/tools" ||
      toolPathRegex.test(route) ||
      vpsPathRegex.test(route)
    ) {
      return next();
    } else if (route === "/mbbank") {
      const token = req.headers.authorization?.slice(7);
      if (token === "rinhdz") {
        return res
          .status(400)
          .send({ ok: false, message: "Không có quyền truy cập vào" });
      } else {
        return next();
      }
    }
    const token = req.headers.authorization?.slice(7);
    if (!token) {
      return res.status(403).json({
        ok: false,
        message: "Không có quyền truy cập1",
      });
    }
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload) {
      throw new Error("Token không hợp lệq");
    }
    const header = Buffer.from(encodedHeader, "base64").toString("utf8");
    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const { key, exp } = JSON.parse(payload);
    req.key = key;
    if (!(signature === Signature(encodedHeader, encodedPayload))) {
      return res.status(403).send({
        ok: false,
        message: "Token không hợp lệ",
      });
    }
    if (exp < getTime().Milliseconds) {
      return res.status(403).send({
        ok: false,
        message: "Token đã hết hạn",
      });
    }
    next();
  } catch (error) {
    console.error(error, "ád");
    res.status(500).send({
      ok: false,
      message: "Lỗi xác thực",
    });
  }
};

module.exports = authMiddleware;
