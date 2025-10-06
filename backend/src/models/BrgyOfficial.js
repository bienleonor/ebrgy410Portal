import pool from '../config/pool.js';

export const createBrgyOfficial = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO brgy_officials 
     (f_name, m_name, l_name, contact_no, start_term, end_term, position, profile_image, status, remarks, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.f_name,
      data.m_name,
      data.l_name,
      data.contact_no,
      data.start_term,
      data.end_term,
      data.position,
      data.profile_image || 'default.jpg',
      data.status || 'active',
      data.remarks || null,
      data.user_id
    ]
  );
  return result.insertId;
};

export const getAllBrgyOfficials = async () => {
  const [rows] = await pool.execute(
    `SELECT bo.*, u.username, u.email, u.role 
     FROM brgy_officials bo
     JOIN users u ON bo.user_id = u.user_id`
  );
  return rows;
};

export const getBrgyOfficialById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT bo.*, u.username, u.email, u.role 
     FROM brgy_officials bo
     JOIN users u ON bo.user_id = u.user_id
     WHERE bo.brgy_official_no = ?`, [id]
  );
  return rows[0];
};

export const updateBrgyOfficial = async (id, data) => {
  const [result] = await pool.execute(
    `UPDATE brgy_officials 
     SET f_name = ?, m_name = ?, l_name = ?, contact_no = ?, start_term = ?, end_term = ?, position = ?, profile_image = ?, status = ?, remarks = ?
     WHERE brgy_official_no = ?`,
    [
      data.f_name,
      data.m_name,
      data.l_name,
      data.contact_no,
      data.start_term,
      data.end_term,
      data.position,
      data.profile_image,
      data.status,
      data.remarks,
      id
    ]
  );
  return result;
};

export const deleteBrgyOfficial = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM brgy_officials WHERE brgy_official_no = ?`, [id]
  );
  return result;
};
