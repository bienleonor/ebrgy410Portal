import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const hasRole = (user, roles) => {
  if (!user || !user.role) {
    console.warn('Role check failed: user or role missing');
    return false;
  }
  const userRole = user.role.trim().toLowerCase();
  const normalizedRoles = roles.map(role => role.toLowerCase());
  return normalizedRoles.includes(userRole);
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  return !decoded || Date.now() >= decoded.exp * 1000;
};

export const getRemainingTime = (token) => {
  const decoded = decodeToken(token);
  return decoded ? decoded.exp * 1000 - Date.now() : 0;
};
