// src/models/householdMemberModel.js
import pool from "../config/pool.js";

/**
 * Add member to household
 */
export const addHouseholdMember = async (data) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if resident is already in another household
    const [existing] = await connection.execute(
      `SELECT household_id 
       FROM household_members 
       WHERE resident_id = ? AND date_left IS NULL`,
      [data.resident_id]
    );

    if (existing.length > 0) {
      throw new Error("Resident is already a member of another household");
    }

    // If role is Head, check if household already has a head
    if (data.role_in_household === "Head") {
      const [existingHead] = await connection.execute(
        `SELECT id 
         FROM household_members 
         WHERE household_id = ? AND role_in_household = 'Head' AND date_left IS NULL`,
        [data.household_id]
      );

      if (existingHead.length > 0) {
        throw new Error("Household already has a Head. Please change the existing Head's role first.");
      }
    }

    // Add member
    const [result] = await connection.execute(
      `INSERT INTO household_members 
        (household_id, resident_id, role_in_household, date_joined)
       VALUES (?, ?, ?, NOW())`,
      [data.household_id, data.resident_id, data.role_in_household]
    );

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Update household member role
 */
export const updateHouseholdMember = async (memberId, roleInHousehold) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get member info
    const [member] = await connection.execute(
      `SELECT household_id, role_in_household 
       FROM household_members 
       WHERE id = ?`,
      [memberId]
    );

    if (member.length === 0) {
      throw new Error("Member not found");
    }

    // If changing to Head, check if household already has a head
    if (roleInHousehold === "Head" && member[0].role_in_household !== "Head") {
      const [existingHead] = await connection.execute(
        `SELECT id 
         FROM household_members 
         WHERE household_id = ? AND role_in_household = 'Head' AND date_left IS NULL AND id != ?`,
        [member[0].household_id, memberId]
      );

      if (existingHead.length > 0) {
        throw new Error("Household already has a Head");
      }
    }

    // Update role
    const [result] = await connection.execute(
      `UPDATE household_members 
       SET role_in_household = ? 
       WHERE id = ?`,
      [roleInHousehold, memberId]
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Remove member from household (soft delete)
 */
export const removeHouseholdMember = async (memberId) => {
  const [result] = await pool.execute(
    `UPDATE household_members 
     SET date_left = NOW() 
     WHERE id = ?`,
    [memberId]
  );
  return result.affectedRows > 0;
};

/**
 * Hard delete member (complete removal)
 */
export const deleteHouseholdMember = async (memberId) => {
  const [result] = await pool.execute(
    `DELETE FROM household_members WHERE id = ?`,
    [memberId]
  );
  return result.affectedRows > 0;
};

/**
 * Get member by ID
 */
export const getHouseholdMemberById = async (memberId) => {
  const [rows] = await pool.execute(
    `SELECT 
      hm.*,
      r.first_name,
      r.middle_name,
      r.last_name
    FROM household_members hm
    JOIN residents r ON hm.resident_id = r.resident_id
    WHERE hm.id = ?`,
    [memberId]
  );
  return rows[0] || null;
};

/**
 * Transfer member to different household
 */
export const transferHouseholdMember = async (memberId, newHouseholdId) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Mark as left from current household
    await connection.execute(
      `UPDATE household_members 
       SET date_left = NOW() 
       WHERE id = ?`,
      [memberId]
    );

    // Get member info
    const [member] = await connection.execute(
      `SELECT resident_id, role_in_household 
       FROM household_members 
       WHERE id = ?`,
      [memberId]
    );

    if (member.length === 0) {
      throw new Error("Member not found");
    }

    // Add to new household (role defaults to 'Other' for transfer)
    await connection.execute(
      `INSERT INTO household_members 
        (household_id, resident_id, role_in_household, date_joined)
       VALUES (?, ?, 'Other', NOW())`,
      [newHouseholdId, member[0].resident_id]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};