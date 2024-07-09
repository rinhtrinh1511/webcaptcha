const { getTime } = require("../utils/time");
const { Signature } = require("../middleware/hwei");

const checkWebSocketKey = (token) => {
  try {
    if (!token) {
      throw new Error("Không có token");
    }
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload) {
      throw new Error("Token không hợp lệ");
    }
    const header = Buffer.from(encodedHeader, "base64").toString("utf8");
    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const { key, exp } = JSON.parse(payload);
    if (!(signature === Signature(encodedHeader, encodedPayload))) {
      throw new Error("Chữ ký của token không hợp lệ");
    }
    if (exp < getTime().Milliseconds) {
      throw new Error("Token đã hết hạn");
    }
    return key;
  } catch (error) {
    console.error("Lỗi xác thực token:", error.message);
    throw error;
  }
};

module.exports = checkWebSocketKey;
