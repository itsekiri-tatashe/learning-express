const jwt = require("jsonwebtoken");

// Auth Middle to Verify Token
function auth(req, res, next) {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store entire payload (e.g. { _id, email, role })
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

module.exports = auth;
