const DB = require("../config/db");
const { JWTTokenKey } = require("../config/constant");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

exports.getCurrentUser = async (token) => {
  try {
    if (!token) return null;
    let decodedToken = jwt.verify(token, JWTTokenKey);
    if (!decodedToken) return null;
    if (decodedToken.userId !== undefined) {
      const [rows] = await DB.query(
        `SELECT id FROM users WHERE id=${decodedToken.userId}`
      );
      return rows.length > 0
        ? rows.map((row) => {
            return { id: row.id };
          })[0]
        : null;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

exports.doAuth = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx, info);
};
