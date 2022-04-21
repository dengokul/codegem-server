const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();

function formatDate(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
module.exports.formatDate = formatDate;

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
module.exports.convertToSlug = convertToSlug;

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports.generateOTP = generateOTP;