// accessControl.js
export const authorizeAccess = ({ roles = [], positions = [] } = {}) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user token" });
    }

    const userRole = user.role?.toLowerCase();
    const userPosition = user.position?.toLowerCase();

    const allowedRoles = roles.map(r => r.toLowerCase());
    const allowedPositions = positions.map(p => p.toLowerCase());

    console.log("🔐 RBAC DEBUG:", {
      userRole,
      userPosition,
      allowedRoles,
      allowedPositions,
    });

    // 🔹 Role check (SuperAdmin always passes)
    if (userRole === "superadmin") {
      console.log("✅ SuperAdmin bypass RBAC");
      return next();
    }

    // 🔹 Role-based check
    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: Invalid role" });
    }

    // 🔹 Position-based check
    if (allowedPositions.length && !allowedPositions.includes(userPosition)) {
      return res.status(403).json({ message: "Access denied: Invalid position" });
    }

    return next();
  };
};
