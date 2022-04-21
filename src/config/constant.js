const dotenv = require("dotenv");
const JWTTokenKey = "_codegem_";
module.exports.JWTTokenKey = JWTTokenKey;
dotenv.config();
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  APP_URL
} = process.env;

module.exports.appUrl = APP_URL;

const db = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}
module.exports.db = db;