const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const port = 1511;
const path = require("path");
const bodyParser = require("body-parser");
const setupWebSocketServer = require("./websocket/ws");
const HistoryTopup = require("./websocket/ws");
const HistoryMB = require("./websocket/ws");
const server = http.createServer(app);
const Controller = require("./Controller/controller");
const Router = require("./routers/router");
const AuthKey = require("./middleware/checkKey");
const authMiddleware = require("./middleware/authToken");
const CheckTokenForPassword = require("./middleware/checkTokenPassword");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/", authMiddleware, Router);

app.post("/SolveCaptcha/:key", AuthKey.checkKeyNro, Controller.SolveCaptcha);
app.get("/SolveCaptcha/:key", AuthKey.checkKeyNro, Controller.thankyou);

app.post("/SolveCaptchaMB/:key", AuthKey.checkMB, Controller.SolveCaptchaMB);
app.get("/SolveCaptchaMB/:key", AuthKey.checkMB, Controller.thankyou);

app.post("/reset-password", CheckTokenForPassword, Controller.ForgotPassword);
app.post("/repassword", Controller.RePassword);

app.post("/CheckKey/:key", AuthKey.checkKeyTool, Controller.AcitveTool);
app.get("/CheckKey/:key", AuthKey.checkKeyTool, Controller.thankyou);

server.listen(port, () => {
  console.log(`Server on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("server nodejs");
});
