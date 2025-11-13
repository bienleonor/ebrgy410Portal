import pool from "../config/pool.js";

export const getAllPositions = async () => {
  const [rows] = await pool.execute(`
    SELECT *
    FROM positions
    ORDER BY position_id
  `);
  return rows;
};