import pool from '../config/pool.js';

export const CertificateAttachmentModel = {
  // 🔹 Create a new generated file record
  async create({ request_id, file_name, file_path, file_type = "generated" }) {
    const [result] = await pool.query(
      `INSERT INTO certificate_attachments 
       (request_id, file_name, file_path, file_type)
       VALUES (?, ?, ?, ?)`,
      [request_id, file_name, file_path, file_type]
    );
    return result.insertId;
  },

  // 🔹 Find attachment by request ID
  async findByRequestId(request_id) {
    const [rows] = await pool.query(
      "SELECT * FROM certificate_attachments WHERE request_id = ? LIMIT 1",
      [request_id]
    );
    return rows[0] || null;
  },

  // 🔹 Delete attachment (optional, for replacements)
  async deleteByRequestId(request_id) {
    const [result] = await pool.query(
      "DELETE FROM certificate_attachments WHERE request_id = ?",
      [request_id]
    );
    return result.affectedRows > 0;
  },
};