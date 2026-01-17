import pool from "../config/pool.js";

const allStatus = {
  async getStatusByType(stat_type) {
    const [rows] = await pool.execute(
      'SELECT * FROM status WHERE status_type = ? ORDER BY stat_id',
      [stat_type]
    );
    return rows;
  },

  async getStatusById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM status WHERE stat_id = ?', [id]
    );
    return rows[0];
  },

  async postStatus(data) {
    const { status_name, status_type } = data;
    const [result] = await pool.execute(
      'INSERT INTO status (status_name, status_type) VALUES (?, ?)',
      [status_name, status_type]
    );
    return result.id;
  },

  async putStatus(id, data) {
    const { status_name, status_type } = data;
    const [result] = await pool.execute(
      'UPDATE status SET status_name = ?, status_type = ? WHERE stat_id = ?',
      [status_name, status_type, id]
    );
    return result.affectedRows;
  },

  async deleteStatus(id) {
    const [result] = await pool.execute(
      'DELETE FROM status WHERE stat_id = ?',
      [id]
    );
    return result.affectedRows;
  },
  

};

export default allStatus;