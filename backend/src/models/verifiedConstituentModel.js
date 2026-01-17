import pool from "../config/pool.js";
import allStatus from "./statusModel.js";
import { findOrCreateAddress } from "./addressModel.js";

const verifiedConstituentModel = {
  // Get all verified constituents
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        vc.*,
        a.address_no,
        s.street_name,
        b.brgy_name AS barangay_name,
        bt.blood_type_name,
        ea.educ_attain_name,
        ir.income_range_name
      FROM verified_constituent vc
      LEFT JOIN addresses a ON vc.addr_id = a.addr_id
      LEFT JOIN streets s ON a.street_id = s.street_id
      LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
      LEFT JOIN blood_types bt ON vc.blood_type_id = bt.blood_type_id
      LEFT JOIN education_attainments ea ON vc.educ_attain_id = ea.educ_attain_id
      LEFT JOIN income_ranges ir ON vc.income_range_id = ir.income_range_id
      ORDER BY vc.last_name, vc.first_name
    `);
    return rows;
  },

  // Get verified constituent by ID
  async getById(verifiedId) {
    const [rows] = await pool.query(
      `
      SELECT 
        vc.*,
        a.house_number,
        s.street_name,
        b.barangay_name
      FROM verified_constituent vc
      LEFT JOIN addresses a ON vc.addr_id = a.addr_id
      LEFT JOIN streets s ON a.street_id = s.street_id
      LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
      WHERE vc.verified_id = ?
    `,
      [verifiedId]
    );
    return rows[0];
  },

  // Search verified constituents
  async search(searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(
      `
      SELECT 
        vc.*,
        a.address_no,
        s.street_name,
        b.brgy_name AS barangay_name
      FROM verified_constituent vc
      LEFT JOIN addresses a ON vc.addr_id = a.addr_id
      LEFT JOIN streets s ON a.street_id = s.street_id
      LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
      WHERE vc.first_name LIKE ?
        OR vc.middle_name LIKE ?
        OR vc.last_name LIKE ?
        OR vc.email LIKE ?
      ORDER BY vc.last_name, vc.first_name
    `,
      [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
    );
    return rows;
  },

  // Find verified constituent by first name, last name, and birthdate
  async findByPersonalInfo(firstName, lastName, birthdate) {
    const [rows] = await pool.query(
      `
      SELECT verified_id, first_name, middle_name, last_name, email, birthdate
      FROM verified_constituent
      WHERE first_name = ? AND last_name = ? AND DATE(birthdate) = DATE(?)
      LIMIT 1
    `,
      [firstName, lastName, birthdate]
    );
    return rows[0];
  },

  // Create verified constituent from staging census
  async createFromStaging(stagingData, verifiedBy) {
    // Get Census statuses and find Active status
    const censusStatuses = await allStatus.getStatusByType('CENSUS');
    const activeStatus = censusStatuses.find(s => s.status.toLowerCase() === 'active');
    const statusId = activeStatus ? activeStatus.stat_id : null;

    // Find or create address from staging data
    const addr_id = await findOrCreateAddress({
      house_number: stagingData.house_number,
      street_id: stagingData.street_id,
      brgy_id: stagingData.brgy_id,
    });

    const [result] = await pool.query(
      `
      INSERT INTO verified_constituent (
        first_name, middle_name, last_name, suffix, sex, birthdate, birth_city_municipality,
        birth_province, birth_country, nationality, email, civil_status, is_househead, verified_by,
        verified_date, record_status, addr_id, blood_type_id,
        contact_number, religion, ethnic, ethnicity, educ_attain_id,
        occupation, income_range_id, health_conditions, pwd, senior_citizen,
        registered_voter, voter_num, philhealth_mem, philhealth_num,
        sss_mem, sss_num, tin_num, date_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        stagingData.first_name,
        stagingData.middle_name || null,
        stagingData.last_name,
        stagingData.suffix || null,
        stagingData.sex,
        stagingData.birthdate,
        stagingData.birth_city_municipality || null,
        stagingData.birth_province || null,
        stagingData.birth_country || null,
        stagingData.nationality,
        stagingData.email,
        stagingData.civil_status || null,
        stagingData.is_househead || false,
        verifiedBy,
        statusId,
        addr_id,
        stagingData.blood_type_id || null,
        stagingData.contact_number || null,
        stagingData.religion || null,
        stagingData.ethnic || null,
        stagingData.ethnicity || null,
        stagingData.educ_attain_id || null,
        stagingData.occupation || null,
        stagingData.income_range_id || null,
        stagingData.health_conditions || null,
        stagingData.pwd || false,
        stagingData.senior_citizen || false,
        stagingData.registered_voter || false,
        stagingData.voter_num || null,
        stagingData.philhealth_mem || false,
        stagingData.philhealth_num || null,
        stagingData.sss_mem || false,
        stagingData.sss_num || null,
        stagingData.tin_num || null,
      ]
    );
    return result.insertId;
  },

  // Update only email (the only editable field)
  async updateEmail(verifiedId, email) {
    const [result] = await pool.query(
      `
      UPDATE verified_constituent 
      SET email = ?, date_updated = NOW()
      WHERE verified_id = ?
    `,
      [email, verifiedId]
    );
    return result.affectedRows > 0;
  },

  // Update editable fields (not from staging_census)
  async update(verifiedId, data) {
    const allowedFields = [
      'email', 'is_househead', 'civil_status', 'blood_type_id',
      'contact_number', 'religion', 'ethnic', 'ethnicity', 'educ_attain_id',
      'occupation', 'income_range_id', 'health_conditions', 'pwd', 'senior_citizen',
      'registered_voter', 'voter_num', 'philhealth_mem', 'philhealth_num',
      'sss_mem', 'sss_num', 'tin_num'
    ];

    const updates = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (updates.length === 0) {
      return false;
    }

    updates.push('date_updated = NOW()');
    values.push(verifiedId);

    const [result] = await pool.query(
      `UPDATE verified_constituent SET ${updates.join(', ')} WHERE verified_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  // Update record status (for admin use)
  async updateStatus(verifiedId, status) {
    const [result] = await pool.query(
      `
      UPDATE verified_constituent 
      SET record_status = ?, date_updated = NOW()
      WHERE verified_id = ?
    `,
      [status, verifiedId]
    );
    return result.affectedRows > 0;
  },

  // Get statistics
  async getStats() {
    // Get Census statuses and find Active status
    const censusStatuses = await allStatus.getStatusByType('CENSUS');
    const activeStatus = censusStatuses.find(s => s.status.toLowerCase() === 'active');
    const statusId = activeStatus ? activeStatus.stat_id : null;

    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total_verified,
        SUM(CASE WHEN record_status = ? THEN 1 ELSE 0 END) AS active_count,
        SUM(CASE WHEN pwd = 1 THEN 1 ELSE 0 END) AS pwd_count,
        SUM(CASE WHEN senior_citizen = 1 THEN 1 ELSE 0 END) AS senior_count,
        SUM(CASE WHEN registered_voter = 1 THEN 1 ELSE 0 END) AS voter_count
      FROM verified_constituent
    `, [statusId]);
    return rows[0];
  },
};

export default verifiedConstituentModel;
