const express = require("express");
const router = express.Router();
const Controller = require("../Controller/controller");
const middlewarePay = require("../middleware/payment");

/*---------------Get-----------------*/

router.get("/captcha", Controller.getCaptchaNro);
router.get("/captchacombo", Controller.getCaptchaNroCombo);
router.get("/captchamb", Controller.getCaptchaMB);
router.get("/captchacount", Controller.getCaptchaCount);
router.get("/info", Controller.getInfo);
router.get("/tools", Controller.getTools);

router.get("/mbbank", Controller.getHistoryMBBank);

/*---------------Post-----------------*/

router.post("/login", Controller.login);
router.post("/signup", Controller.signup);
router.post("/getitem", Controller.getItem);
router.post("/payment", Controller.payment);
router.post("/topup", Controller.topUpTheSieuRe);
router.post("/changekey", Controller.ChangeKeyMB);
router.post("/changekeynro", Controller.ChangeKeyNro);


/*---------------end-----------------*/

module.exports = router;
