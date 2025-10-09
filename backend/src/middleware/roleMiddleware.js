export const allowRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    // Normalize both sides to lowercase
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
