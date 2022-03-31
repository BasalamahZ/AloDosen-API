const jwt = require("jsonwebtoken");

//verify jwt
const verifyToken = (req, res, next) => {
  if (authHeader) {
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        res.status(403).send({
          success: false,
          message: "token is not valid!",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "you are not authenticated",
    });
  }
};

module.exports = verifyToken;
