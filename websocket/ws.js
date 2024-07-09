const { randomInt } = require("crypto");
const pool = require("../config/connect");
const http = require("http");
const checkWebSocketKey = require("./checkTokenWs");
const { default: axios } = require("axios");
const socketIo = require("socket.io");

// function setupSocketIOServer(server) {
//   const io = socketIo(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Client đã kết nối");
//     const interval = setInterval(() => {
//       pool.query("SELECT count FROM captcha_count", (error, results, fields) => {
//         if (error) {
//           console.error("Error executing query:", error);
//           return;
//         }
//         let count = results[0].count;
//         pool.query(
//           `UPDATE captcha_count SET count = count + ${randomInt(1, 10)}`,
//           (error, results, fields) => {
//             if (error) {
//               console.error("Error executing query:", error);
//               return;
//             }
//             socket.emit("count", { count: count + 1 });
//           }
//         );
//       });
//     }, 1500);

//     socket.on("disconnect", () => {
//       console.log("Client đã ngắt kết nối");
//       clearInterval(interval);
//     });
//   });
// }

// function HistoryTopup(server) {
//   const io = socketIo(server, {
//     cors: {
//       origin: "http://localhost:3000", // Cấu hình đúng nguồn gốc mà bạn muốn cho phép
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("token", (data) => {
//       console.log("Client đã kết nối đến history");
//       const interval = setInterval(() => {
//         db.query(
//           "SELECT * FROM topup WHERE `key` = ? ORDER BY time DESC ",
//           checkWebSocketKey(data.token),
//           (error, results, fields) => {
//             if (error) {
//               console.error("Error executing query:", error);
//               return;
//             }
//             socket.emit("history", results);
//           }
//         );
//       }, 1500);

//       socket.on("disconnect", () => {
//         console.log("Client đã ngắt kết nối");
//         clearInterval(interval);
//       });
//     });
//   });
// }

// function HistoryMB(server) {
//   const io = socketIo(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("token", (data) => {
//       console.log("Client đã kết nối đến MB");
//       console.log(data);
//       const interval = setInterval(() => {
//         axios.get("http://localhost:1511/api/v1/mbbank");
//         db.query(
//           "SELECT atm_key FROM account WHERE `key` = ? ",
//           checkWebSocketKey(data.token),
//           (error, results, fields) => {
//             if (error) {
//               console.error("Error executing query:", error);
//               return;
//             }
//             db.query(
//               "SELECT * FROM transactions WHERE atm_key = ? ORDER BY transactionDate DESC",
//               [results[0].atm_key],
//               (err, dataMB) => {
//                 if (err) throw err;
//                 socket.emit("mbHistory", dataMB);
//               }
//             );
//           }
//         );
//       }, 1500);

//       socket.on("disconnect", () => {
//         console.log("Client đã ngắt kết nối");
//         clearInterval(interval);
//       });
//     });
//   });
// }

// const httpServer = http.createServer();
// HistoryTopup(httpServer);
// httpServer.listen(8444);

// const httpServer1 = http.createServer();
// setupSocketIOServer(httpServer1);
// httpServer1.listen(8443);

// const httpServer2 = http.createServer();
// HistoryMB(httpServer2);
// httpServer2.listen(8445);

// module.exports = { setupSocketIOServer, HistoryTopup, HistoryMB };
