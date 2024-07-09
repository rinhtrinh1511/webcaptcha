const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const { getTime, timeTodate } = require("../utils/time");
const { formatNum } = require("../utils/formatNum");

const currentDate = new Date();
const currentDateTimeString = `Date: ${currentDate.getDate()}/${
  currentDate.getMonth() + 1
}/${currentDate.getFullYear()} at: ${currentDate.getHours()}:${currentDate.getMinutes()}`;

const url =
  "https://api.telegram.org/bot6996032309:AAHjhuQGsRfnEMIuyu7mglEYvuzL-A7IAog/sendMessage";

const createBot = (token, pool) => {
  const bot = new TelegramBot(token, { polling: true });

  // bot.on("message", (msg) => {
  //   const chatId = msg.chat.id;
  //   bot.sendMessage(chatId, `Chat ID của bạn là: ${chatId}`);
  // });

  async function sendMessageToTelegram() {
    const [sendData] = await pool.query(
      "SELECT * FROM history WHERE telegram = 0",
      (error, results) => {
        if (error) {
          console.error("Database query error:", error);
          return;
        }
        results.forEach((record) => {
          db.query(
            "SELECT user FROM account WHERE `key` = ? ",
            [record.key_user],
            (err, ss) => {
              if (err) throw err;
              console.log(ss);
              const message = `ID: #${record.key_user}\nUser: ${
                ss[0].user
              }\nType: ${JSON.parse(record.type)[0]}\nNumber: ${
                JSON.parse(record.type)[1]
              }\n${currentDateTimeString}`;
              const data = {
                chat_id: "-4268334668",
                text: message,
              };
              axios
                .post(url, data)
                .then((response) => {
                  console.log("Message sent:", response.data);
                  db.query(
                    "UPDATE history SET telegram = 1 WHERE `key_user` = ?",
                    [record.key_user],
                    (err, success) => {
                      if (err) throw err;
                      console.log("Database updated");
                    }
                  );
                })
                .catch((error) => {
                  console.error("Error sending message:", error);
                });
            }
          );
        });
      }
    );
  }

  function sendATMToTelegarm() {
    db.query("SELECT * FROM topup WHERE telegram = 0", (error, results) => {
      if (error) throw error;
      results.forEach((record) => {
        db.query(
          "SELECT user FROM account WHERE `key` = ? ",
          [record.key],
          (err, ss) => {
            if (err) throw err;
            const message = `ID: #${record.key}\nUser: ${
              ss[0].user
            } vừa nạp thẻ cào\nType: ${record.telco}\nMoney: ${formatNum(
              record.amount
            )}đ\nTime: ${timeTodate(getTime().date)}`;
            const data = {
              chat_id: "-4268334668",
              text: message,
            };
            axios
              .post(url, data)
              .then((response) => {
                console.log("Message sent:", response.data);
                db.query(
                  "UPDATE topup SET telegram = 1 WHERE `key` = ?",
                  [record.key],
                  (err, success) => {
                    if (err) throw err;
                    console.log("Database updated");
                  }
                );
              })
              .catch((error) => {
                console.error("Error sending message:", error);
              });
          }
        );
      });
    });
  }
  const sendMbToTelegram = () => {
    db.query(
      "SELECT * FROM transactions WHERE isTelegram = 0",
      async (error, results) => {
        if (error) throw error;

        for (let record of results) {
          try {
            const ss = await new Promise((resolve, reject) => {
              db.query(
                "SELECT `user`, `key` FROM account WHERE `atm_key` = ?",
                [record.atm_key],
                (err, ss) => {
                  if (err) reject(err);
                  resolve(ss);
                }
              );
            });
            const message = `ID: #${ss[0].key}\nUser: ${
              ss[0].user
            } vừa ATM\nMoney: ${formatNum(record.creditAmount)}đ\nTime: ${
              record.transactionDate
            }`;

            const data = {
              chat_id: "-4268334668",
              text: message,
            };

            await axios.post(url, data);

            await new Promise((resolve, reject) => {
              db.query(
                "UPDATE `transactions` SET `isTelegram` = 1 WHERE `atm_key` = ?",
                [record.atm_key],
                (err, success) => {
                  if (err) reject(err);
                  console.log("Database updated");
                  resolve();
                }
              );
            });
          } catch (err) {
            console.error("Error processing record:", err);
          }
        }
      }
    );
  };

  setInterval(sendMessageToTelegram, 5000);
  setInterval(sendATMToTelegarm, 5000);
  setInterval(sendMbToTelegram, 5000);
  return bot;
};

module.exports = {
  createBot,
};
