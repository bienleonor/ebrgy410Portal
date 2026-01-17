import pool from "../config/pool.js";
import allStatus from "./statusModel.js";
import verifiedConstituentModel from "./verifiedConstituentModel.js";
import { findOrCreateAddress } from "./addressModel.js";

const censusModel = {
  // Submit census data to staging_census
  async submitCensus(data, collectedBy) {
    // Generate submission ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const submissionId = `CEN-${timestamp}-${random}`;

    // Get "Pending" status from CENSUS type
    const censusStatuses = await allStatus.getStatusByType('CENSUS');
    
    if (!censusStatuses || censusStatuses.length === 0) {
      throw new Error('No CENSUS status types found in database');
    }
    
    const pendingStatus = censusStatuses.find(s => s.status_name && s.status_name.toLowerCase() === 'pending');
    const statusId = pendingStatus ? pendingStatus.stat_id : censusStatuses[0].stat_id; // Use first CENSUS status as fallback

    const [result] = await pool.query(
      `INSERT INTO staging_census (
        submission_id, date_collected, collected_by, status_id,
        first_name, middle_name, last_name, suffix, sex, birthdate,
        birth_city_municipality, birth_province, birth_country,
        nationality, email, household_head, house_number, street_id, brgy_id, notes
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        submissionId,
        collectedBy,
        statusId,
        data.first_name,
        data.middle_name || null,
        data.last_name,
        data.suffix || null,
        data.sex,
        data.birthdate,
        data.birth_city_municipality,
        data.birth_province,
        data.birth_country,
        data.nationality,
        data.email || null,
        data.household_head || false,
        data.house_number,
        data.street_id,
        data.brgy_id,
        data.notes || null
      ]
    );

    return {
      staging_id: result.insertId,
      submission_id: submissionId
    };
  },

  // Get all staging census records
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        sc.*,
        s.street_name,
        b.barangay_name,
        st.status_name
      FROM staging_census sc
      LEFT JOIN streets s ON sc.street_id = s.street_id
      LEFT JOIN barangays b ON sc.brgy_id = b.brgy_id
      LEFT JOIN status st ON sc.status_id = st.stat_id
      ORDER BY sc.date_collected DESC
    `);
    return rows;
  },

  // Get by submission ID
  async getBySubmissionId(submissionId) {
    const [rows] = await pool.query(
      `
      SELECT 
        sc.*,
        s.street_name,
        b.brgy_name,
        st.status_name
      FROM staging_census sc
      LEFT JOIN streets s ON sc.street_id = s.street_id
      LEFT JOIN barangays b ON sc.brgy_id = b.brgy_id
      LEFT JOIN status st ON sc.status_id = st.stat_id
      WHERE sc.submission_id = ?
    `,
      [submissionId]
    );
    return rows[0];
  },

  // Update status
  async updateStatus(stagingId, statusId) {
    const [result] = await pool.query(
      `UPDATE staging_census SET status_id = ? WHERE staging_id = ?`,
      [statusId, stagingId]
    );
    return result.affectedRows > 0;
  },

  // Search staging census
  async search(searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(
      `
      SELECT 
        sc.*,
        s.street_name,
        b.barangay_name,
        st.status_name
      FROM staging_census sc
      LEFT JOIN streets s ON sc.street_id = s.street_id
      LEFT JOIN barangays b ON sc.brgy_id = b.brgy_id
      LEFT JOIN status st ON sc.status_id = st.stat_id
      WHERE sc.first_name LIKE ?
        OR sc.middle_name LIKE ?
        OR sc.last_name LIKE ?
        OR sc.submission_id LIKE ?
        OR sc.email LIKE ?
      ORDER BY sc.date_collected DESC
    `,
      [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
    );
    return rows;
  },

  // Validate census and move to verified_constituent
  async validateCensus(stagingId, validatedBy) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get the staging census record
      const [staging] = await connection.query(
        'SELECT * FROM staging_census WHERE staging_id = ?',
        [stagingId]
      );

      if (!staging || staging.length === 0) {
        throw new Error('Census record not found');
      }

      const record = staging[0];

      // Get active status for verified_constituent
      const statuses = await allStatus.getStatusByType('CONSTITUENT');
      
      if (!statuses || statuses.length === 0) {
        throw new Error('No CONSTITUENT status types found in database');
      }
      
      const activeStatus = statuses.find(s => s.status_name && s.status_name.toLowerCase() === 'active');
      const recordStatusId = activeStatus ? activeStatus.stat_id : statuses[0].stat_id;

      // Find or create address from staging data
      const addr_id = await findOrCreateAddress({
        house_number: record.house_number,
        street_id: record.street_id,
        subdivision: record.subdivision || null,
        brgy_id: record.brgy_id,
        purok_id: record.purok_id || null
      });

      // Insert into verified_constituent with all required fields including addr_id
      const [result] = await connection.query(
        `INSERT INTO verified_constituent (
          first_name, middle_name, last_name, suffix, sex, birthdate,
          birth_city_municipality, birth_province, birth_country,
          nationality, email, is_househead, addr_id, verified_by, verified_date,
          record_status, date_created
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW())`,
        [
          record.first_name,
          record.middle_name,
          record.last_name,
          record.suffix,
          record.sex,
          record.birthdate,
          record.birth_city_municipality,
          record.birth_province,
          record.birth_country,
          record.nationality,
          record.email,
          record.household_head || 0,
          addr_id,
          validatedBy,
          recordStatusId
        ]
      );

      // Update staging record with validated status and link
      const censusStatuses = await allStatus.getStatusByType('CENSUS');
      const validatedStatus = censusStatuses.find(s => s.status_name && s.status_name.toLowerCase() === 'validated');
      const statusId = validatedStatus ? validatedStatus.stat_id : censusStatuses[0].stat_id;

      await connection.query(
        `UPDATE staging_census 
         SET status_id = ?, matched_verified_constituent_id = ? 
         WHERE staging_id = ?`,
        [statusId, result.insertId, stagingId]
      );

      await connection.commit();
      return { success: true, constituent_id: result.insertId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Reject census
  async rejectCensus(stagingId, rejectionNotes) {
    const censusStatuses = await allStatus.getStatusByType('CENSUS');
    const rejectedStatus = censusStatuses.find(s => s.status_name && s.status_name.toLowerCase() === 'rejected');
    const statusId = rejectedStatus ? rejectedStatus.stat_id : censusStatuses[0].stat_id;

    const [result] = await pool.query(
      `UPDATE staging_census 
       SET status_id = ?, notes = CONCAT(COALESCE(notes, ''), '\n[REJECTED]: ', ?) 
       WHERE staging_id = ?`,
      [statusId, rejectionNotes, stagingId]
    );
    return result.affectedRows > 0;
  }
};

export default censusModel;
