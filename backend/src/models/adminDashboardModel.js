import pool from "../config/pool.js";

export const DashboardModel = {
  async countHouseholds() {
    const [[row]] = await pool.query("SELECT COUNT(*) AS count FROM households");
    return row.count;
  },

  async countResidents() {
    const [[row]] = await pool.query("SELECT COUNT(*) AS count FROM residents");
    return row.count;
  },

  async countVoters() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM residents WHERE is_voter = 1"
    );
    return row.count;
  },

  async countCertificates() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM certificate_requests"
    );
    return row.count;
  },
};
