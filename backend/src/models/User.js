import pool from '../config/pool.js';

export const createUser = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO users (username, password, email, role_id, active_stat, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [data.username, data.password, data.email, data.role, 1] 
  );
  return result.insertId;
};

export const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE username = ? LIMIT 1`, [username]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE user_id = ? LIMIT 1`, [id]
  );
  return rows[0];
};

export const updateUser = async (id, data) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET username = ?, email = ?, password = ?, role_id = ?, active_stat = ?, updated_at = NOW()
     WHERE user_id = ?`,
    [data.username, data.email, data.password, data.role_id, data.active_stat, id]
  );
  return result;
};

export const deactivateUser = async (id) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET active_stat = 0, updated_at = NOW() 
     WHERE user_id = ?`, [id]
  );
  return result;
};
