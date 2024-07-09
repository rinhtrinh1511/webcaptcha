const crypto = require("crypto");
require("dotenv").config();

const Signature = (encodedHeader, encodedPayload) => {
  const hmac = crypto.createHmac("sha256", process.env.JWT_SECRET);
  const signature = hmac
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return signature;
};
module.exports = { Signature };
