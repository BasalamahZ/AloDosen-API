const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (authHeader) {
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        res.status(403).json("token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated");
  }
};

module.exports = verifyToken;
