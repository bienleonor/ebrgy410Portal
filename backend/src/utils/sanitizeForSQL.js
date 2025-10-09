export function sanitizeForSQL(data) {
  const sanitized = {};
  for (const key in data) {
    sanitized[key] =
      data[key] === undefined || data[key] === '' ? null : data[key];
  }
  return sanitized;
}
