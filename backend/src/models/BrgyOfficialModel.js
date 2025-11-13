// src/models/brgyOfficialModel.js
import pool from "../config/pool.js";

/**
 * Create a new Barangay Official record.
 */
export const createBrgyOfficial = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO brgy_officials 
      (resident_id, position_id, start_term, end_term, profile_image, stat_id, remark)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.resident_id,
      data.position_id,
      data.start_term,
      data.end_term,
      data.profile_image || "default.jpg",
      data.stat_id || 1, // assuming 1 = active
      data.remark || null,
    ]
  );
  return result.insertId;
};

/**
 * Get all barangay officials with their positions.
 */
export const getAllBrgyOfficials = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      bo.brgy_official_no,
      bo.resident_id,
      bo.position_id,
      r.first_name,
      r.middle_name,
      r.last_name,
      p.position_name,
      bo.start_term,
      bo.end_term,
      bo.profile_image,
      bo.stat_id,
      s.status as status_name,
      bo.remark
    FROM brgy_officials bo
    JOIN residents r ON bo.resident_id = r.resident_id
    JOIN positions p ON bo.position_id = p.position_id
    LEFT JOIN status s ON bo.stat_id = s.stat_id
  `);
  return rows;
};

/**
 * Get barangay official by primary key (brgy_official_no)
 */
export const getBrgyOfficialById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.resident_id,
      p.position_name,
      bo.start_term,
      bo.end_term,
      bo.profile_image,
      bo.stat_id,
      bo.remark
    FROM brgy_officials bo
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.brgy_official_no = ?
    `,
    [id]
  );
  return rows[0] || null;
};

/**
 * Get barangay official by resident ID (used for document approval)
 */
export const getBrgyOfficialByResidentId = async (residentId) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.resident_id,
      bo.position_id,
      p.position_name
    FROM brgy_officials bo
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.resident_id = ?
    LIMIT 1
    `,
    [residentId]
  );
  return rows[0] || null;
};

/**
 * Update barangay official record
 */
export const updateBrgyOfficial = async (id, data) => {
  // Build SET clause dynamically based on provided fields
  const fields = [];
  const values = [];

  const allowedFields = [
    "position_id",
    "start_term",
    "end_term",
    "profile_image",
    "stat_id",
    "remark",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `
    UPDATE brgy_officials
    SET ${fields.join(", ")}
    WHERE brgy_official_no = ?
  `;

  values.push(id);
  const [result] = await pool.execute(query, values);
  return result;
};

/**
 * Delete barangay official by ID
 */
export const deleteBrgyOfficial = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM brgy_officials WHERE brgy_official_no = ?`,
    [id]
  );
  return result;
};
