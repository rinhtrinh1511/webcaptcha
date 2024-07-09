const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendEmail(email, user, token) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "icaptcha.online@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "icaptcha.online@gmail.com",
      to: email,
      subject: "iCaptcha.online: Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    background-color: #ffffff;
                    margin: 0 auto;
                    padding: 20px;
                    max-width: 600px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
              
                .content p {
                    line-height: 1.6;
                    color: #666666;
                    font-size: 14px
                }
                .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white !important;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 4px;
                    font-size: 14px
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #999999;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>iCaptcha.online</h1>
                </div>
                <div class="content">
                    <h2></h2>
                    <p>Dear ${user},</p>
                    <p>We have generated a new password for your account on iCaptcha.online. Please use the following button to reset your password:</p>
                     <a href="https://icaptcha.online/reset-password?token=${token}" class="button">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 iCaptcha.online. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result.response;
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = sendEmail;
