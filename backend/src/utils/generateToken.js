import jwt from "jsonwebtoken";

export function generateToken(user) {
  // base payload
  const payload = {
    id: user.user_id,
    username: user.username,
    role: user.role_name || user.role, // normalize role
  };

  // 🧩 if the user has a barangay position (only for Admin-level users)
  if (user.role_name?.toLowerCase() === "admin" && user.position_name) {
    payload.position = user.position_name;
  }

  // SuperAdmins don’t need position
  // Residents don’t get a position
  console.log(payload)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export default generateToken;
