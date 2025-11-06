import pool from '../config/pool.js';

export const CertificateTypeModel = {
  // 🔹 Find certificate type by ID
  async findById(cert_type_id) {
    const [rows] = await pool.query(
      "SELECT * FROM certificate_types WHERE cert_type_id = ?",
      [cert_type_id]
    );
    return rows[0] || null;
  },

  // 🔹 List all active certificate types
  async findAll() {
    const [rows] = await pool.query(
      "SELECT * FROM certificate_types ORDER BY name ASC"
    );
    return rows;
  },
};