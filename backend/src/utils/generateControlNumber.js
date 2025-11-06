// src/utils/generateControlNumber.js
import pool from "../config/pool.js";

/**
 * Generates a unique control number per certificate type and month.
 * Format: YYYY-MM-XXXX (e.g., 2025-11-0001)
 */
export async function generateControlNumber() {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      `SELECT last_increment 
       FROM control_number_counter 
       WHERE \`year_month\` = ? 
       FOR UPDATE`,
      [yearMonth]
    );

    let nextIncrement = 1;

    if (rows.length > 0) {
      nextIncrement = rows[0].last_increment + 1;
      await conn.execute(
        `UPDATE control_number_counter 
         SET last_increment = ? 
         WHERE \`year_month\` = ?`,
        [nextIncrement, yearMonth]
      );
    } else {
      await conn.execute(
        `INSERT INTO control_number_counter (\`year_month\`, \`last_increment\`) 
         VALUES (?, 1)`,
        [yearMonth]
      );
    }

    await conn.commit();

    const formattedIncrement = String(nextIncrement).padStart(4, "0");
    return `${yearMonth}-${formattedIncrement}`;
  } catch (error) {
    await conn.rollback();
    console.error("❌ Error generating control number:", error);
    throw new Error("Failed to generate control number");
  } finally {
    conn.release();
  }
}
