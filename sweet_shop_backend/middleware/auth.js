const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "JWT_SECRET"; // Use env variable in production

function authenticateToken(req, res, next) {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // Attach user payload to the request
    next();
  });
}

function adminCheck(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
}

module.exports = { authenticateToken, adminCheck };
