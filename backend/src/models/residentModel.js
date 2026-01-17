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

export const getResidentByUserId = async (verified_id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE verified_id = ? LIMIT 1`,
    [verified_id]
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
    `SELECT * FROM verified_constituent WHERE verified_id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
};

export const getAllResidents = async () => {
  const [rows] = await pool.execute(`SELECT * FROM verified_constituent`);
  return rows;
};

export const getResidentWithFullAddress = async (verified_id) => {
  const query = `
    SELECT 
      vc.*,
      a.house_number,
      s.street_name,
      b.barangay_name,
      z.zone_number,
      b.district,
      c.name AS city_name
    FROM verified_constituent vc
    LEFT JOIN addresses a ON vc.addr_id = a.addr_id
    LEFT JOIN streets s ON a.street_id = s.street_id
    LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
    LEFT JOIN zones z ON b.zone_id = z.zone_id
    LEFT JOIN cities c ON b.city_id = c.city_id
    WHERE vc.verified_id = ?
    LIMIT 1
  `;

  try {
    const [rows] = await pool.execute(query, [verified_id]);
    if (!rows.length) return null;

    const r = rows[0];
    // ✅ Auto-format full readable address
    const formatted_address = [
      r.house_number,
      r.street_name, "BRGY. " +
      r.barangay_name,
      r.zone_number,
      r.district,
      r.city_name,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      ...r,
      formatted_address,
    };
  } catch (error) {
    console.error("❌ Error fetching resident with full address:", error);
    throw error;
  }
};
