const jwt = require("jsonwebtoken");

// Auth Middle to Verify Token
function auth(req, res, next) {
  const token = req.headers["x-auth-token"];
  // If no token is provided, return a 401 Unauthorized
  if (token == null) {
    return res
      .sendStatus(401)
      .json({ message: "Authentication token is required." });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user._id;
    next();
  });
}

module.exports = auth;
