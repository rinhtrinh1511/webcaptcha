const cron = require("node-cron");

const CronIP = (db) => {
  cron.schedule("0 */2 * * *", () => {
    console.log("Reset IP mỗi 2 giờ");
    db.query("UPDATE account SET ip = JSON_ARRAY()", (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa IP:", err);
      } else {
        console.log("Cập nhật cột ip thành công:", result);
      }
    });
  });
};
module.exports = CronIP;
