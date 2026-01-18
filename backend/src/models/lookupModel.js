import pool from "../config/pool.js";

const lookupModel = {
  // Blood Types
  async getBloodTypes() {
    const [rows] = await pool.query(`
      SELECT blood_type_id, blood_type_name 
      FROM blood_types 
      ORDER BY blood_type_name
    `);
    return rows;
  },

  // Education Attainments
  async getEducationAttainments() {
    const [rows] = await pool.query(`
      SELECT * FROM education_list ORDER BY educ_id ASC
    `);
    return rows;
  },

  // Income Ranges
  async getIncomeRanges() {
    const [rows] = await pool.query(`
      SELECT * FROM monthly_income_range ORDER BY mi_id ASC
    `);
    return rows;
  },

  async getCertificateStatus() {
    const [rows] = await pool.query(`SELECT * FROM status WHERE status_type = 'DOCUMENT' ORDER BY stat_id ASC`);
    return rows;
  },

  async getCivilStatusOptions() {
    const [rows] = await pool.query(`SELECT * FROM status WHERE status_type = 'CIVIL' ORDER BY stat_id ASC`);
    return rows;
  },

  // Record Status options (static)
  async getRecordStatusOptions() {
    const [rows] = await pool.query(`SELECT * FROM status WHERE status_type = 'CENSUS' ORDER BY stat_id ASC`);
    return rows;
  },
};

export default lookupModel;
