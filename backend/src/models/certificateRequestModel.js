// src/models/certificateRequestModel.js
import pool from "../config/pool.js";
import lookupModel from "./lookupModel.js";

export const CertificateRequestModel = {
  // === CREATE ===
  async create({ verified_id, certificate_type_id, purpose, quantity, control_number }) {
    // Get Pending status ID
    const statuses = await lookupModel.getCertificateStatus();
    const pendingStatus = statuses.find(s => s.status_name === 'PENDING');
    
    if (!pendingStatus) {
      throw new Error('Pending status not found in lookup table');
    }

    const query = `
      INSERT INTO certificate_requests 
        (verified_id, certificate_type_id, purpose, quantity, control_number, status_id, submitted_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    try {
      const [result] = await pool.execute(query, [
        verified_id,
        certificate_type_id,
        purpose,
        quantity,
        control_number,
        pendingStatus.stat_id,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("❌ Error creating certificate request:", error);
      throw error;
    }
  },

  // === UPDATE STATUS ===
  async updateStatus({ cert_req_id, statusId, denied_reason, processed_by }) {
    // Get Approved status ID for comparison
    const statuses = await lookupModel.getCertificateStatus();
    const approvedStatus = statuses.find(s => s.status_name.toUpperCase() === 'APPROVED');
    
    const query = `
      UPDATE certificate_requests 
      SET 
        status_id = ?, 
        denied_reason = ?, 
        processed_by = ?, 
        issued_date = IF(? = ?, NOW(), issued_date)
      WHERE cert_req_id = ?
    `;
    try {
      const [result] = await pool.execute(query, [
        statusId,
        denied_reason || null,
        processed_by || null,
        statusId,
        approvedStatus?.stat_id || null,
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

  // === RELEASE CERTIFICATE ===
  async releaseCertificate({ cert_req_id, statusId, official_claim_assist }) {
    const query = `
      UPDATE certificate_requests 
      SET 
        status_id = ?, 
        official_claim_assist = ?,
        date_claimed = NOW()
      WHERE cert_req_id = ?
    `;
    try {
      const [result] = await pool.execute(query, [
        statusId,
        official_claim_assist || null,
        cert_req_id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("❌ Error releasing certificate:", error);
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error(
          "Invalid official reference: ensure 'official_claim_assist' matches an existing brgy_official_no"
        );
      }
      throw error;
    }
  },

  // === FETCH ALL ===
  async findAll() {
    const query = `
      SELECT 
        cr.cert_req_id,
        cr.verified_id,
        cr.certificate_type_id,
        cr.purpose,
        cr.quantity,
        cr.control_number,
        cr.submitted_at,
        cr.issued_date,
        cr.denied_reason,
        cr.processed_by,
        COALESCE(s.status_name, 'Unknown') AS status,
        ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name,
        p.position_name AS processed_by_position,
        IF(ca.id IS NOT NULL, 1, 0) AS has_attachment
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      LEFT JOIN status s ON cr.status_id = s.stat_id
      LEFT JOIN brgy_officials bo ON cr.processed_by = bo.brgy_official_no
      LEFT JOIN positions p ON bo.position_id = p.position_id
      LEFT JOIN certificate_attachments ca ON cr.cert_req_id = ca.request_id
      ORDER BY cr.submitted_at DESC
    `;
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error("❌ Error in findAll:", error);
      throw error;
    }
  },

  // === FETCH BY RESIDENT ===
  async findByResidentId(verified_id) {
    const query = `
      SELECT 
        cr.cert_req_id,
        cr.verified_id,
        cr.certificate_type_id,
        cr.purpose,
        cr.quantity,
        cr.control_number,
        cr.submitted_at,
        cr.issued_date,
        cr.denied_reason,
        cr.processed_by,
        s.status_name AS status,
        ct.name AS certificate_name
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      LEFT JOIN status s ON cr.status_id = s.stat_id
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
        cr.cert_req_id,
        cr.verified_id,
        cr.certificate_type_id,
        cr.purpose,
        cr.quantity,
        cr.control_number,
        cr.submitted_at,
        cr.issued_date,
        cr.denied_reason,
        cr.processed_by,
        s.status_name AS status,
        ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name,
        p.position_name AS processed_by_position
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      LEFT JOIN status s ON cr.status_id = s.stat_id
      LEFT JOIN brgy_officials bo ON cr.processed_by = bo.brgy_official_no
      LEFT JOIN positions p ON bo.position_id = p.position_id
      WHERE cr.cert_req_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [cert_req_id]);
    return rows[0] || null;
  },

  // === FETCH BY STATUS ===
  async findByStatus(statusName) {
    const query = `
      SELECT 
        cr.cert_req_id,
        cr.verified_id,
        cr.certificate_type_id,
        cr.purpose,
        cr.quantity,
        cr.control_number,
        cr.submitted_at,
        cr.issued_date,
        cr.denied_reason,
        cr.processed_by,
        s.status_name AS status,
        ct.name AS certificate_name,
        CONCAT_WS(' ', vc.first_name, vc.middle_name, vc.last_name) AS resident_name
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      JOIN verified_constituent vc ON cr.verified_id = vc.verified_id
      LEFT JOIN status s ON cr.status_id = s.stat_id
      WHERE s.status_name = ?
      ORDER BY cr.submitted_at DESC
    `;
    const [rows] = await pool.execute(query, [statusName]);
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
