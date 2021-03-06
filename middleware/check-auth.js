const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // if (req.method === "OPTIONS") {
  //   return res.send(200);
  // } else {
  //   next();
  // }
  //NOT CASE SENSITIVE, AND THE CONVENTION IS Authorization: 'Bearer TOKEN'
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch {
    const error = new HttpError(" Token authentication failed!", 401);
    return next(error);
  }
};
