const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
