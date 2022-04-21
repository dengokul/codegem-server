const { Transporter, appUrl } = require("../config/constant");
const fs = require("fs");
const Hogan = require("hogan.js");
const dotenv = require("dotenv");
dotenv.config();

const { MAILJET_FROM_EMAIL, MAILJET_FROM_NAME } = process.env;

const adminEmail = "dengokul@gmail.com";

async function customerOTPVerification(htmlData) {
  let template = fs.readFileSync(
    "./EmailTemplates/OTPVerification.html",
    "utf-8"
  );
  let htmlTemplate = Hogan.compile(template);
  let mailOptions = {
    from: MAILJET_FROM_NAME + "<" + MAILJET_FROM_EMAIL + ">",
    to: htmlData.email.toLowerCase(),
    subject: "OTP Verification",
    html: htmlTemplate.render({
      fullName: htmlData.fullName,
      otpCode: htmlData.otpCode,
    }),
  };

  await Transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
  });
}
module.exports.customerOTPVerification = customerOTPVerification;

async function resetPasswordEmail(htmlData) {
  let template = fs.readFileSync(
    "./EmailTemplates/ResetPasswordEmail.html",
    "utf-8"
  );
  let htmlTemplate = Hogan.compile(template);
  let mailOptions = {
    from: MAILJET_FROM_NAME + "<" + MAILJET_FROM_EMAIL + ">",
    to: htmlData.email.toLowerCase(),
    subject: "Password Reset",
    html: htmlTemplate.render({
      fullName: htmlData.fullName,
      appUrl: appUrl + "/reset-password/" + htmlData.token,
    }),
  };

  await Transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
  });
}
module.exports.resetPasswordEmail = resetPasswordEmail;