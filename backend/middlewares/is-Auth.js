const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (req.headers?.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ mesaage: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "Invalid Token" });
  }
};
