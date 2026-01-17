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
     SET username = ?, password = ?, role_id = ?, active_stat = ?, updated_at = NOW()
     WHERE user_id = ?`,
    [data.username, data.password, data.role_id, data.active_stat, id]
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

export const createUserFromVerifiedConstituent = async (verified_id, username, hashedPassword) => {
  // Role 3 = Resident, active_stat = 1 (active)
  const [result] = await pool.execute(
    `INSERT INTO users (username, password, role_id, active_stat, verified_id, created_at, updated_at)
     VALUES (?, ?, 3, 1, ?, NOW(), NOW())`,
    [username, hashedPassword, verified_id]
  );
  return result.insertId;
};

export const checkUsernameExists = async (username) => {
  const [rows] = await pool.execute(
    `SELECT user_id FROM users WHERE username = ? LIMIT 1`,
    [username]
  );
  return rows.length > 0;
};

export const getVerifiedConstituentIdByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT verified_id FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0]?.verified_id || null;
};
