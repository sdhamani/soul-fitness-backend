const jwt = require("jsonwebtoken");

function privateRoute(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const verified = jwt.verify(token, process.env.tokenSecret);
    req.user = verified;
    next();
    
  } catch (error) {
    req.status(400).send("Invalid Token");
  }
}

module.exports = privateRoute;
