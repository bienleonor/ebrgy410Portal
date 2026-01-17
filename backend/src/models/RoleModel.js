import pool from '../config/pool.js';

export const findRoleIdByName = async (roleName) => {
  const [rows] = await pool.execute(
    `SELECT role_id FROM role WHERE role_name = ? LIMIT 1`, [roleName]
  );
  return rows[0]?.role_id || null;
};

export const findRoleNameById = async (roleId) => {
  const [rows] = await pool.execute(
    `SELECT role_name FROM role WHERE role_id = ? LIMIT 1`, [roleId]
  );
  return rows[0]?.role_name || null;
};

export const getAllRoles = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM role ORDER BY role_name ASC`
  );
  return rows
}