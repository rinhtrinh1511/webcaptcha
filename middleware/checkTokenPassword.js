const pool = require("../config/connect");

const CheckTokenForPassword = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return next();
  }
  try {
    await pool.query(
      "SELECT resetPasswordExpire, resetPasswordExpire password FROM account WHERE resetPasswordToken",
      [token]
    );
  } catch (e) {
    return e;
  }

  return res.send("hello");
};

module.exports = CheckTokenForPassword;
