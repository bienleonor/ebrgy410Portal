import pool from "../config/pool.js";
import lookupModel from "./lookupModel.js";

export const DashboardModel = {
  async countHouseholds() {
    const [[row]] = await pool.query("SELECT COUNT(*) AS count FROM households");
    return row.count;
  },

  async countResidents() {
    const [[row]] = await pool.query("SELECT COUNT(*) AS count FROM verified_constituent");
    return row.count;
  },

  async countVoters() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM verified_constituent WHERE registered_voter = 1"
    );
    return row.count;
  },

  async countCertificates() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM certificate_requests"
    );
    return row.count;
  },

  // Statistics for charts
  async getGenderDistribution() {
    const [rows] = await pool.query(`
      SELECT 
        sex AS gender,
        COUNT(*) AS count
      FROM verified_constituent
      GROUP BY sex
    `);
    return rows;
  },

  async getAgeBrackets() {
    const [rows] = await pool.query(`
      SELECT 
        CASE
          WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 0 AND 17 THEN '0-17'
          WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 18 AND 30 THEN '18-30'
          WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 31 AND 45 THEN '31-45'
          WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 46 AND 60 THEN '46-60'
          ELSE '60+'
        END AS age_bracket,
        COUNT(*) AS count
      FROM verified_constituent
      GROUP BY age_bracket
      ORDER BY age_bracket
    `);
    return rows;
  },

  async getSeniorCitizenCount() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM verified_constituent WHERE senior_citizen = 1"
    );
    return row.count;
  },

  async getPWDCount() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM verified_constituent WHERE pwd = 1"
    );
    return row.count;
  },

  async getCertificatePurposes() {
    const [rows] = await pool.query(`
      SELECT 
        purpose,
        COUNT(*) AS count
      FROM certificate_requests
      GROUP BY purpose
      ORDER BY count DESC
      LIMIT 10
    `);
    return rows;
  },

  async getCertificateTypes() {
    const [rows] = await pool.query(`
      SELECT 
        ct.name AS certificate_type,
        COUNT(*) AS count
      FROM certificate_requests cr
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      GROUP BY ct.name
      ORDER BY count DESC
    `);
    return rows;
  },

  async getCertificateStatusDistribution() {
    // Get all certificate statuses from lookup
    const statuses = await lookupModel.getCertificateStatus();
    
    // Get counts for each status
    const [counts] = await pool.query(`
      SELECT 
        status_id,
        COUNT(*) AS count
      FROM certificate_requests
      GROUP BY status_id
    `);
    
    // Map counts to status names
    const result = statuses.map(status => {
      const countData = counts.find(c => c.status_id === status.stat_id);
      return {
        status: status.status_name,
        count: countData ? countData.count : 0
      };
    });
    
    return result;
  },

  async getVotersList() {
    const [rows] = await pool.query(`
      SELECT 
        CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) AS name,
        voter_num,
        sex,
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age
      FROM verified_constituent
      WHERE registered_voter = 1
      ORDER BY last_name, first_name
    `);
    return rows;
  },
};
