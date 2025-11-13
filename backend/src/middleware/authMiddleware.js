import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  let token;

  // ✅ 1. Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // ✅ 2. Fallback: check query string (?token=...)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  // ✅ 3. No token at all
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // ✅ 4. Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
