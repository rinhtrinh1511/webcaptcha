const { getTime, getCurrentMillisecondsUTC7 } = require("../utils/time");
const pool = require("../config/connect");
const socketIo = require("socket.io");

const checkKeyNro = async (req, res, next) => {
  const currentTime = getTime().Milliseconds;
  const key = req.params.key;

  if (!key) {
    return res.status(400).json({ ok: false, message: "Key không tồn tại." });
  }

  try {
    const [result] = await pool.query(
      "SELECT * FROM account WHERE JSON_CONTAINS(api_key, ?)",
      [JSON.stringify(key)]
    );

    if (result.length === 0) {
      return res.status(404).json({ ok: false, message: "Là Lá La, ..." });
    }

    const row = result[0];
    const keyApi = JSON.parse(row.api_key);

    if (keyApi[0] === key) {
      const [timestamp, numConnections] = JSON.parse(row.captcha_month);
      if (timestamp < currentTime) {
        return res.status(403).send({ ok: false, message: "Hết hạn" });
      }
      const ipConnect = JSON.parse(row.ip);
      console.log(ipConnect.length);
      console.log(numConnections);
      if (numConnections === 0) {
        return res.status(403).send({
          ok: false,
          message: "Có nhiều IP truy cập cùng 1 lúc",
        });
      }
      const checking = numConnections >= ipConnect.length;
      if (!checking) {
        return res.status(403).send({
          ok: false,
          message: "Có nhiều IP truy cập cùng 1 lúc",
        });
      }
      next();
    } else {
      if (row.captcha_nro === 0) {
        return res.status(403).send({ count: row.captcha_nro });
      } else {
        next();
      }
    }
  } catch (err) {
    console.error("Error in checkKeyNro middleware:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const checkMB = async (req, res, next) => {
  const key = req.params.key;
  if (!key) {
    return res.status(400).json({ ok: false, message: "key khong ton tai." });
  }
  try {
    const [result] = await pool.query(
      "SELECT * FROM account WHERE key_mb = ?",
      [key]
    );
    if (result.length === 0) {
      return res.status(404).json({ ok: false, message: "Là Lá La, ..." });
    }
    if (result[0].captcha_mb <= 0) {
      return res.status(404).json({ ok: false, message: "Là Lá La, ..." });
    } else {
      next();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
};

const checkKeyTool = (req, res, next) => {
  const key = req.params.key;
  req.key_req = key;
  if (!key) {
    return res.status(400).json({ ok: false, message: "key khong ton tai." });
  }
  db.query("SELECT * FROM key_nro WHERE key_pc = ? ", [key], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ ok: false, message: "Là Lá La, ..." });
    } else {
      const exp = result[0].expiration_at;
      const currentMilliseconds = getCurrentMillisecondsUTC7();
      if (result[0].ban === 1) {
        return res.send({
          ok: false,
          message:
            "Key của bạn đã bị khóa vui lòng liên hệ admin để được hỗ trợ",
        });
      } else if (result[0].vip === 1) {
        req.vip = 1;
        next();
      } else if (exp < currentMilliseconds) {
        return res.send({
          ok: false,
          message: `Hết hạn vui lòng liên hệ admin\nHoặc truy cập https://iCaptch.online để được gia hạn`,
        });
      } else {
        next();
      }
    }
  });
};

module.exports = { checkKeyNro, checkMB, checkKeyTool };
