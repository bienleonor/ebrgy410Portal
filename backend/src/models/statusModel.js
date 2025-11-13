import pool from "../config/pool.js";

export const getAllStatuses = async () => {
  const [rows] = await pool.execute(`
    SELECT stat_id, status 
    FROM status 
    ORDER BY stat_id
  `);
  return rows;
};