// src/models/certificateRequestModel.js
import pool from "../config/pool.js";

export const CertificateRequestModel = {
  // === CREATE ===
  async create({ verified_id, certificate_type_id, purpose, quantity, control_number }) {
    const query = `
      INSERT INTO certificate_requests 
        (verified_id, certificate_type_id, purpose, quantity, control_number, status, submitted_at) 
      VALUES (?, ?, ?, ?, ?, 'Pending', NOW())
    `;
    try {
      const [result] = await pool.execute(query, [
        verified_id,
        certificate_type_id,
        purpose,
        quantity,
        control_number,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("❌ Error creating certificate request:", error);
      throw error;
    }
  },

  // === UPDATE STATUS ===
  async updateStatus({ cert_req_id, status, remarks, denied_reason, processed_by }) {
    const query = `
      UPDATE certificate_requests 
      SET 
        status = ?, 
        remarks = ?, 
        denied_reason = ?, 
        processed_by = ?, 
        issued_date = IF(? = 'Approved', NOW(), issued_date)
      WHERE cert_req_id = ?
    `;
    try {
      const [result] = await pool.execute(query, [
        status,
        remarks || null,
        denied_reason || null,
        processed_by || null,
        status,
        cert_req_id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("❌ Error updating certificate request:", error);
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error(
          "Invalid official reference: ensure 'processed_by' matches an existing brgy_official_no"
        );
      }
      throw error;
    }
  },

  // === FETCH ALL ===
  async findAll() {
    const query = `
      SELECT 
        cr.*,
        ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name,
        p.position_name AS processed_by_position
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      LEFT JOIN brgy_officials bo ON cr.processed_by = bo.brgy_official_no
      LEFT JOIN positions p ON bo.position_id = p.position_id
      ORDER BY cr.submitted_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  // === FETCH BY RESIDENT ===
  async findByResidentId(verified_id) {
    const query = `
      SELECT 
        cr.*, 
        ct.name AS certificate_name
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      WHERE cr.verified_id = ?
      ORDER BY cr.submitted_at DESC
    `;
    const [rows] = await pool.execute(query, [verified_id]);
    return rows;
  },

  // === FETCH BY ID ===
  async findById(cert_req_id) {
    const query = `
      SELECT 
        cr.*, 
        ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name,
        p.position_name AS processed_by_position
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      LEFT JOIN brgy_officials bo ON cr.processed_by = bo.brgy_official_no
      LEFT JOIN positions p ON bo.position_id = p.position_id
      WHERE cr.cert_req_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [cert_req_id]);
    return rows[0] || null;
  },

  // === FETCH BY STATUS ===
  async findByStatus(status) {
    const query = `
      SELECT 
        cr.*, ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      WHERE cr.status = ?
      ORDER BY cr.submitted_at DESC
    `;
    const [rows] = await pool.execute(query, [status]);
    return rows;
  },

  // === NEW: Find last control number ===
  async findLastControlNumber(certificate_type_id) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const query = `
      SELECT control_number
      FROM certificate_requests
      WHERE certificate_type_id = ?
        AND YEAR(submitted_at) = ?
        AND MONTH(submitted_at) = ?
      ORDER BY submitted_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [certificate_type_id, year, month]);
    return rows.length > 0 ? rows[0].control_number : null;
  },
};
