import pool from "../config/pool.js";

export const createResident = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO residents 
    (user_id, first_name, middle_name, last_name, suffix, gender, birth_date, civil_status, nationality, occupation, address_id, contact_number, created_at, is_voter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [
      data.user_id,
      data.first_name,
      data.middle_name || null,
      data.last_name,
      data.suffix || null,
      data.gender,
      data.birth_date,
      data.civil_status,
      data.nationality,
      data.occupation || null,
      data.address_id,
      data.contact_number,
      data.is_voter,
    ]
  );
  return result;
};

export const getResidentByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM residents WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0];
};

export const updateResident = async (userId, data) => {
  const [result] = await pool.execute(
    `UPDATE residents SET 
      first_name = ?, middle_name = ?, last_name = ?, suffix = ?, gender = ?, 
      birth_date = ?, civil_status = ?, nationality = ?, occupation = ?, address_id = ?, 
      contact_number = ?, is_voter = ?
    WHERE user_id = ?`,
    [
      data.first_name,
      data.middle_name || null,
      data.last_name,
      data.suffix || null,
      data.gender,
      data.birth_date,
      data.civil_status,
      data.nationality,
      data.occupation || null,
      data.address_id,
      data.contact_number,
      data.is_voter,
      userId,
    ]
  );
  return result;
};

export const deleteResidentById = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM residents WHERE resident_id = ?`,
    [id]
  );
  return result;
};

export const getResidentByIdFromDB = async (id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM residents WHERE resident_id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
};

export const getAllResidents = async () => {
  const [rows] = await pool.execute(`SELECT * FROM residents`);
  return rows;
};
