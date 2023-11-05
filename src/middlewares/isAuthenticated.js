const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const isAuthenticated = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = tokenHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = isAuthenticated;
