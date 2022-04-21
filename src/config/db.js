
const mysql = require('mysql2');
const { db } = require("../config/constant");

const pool = mysql.createPool({host: db.host, user: db.user, password: db.password, database: db.database });
const promisePool = pool.promise();
module.exports = promisePool;