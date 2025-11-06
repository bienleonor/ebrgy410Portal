import pool from "../config/pool.js";

export const CertificateTemplateModel = {
  // Get active template for a certificate type
  async findByCertType(cert_type_id) {
    const [rows] = await pool.query(
      `SELECT * FROM certificate_templates 
       WHERE certificate_type_id = ? AND is_active = 1
       ORDER BY uploaded_at DESC 
       LIMIT 1`,
      [cert_type_id]
    );
    return rows[0] || null;
  },

  // Optional: list all templates
  async findAll() {
    const [rows] = await pool.query(
      "SELECT * FROM certificate_templates ORDER BY uploaded_at DESC"
    );
    return rows;
  },

  // Optional: insert new template
  async create({ certificate_type_id, file_name, file_path, uploaded_by }) {
    const [result] = await pool.query(
      `INSERT INTO certificate_templates 
         (certificate_type_id, file_name, file_path, uploaded_by)
       VALUES (?, ?, ?, ?)`,
      [certificate_type_id, file_name, file_path, uploaded_by]
    );
    return result.insertId;
  },
};
