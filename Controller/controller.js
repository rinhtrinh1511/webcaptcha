const pool = require("../config/connect");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Signature } = require("../middleware/hwei");
const { getTime } = require("../utils/time");
const md5 = require("md5");
const { format } = require("date-fns");
require("dotenv").config();
const { formatNum } = require("../utils/formatNum");
const { formatTimeSQL } = require("../utils/formatTimeSQL");
const forge = require("node-forge");
const nodemailer = require("nodemailer");
const sendEmail = require("../config/sendToGmail");
const { promisify } = require("util");
const { createBot } = require("../telegram/telegram");
// CronIP(db);
// createBot(process.env.TOKEN_TELEGRAM, db);
const date = new Date();

const year = date.getFullYear().toString().padStart(4, "0");
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const day = date.getDate().toString().padStart(2, "0");
const hours = date.getHours().toString().padStart(2, "0");
const minutes = date.getMinutes().toString().padStart(2, "0");
const seconds = date.getSeconds().toString().padStart(2, "0");
let milliseconds = date.getMilliseconds().toString();
milliseconds = milliseconds.slice(0, 3).padEnd(3, "0");
let refNo = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
let timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
if (timestamp.length > 16) {
  timestamp = timestamp.slice(0, 16);
} else if (timestamp.length < 16) {
  timestamp = timestamp.padEnd(16, "0");
}

function generateRandomKey() {
  const char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChar = char.charAt(Math.floor(Math.random() * char.length));
  const uuid = uuidv4().replace(/-/g, "");
  return randomChar + uuid.slice(1);
}

exports.login = async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(400).json("Tên đăng nhập và mật khẩu trống");
  }

  try {
    const [rows] = await pool.query("SELECT * FROM account WHERE user = ?", [
      account,
    ]);

    if (rows.length === 0) {
      return res.status(401).json("Tài khoản không tồn tại");
    }

    const user = rows[0];

    const isMatch = await promisify(bcrypt.compare)(password, user.password);

    if (isMatch) {
      if (user.role === 1) {
        const ip =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        if (ip !== user.ip) {
          return res.status(401).json("Không thể đăng nhập từ IP này");
        }
      }

      const payload = {
        key: user.key,
        exp: Math.floor(Date.now()) + 36000000,
      };

      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
      });

      await pool.query("UPDATE account SET sessionID = ? WHERE user = ?", [
        jwtToken,
        account,
      ]);

      return res.status(200).json({
        success: true,
        token: jwtToken,
      });
    } else {
      return res.status(401).json("Thông tin đăng nhập sai");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json("Internal Server Error");
  }
};

function mixCase(str) {
  return str
    .split("")
    .map((char) =>
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");
}

exports.getInfo = async (req, res) => {
  const { key } = req;
  if (!key) {
    return res.status(400).json("Missing key parameter");
  }
  try {
    const [accountRows] = await pool.query(
      "SELECT id, user, usd, created_at, total_deposit, captcha_month, captcha_nro, captcha_mb, email, api_key, sessionID, ip, atm_key, key_mb FROM account WHERE `key`= ?",
      [key]
    );
    if (accountRows.length === 0) {
      return res.status(404).send("No account found");
    }
    const accountInfo = accountRows[0];
    const [keyNroRows] = await pool.query(
      "SELECT id, name, expiration_at, name_tool, key_pc, vip, ban FROM key_nro WHERE own_user = ?",
      [key]
    );
    accountInfo.key_nro = keyNroRows.map((row) => ({ ...row }));
    return res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error fetching information:", error);
    return res.status(500).json("Internal Server Error");
  }
};

const generateRandom4DigitNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

exports.signup = async (req, res) => {
  const key1 = generateRandomKey();
  const key2 = generateRandomKey();
  const key3 = generateRandomKey();
  const atmKey = generateRandom4DigitNumber();

  const { email, account, password, confirmPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send("Email không hợp lệ");
  }

  if (!account || !password) {
    return res.status(400).json("Tên đăng nhập và mật khẩu là bắt buộc");
  }
  if (account.length < 6 || password.length < 6) {
    return res
      .status(400)
      .send("Tài khoản hoặc mật khẩu phải có ít nhất 6 kí tự");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("Mật khẩu không khớp");
  }

  const secret = mixCase(uuidv4().replace(/-/g, "").substr(0, 20));

  try {
    const [rows] = await pool.query(
      "SELECT * FROM account WHERE user = ? OR email = ?",
      [account, email]
    );

    if (rows.length > 0) {
      const existingUser = rows.find((row) => row.user === account);
      const existingEmail = rows.find((row) => row.email === email);

      if (existingEmail) {
        return res.status(400).send("Email đã tồn tại.");
      }
      if (existingUser) {
        return res.status(400).send("Tài khoản đã tồn tại.");
      }
    }

    const [secretRows] = await pool.query(
      "SELECT * FROM account WHERE `key` = ?",
      [secret]
    );

    if (secretRows.length > 0) {
      return res.status(500).send("Secret key đã tồn tại. Vui lòng thử lại.");
    }

    const salt = await promisify(bcrypt.genSalt)(10);
    const hash = await promisify(bcrypt.hash)(password, salt);

    const [atmKeyRows] = await pool.query(
      "SELECT * FROM account WHERE atm_key = ?",
      [atmKey]
    );

    if (atmKeyRows.length > 0) {
      return res.status(400).send("Khóa ATM đã tồn tại.");
    }

    const [result] = await pool.query(
      "INSERT INTO account (`email`, `user`, `password`, `key`, `api_key`, `captcha_month`, `atm_key`, `key_mb`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        account,
        hash,
        secret,
        JSON.stringify([key1, key2]),
        JSON.stringify([getTime().Milliseconds, 0]),
        atmKey,
        key3,
      ]
    );

    if (result.affectedRows === 1) {
      return res.status(200).send("Đăng ký tài khoản thành công.");
    } else {
      return res.status(500).send("Failed to register user");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.getCaptchaNro = async (req, res) => {
  try {
    const [row] = await pool.query(`SELECT * FROM captcha_nro`);
    res.status(200).send(row);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

exports.getCaptchaMB = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM captcha_mb`);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

exports.getCaptchaNroCombo = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM captcha_combo`);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

exports.getCaptchaCount = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM captcha_count`);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

exports.getTools = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM tools`);
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

exports.SolveCaptcha = async (req, res) => {
  const key_api = req.params.key;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { image } = req.body;

  if (!image) {
    return res.send("cảm ơn bạn đã sử dụng dịch vụ.");
  }

  const data = {
    base64: image,
  };
  const params = new URLSearchParams();
  for (const key in data) {
    params.append(key, data[key]);
  }

  try {
    const response = await axios.post("server giai captcha", params);

    if (response.data.success) {
      console.log("solve captcha thành công");

      const [acb] = await pool.query(
        "SELECT api_key FROM account WHERE JSON_CONTAINS(api_key, ?)",
        [JSON.stringify(key_api)]
      );
      if (acb.length > 0 && JSON.parse(acb[0].api_key)[0] === key_api) {
        await pool.query(
          "UPDATE account SET ip = JSON_ARRAY_APPEND(ip, '$', ?) WHERE JSON_CONTAINS(api_key, ?) AND NOT JSON_CONTAINS(ip, ?)",
          [ip, JSON.stringify(key_api), JSON.stringify(ip)]
        );
      }
      await pool.query("UPDATE captcha_count SET count = count + 1");
      const [result] = await pool.query(
        "SELECT captcha_nro, api_key FROM account WHERE JSON_CONTAINS(api_key, ?)",
        [JSON.stringify(key_api)]
      );
      if (result.length > 0) {
        const api = JSON.parse(result[0].api_key);
        if (key_api === api[1]) {
          await pool.query(
            "UPDATE account SET captcha_nro = captcha_nro - 1 WHERE JSON_CONTAINS(api_key, ?)",
            [JSON.stringify(key_api)]
          );
          console.log("cập nhật thành công");
        }
      }
    }
    return res.send(response.data);
  } catch (error) {
    console.error("Error processing captcha:", error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.SolveCaptchaMB = async (req, res) => {
  const key_api = req.params.key;
  const { base64 } = req.body;
  try {
    const response = await axios.post("server giai captcha", { base64 });
    if (response.data.ok) {
      const [result] = await pool.query(
        "UPDATE account SET captcha_mb = captcha_mb - 1 WHERE key_mb = ? ",
        [key_api]
      );
      if (result.affectedRows === 0) {
        return res.status(400).send("Update failed: No matching record found.");
      }
      const [updateCount] = await pool.query(
        "UPDATE captcha_count SET count = count + 1"
      );
      if (updateCount.affectedRows === 0) {
        return res.status(400).send("Update failed: No matching record found.");
      }
    }
    return res.status(200).send(response.data);
  } catch (error) {
    throw error;
  }
};

exports.ChangeKeyNro = (req, res) => {
  const { oldKey, newKey, id } = req.body;
  if (!newKey) {
    return;
  }
  if (!oldKey) {
    query = query =
      "UPDATE key_nro SET key_pc = ? WHERE own_user = ? AND key_pc = '' NULL AND id = ?";
    queryParams = [newKey, req.key, id];
  } else {
    query =
      "UPDATE key_nro SET key_pc = ? WHERE own_user = ? AND key_pc = ? AND id = ?";
    queryParams = [newKey, req.key, oldKey, id];
  }
  db.query(query, queryParams, (err) => {
    if (err) throw err;
    return res.send("Thay đổi Key thành công");
  });
};

exports.ChangeKeyMB = (req, res) => {
  const { key } = req.body;
  const newKey = generateRandomKey();
  db.query(
    "SELECT key_mb FROM account WHERE `key_mb` = ?",
    [key],
    (err, reslut) => {
      if (err) throw err;
      db.query(
        "UPDATE account SET `key_mb` = ? WHERE  `key_mb` = ?",
        [newKey, key],
        (errUpdate) => {
          if (errUpdate) throw errUpdate;
          console.log("đổi key thành công");
          res.status(200).send("đổi key thành công");
        }
      );
    }
  );
};

exports.getItem = async (req, res) => {
  const { id, category } = req.body;
  try {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [
      category,
      id,
    ]);
    return res.status(200).send(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.payment = async (req, res) => {
  const { numCaptcha, type, priceForOne, nameTool, paymentType } = req.body;
  if (numCaptcha === 0) {
    switch (type) {
      case "captcha_nro":
        return res
          .status(422)
          .send({ ok: false, message: "số lượng captcha phải lớn hơn 0" });
      case "captcha_month":
        return res
          .status(422)
          .send({ ok: false, message: "số tháng phải lớn hơn 0" });
      case "captcha_mb":
        return res
          .status(422)
          .send({ ok: false, message: "số tháng phải lớn hơn 0" });
    }
  }
  const totalPrice = numCaptcha * priceForOne;

  let finalPrice;
  let finalPriceMB;
  let adjustedPrice = 15;
  let priceMB = 10;
  if (type === "captcha_nro") {
    if (totalPrice >= 200000) {
      adjustedPrice = 5;
    } else if (totalPrice >= 100000) {
      adjustedPrice = 8;
    } else if (totalPrice >= 50000) {
      adjustedPrice = 12;
    }
    finalPrice = numCaptcha * adjustedPrice;
  } else if (type === "captcha_mb") {
    if (totalPrice >= 40000) {
      priceMB = 5;
    } else if (totalPrice >= 20000) {
      priceMB = 7;
    } else if (totalPrice >= 10000) {
      priceMB = 8;
    }
    finalPriceMB = numCaptcha * priceMB;
  } else if (type === "tools") {
    const [payment] = await pool.query(
      `SELECT user, usd FROM account WHERE \`key\` = ?`,
      [req.key]
    );
    if (payment[0].usd < priceForOne) {
      return res.status(400).send(`${priceForOne - payment[0].usd}`);
    } else {
      const newUsd = payment[0].usd - priceForOne;
      let query;
      let queryParams;
      if (paymentType === "leftime") {
        query =
          "INSERT INTO key_nro (name, ban, own_user, name_tool, vip) VALUES (?, ?, ?, ?, ?)";
        queryParams = [payment[0].user, 0, req.key, nameTool, 1];
      } else {
        query =
          "INSERT INTO key_nro (name, ban, own_user, name_tool, expiration_at) VALUES (?, ?, ?, ?, ?)";
        let expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        queryParams = [payment[0].user, 0, req.key, nameTool, expirationDate];
      }
      const [addHistory] = await pool.query(query, queryParams);
      if (addHistory.affectedRows === 0) {
        return res.status(400).send("Update failed: No matching record found.");
      } else {
        const [updateUsd] = await pool.query(
          "UPDATE account SET `usd` = ? WHERE `key` = ? ",
          [newUsd, req.key]
        );
        if (updateUsd.affectedRows === 0) {
          return res
            .status(400)
            .send("Update failed: No matching record found.");
        } else {
          return res.status(200).send(`Payment successful`);
        }
      }
    }
  }
  const [result] = await pool.query(
    `SELECT ${type}, usd FROM account WHERE \`key\` = ?`,
    [req.key]
  );
  if (!result[0]) {
    return res.status(400).send("NotFound.");
  }
  if (
    result[0].usd < (finalPrice || priceForOne * numCaptcha || finalPriceMB)
  ) {
    return res
      .status(400)
      .send(`${(finalPrice || priceForOne * numCaptcha) - result[0].usd}`);
  } else {
    const newUsd = result[0].usd - (finalPrice || priceForOne || finalPriceMB);
    switch (type) {
      case "captcha_nro":
        const [result1] = await pool.query(
          `UPDATE account SET ${type} = ?, usd = ? WHERE \`key\` = ?`,
          [result[0].captcha_nro + numCaptcha, newUsd, req.key]
        );
        if (result1.affectedRows === 0) {
          return res.status(400).send("NotFound.");
        } else {
          const [addHistory] = await pool.query(
            `INSERT INTO history (type, key_user, telegram) VALUES (?, ?, ?)`,
            [JSON.stringify(["Captcha Theo lượt", numCaptcha]), req.key, 0]
          );
          if (addHistory.affectedRows === 0) {
            return res.status(400).send("NotFound.");
          } else {
            return res.status(200).send("Payment successful");
          }
        }
      case "captcha_month":
        const data = JSON.parse(result[0].captcha_month);
        let timestampBefor;
        if (data[0] === 0) {
          timestampBefor = getTime().Milliseconds;
        } else {
          timestampBefor = data[0];
        }
        let timestamp = new Date(timestampBefor);
        let numPC;
        if (numCaptcha === 1) {
          timestamp.setMonth(timestamp.getMonth() + 1);
        } else if (numCaptcha === 2) {
          timestamp.setMonth(timestamp.getMonth() + 2);
        } else if (numCaptcha === 3) {
          timestamp.setMonth(timestamp.getMonth() + 3);
        } else if (numCaptcha > 3) {
          return res.status(400).send({
            ok: false,
            message: "Vui lòng liên hệ ADM nếu bạn muốn mua hơn 3 tháng",
          });
        }
        let milliseconds = timestamp.getTime();
        if (priceForOne === 50000) {
          numPC = 1;
        } else if (priceForOne === 100000) {
          numPC = 2;
        } else if (priceForOne === 150000) {
          numPC = 3;
        } else if (priceForOne === 200000) {
          numPC = 10;
        }
        const [updateAccout] = await pool.query(
          `UPDATE account SET ${type} =  ?, usd = ?  WHERE \`key\` = ?`,
          [JSON.stringify([milliseconds, numPC]), newUsd, req.key]
        );
        if (updateAccout.affectedRows === 0) {
          return res.status(400).send("NotFound.");
        } else {
          const [updateHistory] = await pool.query(
            `INSERT INTO history (type, key_user, telegram) VALUES (?, ?, ?)`,
            [
              JSON.stringify([
                `Captcha tháng ${formatNum(priceForOne) + "đ"}`,
                numCaptcha,
              ]),
              req.key,
              0,
            ]
          );
          if (updateHistory.affectedRows === 0) {
            return res.status(400).send("NotFound.");
          } else {
            return res.status(200).send("Payment successful");
          }
        }
      case "captcha_mb":
        const [updateAccount] = await pool.query(
          `UPDATE account SET ${type} = ?, usd = ? WHERE \`key\` = ?`,
          [result[0].captcha_mb + numCaptcha, newUsd, req.key]
        );
        if (updateAccount.affectedRows === 0) {
          return res.status(400).send("NotFound.");
        } else {
          const [updateHistory] = await pool.query(
            `INSERT INTO history (type, key_user, telegram) VALUES (?, ?, ?)`,
            [JSON.stringify(["Captcha MB Theo lượt", numCaptcha]), req.key, 0]
          );
          if (updateHistory.affectedRows === 0) {
            return res.status(400).send("NotFound.");
          } else {
            return res.status(200).send("Payment successful");
          }
        }
    }
  }
};

let session = "";

exports.getHistoryMBBank = async (req, res) => {
  const taikhoanmb = "0969938892";
  const deviceIdCommon = `25t8r7t2-mbib-0000-0000-${timestamp}`;
  const sotaikhoanmb = "0969938892";

  const date1 = new Date();

  const date2 = new Date(date1);
  date2.setDate(date1.getDate() - 7);

  const url =
    "https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history";

  try {
    if (!session) {
      session = await AutoGetSession1();
    }
    const data = {
      accountNo: sotaikhoanmb,
      fromDate: date2.toLocaleDateString("en-GB"),
      toDate: date1.toLocaleDateString("en-GB"),
      deviceIdCommon,
      refNo: `0969938892-${timestamp}`,
      sessionId: session,
    };
    const response = await axios.post(url, data, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization:
          "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
        Connection: "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        Cookie:
          "_fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; _ga=GA1.3.68244822.1710940936; _gat_gtag_UA_205372863_2=1; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712484408.0.0.0; JSESSIONID=C65A10BDF744173539CC81C228B90598",
        Deviceid: `25t8r7t2-mbib-0000-0000-${timestamp}`,
        Origin: "https://online.mbbank.com.vn",
        RefNo: `0969938892-${timestamp}`,
        Referer:
          "https://online.mbbank.com.vn/information-account/source-account",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
        "X-Request-Id": `0969938892-${timestamp}`,
        "elastic-apm-traceparent":
          "00-7bf5bd066dbadcfddff171ea6afa3427-794160bc61610395-01",
        "sec-ch-ua":
          '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    });
    const historyMB = response.data;
    console.log(historyMB);
    if (historyMB.result.ok) {
      updateHistoryMBank(historyMB.transactionHistoryList);
    } else {
      session = "";
    }

    res.send({
      timestamp,
      session,
      historyMB: historyMB.transactionHistoryList,
    });
  } catch (error) {
    session = "";
    console.log("session hêt hạn chờ tí");
  }
};

const AutoGetSession1 = async () => {
  try {
    const captchaResponse = await axios.post(
      "https://online.mbbank.com.vn/api/retail-web-internetbankingms/getCaptchaImage",
      {
        refNo: timestamp,
        deviceIdCommon: `25t8r7t2-mbib-0000-0000-${timestamp}`,
        sessionId: "",
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Authorization:
            "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
          Connection: "keep-alive",
          "Content-Type": "application/json; charset=UTF-8",
          Cookie:
            "MBAnalyticsaaaaaaaaaaaaaaaa_session_=JOMJBHNMHBAEMJMDKDFIEIHBFLPOFFCOBAKMJGIPMBPPFLFNOCAKFODGAHFNAIGGJIJDKDFCPBEGIBBJLELANGODIHABCDEGDOLMEDMAELPKGEKFGFLLEPCFGICGBJEK; _fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; JSESSIONID=6A5EEA17D3721332B0ECF12E843E4517; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712484832.0.0.0; _ga=GA1.3.68244822.1710940936; _gat_gtag_UA_205372863_2=1",
          Deviceid: `25t8r7t2-mbib-0000-0000-${timestamp}`,
          Origin: "https://online.mbbank.com.vn",
          RefNo: timestamp,
          Referer: "https://online.mbbank.com.vn/pl/login?logout=1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
          "X-Request-Id": timestamp,
          "elastic-apm-traceparent":
            "00-579aaeeaf63ef71e9dab992a5ada9e83-85851031adeee639-01",
          "sec-ch-ua":
            '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
        },
      }
    );

    const base64 = captchaResponse.data.imageString;
    const captchaData = await axios.post("http://103.69.86.12", { base64 });
    const captcha = captchaData.data.captcha;
    console.log(captcha);
    if (captcha) {
      const requestData = {
        userId: "0969938892",
        password: "6fc30e0ee1a0aa8a7464f137e0fa3067",
        captcha: captcha,
        ibAuthen2faString: "69835bd3a528aab3e1bf6d440ed433be",
        sessionId: null,
        refNo: `d7965ec4454b82a0cf4bdf456e528cb1-${timestamp}`,
        deviceIdCommon: `25t8r7t2-mbib-0000-0000-${timestamp}`,
      };

      const loginResponse = await axios.post(
        "https://online.mbbank.com.vn/api/retail_web/internetbanking/v2.0/doLogin",
        requestData,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            Authorization:
              "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
            "Content-Type": "application/json; charset=UTF-8",
            Cookie:
              "MBAnalyticsaaaaaaaaaaaaaaaa_session_=HMDIOFLBOHEOEDGLMKGKEIJLGNPBNIJLONLNDELNOONIKCFEGCBADDCLEBPBFACBKMJDMJAKMELDEJCDFHBAADFHLHIIPFLFMMCPANMOLJGFLLJMFLEIPGEDIEFOEHLF; MBAnalyticsaaaaaaaaaaaaaaaa_session_=HIPGJIGFJPFAEOJOICIPDNKMGKFIIFNJMEPKEAMKOCAPKGNNPOJOJBAHIDFMANEIELKDIDICDPABBKHBDAAANGAEPGNPNOCNPEBEENODAOCKEANAHNKBOKIHONEOLJGL; _fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712486932.0.0.0; _ga=GA1.3.68244822.1710940936; JSESSIONID=AB0476A5E3ECA2FE9875CA99D16A82D3",
            Origin: "https://online.mbbank.com.vn",
            Referer: "https://online.mbbank.com.vn/pl/login?logout=1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
            "X-Request-Id": `d7965ec4454b82a0cf4bdf456e528cb1-${timestamp}`,
            "elastic-apm-traceparent":
              "00-6dd53eeae86a606a5f9c7f6c23b8cefd-115c8e047eae29c3-01",
            "sec-ch-ua":
              '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
          },
        }
      );
      session = loginResponse.data.sessionId;
    }
  } catch (e) {
    console.error("Error:", e);
  }

  return session;
};

const updateHistoryMBank = async (historyMB) => {
  try {
    for (let transaction of historyMB) {
      const description = transaction.description;
      const match = description.match(/[^ ]*Nap[^ ]*/i);

      if (match) {
        const atmKey = match[0].slice(3);

        try {
          await updateCreditAmount(transaction.pos, atmKey);

          const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM transactions WHERE pos = ?",
            [transaction.pos]
          );

          const count = rows[0].count;
          if (count === 0) {
            await pool.query(
              `INSERT INTO transactions 
              (postingDate, transactionDate, accountNo, creditAmount, debitAmount, currency, description, addDescription, availableBalance, beneficiaryAccount, refNo, benAccountName, bankName, benAccountNo, dueDate, docId, transactionType, pos, tracingType, atm_key, isTelegram, isSuccess) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                formatTimeSQL(transaction.postingDate),
                formatTimeSQL(transaction.transactionDate),
                transaction.accountNo,
                transaction.creditAmount,
                transaction.debitAmount,
                transaction.currency,
                transaction.description,
                transaction.addDescription,
                transaction.availableBalance,
                transaction.beneficiaryAccount,
                transaction.refNo,
                transaction.benAccountName,
                transaction.bankName,
                transaction.benAccountNo,
                formatTimeSQL(transaction.dueDate),
                transaction.docId,
                transaction.transactionType,
                transaction.pos,
                transaction.tracingType,
                atmKey,
                0,
                0,
              ]
            );
          }
        } catch (error) {
          console.error("Có lỗi xảy ra trong quá trình cập nhật:", error);
        }
      }
    }
  } catch (error) {
    console.error("Có lỗi xảy ra khi kết nối với cơ sở dữ liệu:", error);
  }
};

const updateCreditAmount = async (pos, atmKey) => {
  try {
    const [creditAmountResults] = await pool.query(
      "SELECT creditAmount FROM transactions WHERE pos = ? AND isSuccess = 0",
      [pos]
    );

    if (creditAmountResults.length === 0) {
      return;
    }

    for (let creditAmountRow of creditAmountResults) {
      const [dataUsd] = await pool.query(
        "SELECT usd FROM account WHERE atm_key = ?",
        [atmKey]
      );

      if (!dataUsd[0]) {
        continue;
      }

      const newUsdValue = dataUsd[0].usd + creditAmountRow.creditAmount;

      await pool.query("UPDATE account SET usd = ? WHERE atm_key = ?", [
        newUsdValue,
        atmKey,
      ]);

      await pool.query("UPDATE transactions SET isSuccess = 1 WHERE pos = ?", [
        pos,
      ]);
    }

    console.log("Tất cả các cập nhật đã hoàn thành");
  } catch (err) {
    console.error("Error updating credit amount:", err);
    throw err;
  }
};

exports.topUpTheSieuRe = async (req, res) => {
  const { telco, code, serial, amount } = req.body;
  const key_id = req.key;
  const request_id =
    Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111;

  if (!telco || !code || !serial || !amount) {
    return res.status(401).send("vui lòng nhập đầy đủ thông tin");
  }
  if (/^D/.test(serial)) {
    return res.status(401).send("Seri của bạn phải là số 100% và không có chữ");
  }
  if (/^D/.test(code)) {
    return res
      .status(401)
      .send("Mã thẻ của bạn phải là số 100% và không có chữ");
  }

  const partner_key = "684323a9d5782e0e5c34e6c6a8703bab";
  const partner_id = "69371830711";

  const url = `https://thesieure.com/chargingws/v2?sign=${md5(
    partner_key + code + serial
  )}&telco=${telco}&code=${code}&serial=${serial}&amount=${amount}&request_id=${request_id}&partner_id=${partner_id}&command=charging`;
  const url_check = `https://thesieure.com/chargingws/v2?sign=${md5(
    partner_key + code + serial
  )}&telco=${telco}&code=${code}&serial=${serial}&amount=${amount}&request_id=${request_id}&partner_id=${partner_id}&command=check`;
  const currentdate = new Date();
  const formattedDate = format(currentdate, "yyyy-MM-dd HH:mm:ss");

  try {
    const response = await axios.post(url);

    if (response.data.status === 99) {
      const queryToup = `
        INSERT INTO topup (code, serial, time, status, declared_value, telco, \`key\`, telegram)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        code,
        serial,
        formattedDate,
        response.data.status,
        amount,
        telco,
        key_id,
        1,
      ];

      await pool.query(queryToup, values);

      const checkStatus = async () => {
        try {
          const response1 = await axios.post(url_check);
          if (response1.data.status === 3 || response1.data.status === 1) {
            clearInterval(intervalId);

            let updateStatusQuery = `UPDATE topup SET status = ?, amount = ? WHERE code = ? AND serial = ?`;
            const updateValues = [
              response1.data.status,
              response1.data.amount,
              code,
              serial,
            ];
            if (response1.data.status === 1) {
              updateStatusQuery = `UPDATE topup SET status = ?, amount = ?, telegram = 0 WHERE code = ? AND serial = ?`;
            }

            await pool.query(updateStatusQuery, updateValues);

            const [userResult] = await pool.query(
              "SELECT usd FROM account WHERE `key` = ?",
              [key_id]
            );
            const currentUserUSD = userResult[0].usd;
            const newUSD = currentUserUSD + response1.data.amount;

            await pool.query("UPDATE account SET `usd` = ? WHERE `key` = ?", [
              newUSD,
              key_id,
            ]);
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái:", error);
        }
      };

      const intervalId = setInterval(checkStatus, 1000);
    } else {
      console.log("lỗi: ", response.data.status);
    }

    return res.json(response.data);
  } catch (error) {
    console.error("Error in topUpTheSieuRe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

///// check key nro//////
const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtVpQiVU1UeOXOBlv2NE4obkhddAxkBEweTCvs3rkBGxvbwFq
J9/+JOgczTx5QiBcwuMiOJwKuC98PkTHGtla9oQ7GcyLK4cQQO3O39juurQjEp/4
p5H98rBbmb+Y27DYDyYZFNB4XqFRmXR62ZViz1caBGcBpxM+cRvswMoi3FAZguE8
C+ha0qQ0/whZYijgD921/+cmrvQOMhk/Q36NUWJnpLnCbxJGFB/tumM+OYW/evLe
YjG2fvsivh1sHdZWU35JympJeCZrNc8XKpqTl5shsTvcLZy1vyPzsKWKfxIujOGR
fIiYFNr/FCg0e+rWeZpM2cZHRsxeGKuf8bXX3QIDAQABAoIBAB589TqtUEY40pic
ECVdgR2RI9qsWlS7yxAouvUbxR8oQrChBoF3IwD946+uSb1v9uBNsphdRWETHJpU
UjvFjEkS0GPFMyVpcrZTtHqF/BZ3x8ivC6zSOqT0+KVXpGFUsPIVB9TrujzAdpkr
j6aqOl8cp9NTJOA7eD0oQmxj3yn15e1ohw6vl/k9YaDuO6kmD+1h96HNlBA6VpHE
wH86cv4bqjtglRYWIEpgEb1GnEzFYdM9sxzGBxiGxd9mPv0qAJ+CKS8LWEYp2O+f
t7k/9NUizmyc9c/yuj24tY6o0U7NKBl7jZtlQmZ5+1Vw9TsdMIVZUVsibZ8ltnPf
MBKbfbkCgYEA18K5xHf03wIpddczPoV/abSmlXHJocJaiuUFVOb1HCzTXn9uOwO7
IlYGBU4DJl5gQ3ymVuZqwWf9OO7QxqIem3+yFnJ+BY2JUVgWL3S3plkPjodopwEt
+gXwszwc+mDhca6+EbSwtMneo6xRC7gViAGxPXueQVr4Ou588UQNclUCgYEA1yzS
EpY6/3yLqj4Q4xap3f+T+Y3oOICR2ZghunxY4AyPEwUJh7epx1GPoeKAP734aVyU
xV8FM6k50Ou7ExAOtEfSb0wVeioru+jHV/L0wIalj+Oa4yHQKPiL4cTU3kRR+mK1
pYz63hC4aPcVr+NHNVO1NLJBZtPq6szI+imrJ2kCgYBqEI6z12hoDK8G//BwBr5Y
33aYtqQxQdKyvtz9HMBXxm1t4eT1W+MtgO5awzvnK7PU2T0IMSM/ynf/+d5mFyJG
vOJ2CHiNEEP12gCl+ZGiU9vC7Cv1FS5d33exFJcGOoP5F7bWC2ZmqWoqObZptWfY
QUS4/cERTcADcGO5UwPtNQKBgQDNMafPI8Z1Vy7VFUUDWdx5oL1bMRFvuGPdzi7z
6JrUZgWWjKou612Tftrq9NV6c83NpAUXRurt/gXtjq8imaB8GTW6/yJIEqkMFArt
evoeEwkVc2aEDP215Hd4wDyDDUHj9XflvNCLLgS9zEq5JZMFbqMR8p9d0N9oNAvA
TDY0aQKBgQCgC4sXlaUzhLlf1cqdl2cRT7M2zK2gW6Sn8MGKgYIhYNwWouYxSB90
ZIOLjnPauN16XouCYpCNeiHIZ1mg1bxF4zgytEpdwhDVC/s3A+y/zaKivucFrnpv
TnW/40v3PixKIBB+yG8vtMxibvu/W8uz1bt/wqDDxd1Z90tngL2tcw==
-----END RSA PRIVATE KEY-----`;

exports.AcitveTool = async (req, res) => {
  const { encryptData } = req.body;
  const key_params = req.key_req;
  const vip = req.vip;

  try {
    const encrypt = decryptRSA(encryptData, privateKeyPem);
    if (encrypt != key_params) {
      await pool.query("UPDATE key_nro SET ban = ? WHERE key_pc = ?", [
        1,
        key_params,
      ]);
    } else {
      db.query(
        "SELECT own_user, expiration_at FROM key_nro WHERE key_pc = ?",
        [key_params],
        (err, data) => {
          if (err) throw err;
          const expirationUTC = new Date(data[0].expiration_at);

          const expirationUTC7 = new Date(
            expirationUTC.getTime() + 7 * 60 * 60 * 1000
          );

          const currentTime = new Date(Date.now() + 7 * 60 * 60 * 1000);
          const date1 = new Date(expirationUTC7);
          const date2 = new Date(currentTime);

          const timeDiff = date1 - date2;

          const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hoursDiff = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          db.query(
            "SELECT user FROM account WHERE `key` = ?",
            [data[0].own_user],
            (errU, dataU) => {
              if (errU) throw errU;
              res.send({
                ok: true,
                message: dataU[0].user,
                exp: { daysDiff, hoursDiff },
                vip: vip ? vip : 0,
              });
            }
          );
        }
      );
    }
  } catch (error) {
    await pool.query("UPDATE key_nro SET ban = ? WHERE key_pc = ?", [
      1,
      key_params,
    ]);
    return res.send({ ok: false, message: "niệm" });
  }
};

function decryptRSA(encryptedText, privateKeyPem) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedText);
  const decryptedBytes = privateKey.decrypt(encryptedBytes, "RSA-OAEP");
  return forge.util.decodeUtf8(decryptedBytes);
}

///forgot pass word
exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const data = await createPasswordResetToken(email);
    await sendEmail(email, data.user, data.resetToken);
    return res.status(200).send({
      ok: true,
      message: `Chúng tôi đã gửi 1 Email đến ${email} vui lòng check ở thư mục spam or rác.`,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Có lỗi xảy ra trong quá trình xử lý yêu cầu." });
  }
};

const createPasswordResetToken = async (email) => {
  try {
    const [addToken] = await pool.query(
      "SELECT email, user FROM account WHERE email = ?",
      [email]
    );
    if (addToken.length === 0) {
      return { ok: false, message: "Email: " + email + " Không tồn tại" };
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000;

    await pool.query(
      "UPDATE account SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?",
      [resetToken, resetTokenExpire, email]
    );

    return { resetToken, user: addToken[0].user };
  } catch (error) {
    console.error("Error creating password reset token:", error);
    throw error;
  }
};

exports.RePassword = async (req, res) => {
  const { password, confirmpassword, token } = req.body;
  if (!password || !confirmpassword) {
    return res.status(400).send("Không được để trống 1 trong 2 mục này");
  }
  if (password != confirmpassword) {
    return res.status(400).send("xác nhận mật khẩu không khớp.");
  }
  if (!token) {
    return;
  }
  if (password.length < 6 || confirmpassword.length < 6) {
    return res
      .status(400)
      .send("Tài khoản hoặc mật khẩu phải có ít nhất 6 kí tự");
  }

  try {
    const [getInfo] = await pool.query(
      "SELECT * FROM account WHERE resetPasswordToken = ?",
      [token]
    );
    if (getInfo.length === 0) {
      return res.status(400).send("Hmm...");
    }
    if (getInfo[0].resetPasswordExpire < Date.now()) {
      return res.status(400).send("Token hết hạn vui lòng quên mật khẩu lại.");
    }
    const salt = await promisify(bcrypt.genSalt)(10);
    const hash = await promisify(bcrypt.hash)(password, salt);
    await pool.query(
      "UPDATE account SET password = ?, resetPasswordToken = ?,  resetPasswordExpire = ?",
      [hash, null, null]
    );
    return res.status(200).send("Thay đổi mật khẩu thành công");
  } catch (error) {
    return res.send(error);
  }
};

exports.thankyou = (req, res) => {
  return res.status(200).send("Cảm ơn bạn đã sử dụng dịch vụ.");
};
