import pool from "../config/pool.js";
import allStatus from "./statusModel.js";

/**
 * Create a new Barangay Official record.
 */
export const createBrgyOfficial = async (data) => {
  const conn = await pool.getConnection();

  try {
    // Log data to check for undefined fields
    console.log('Creating Brgy Official with data:', data);

    // Check if any critical field is missing or undefined
    if (!data.verified_id || !data.position_id || !data.start_term || !data.end_term) {
      throw new Error('Missing required fields: verified_id, position_id, start_term, or end_term');
    }

    // Validate stat_id if provided - must be OFFICIAL type
    if (data.stat_id) {
      const validStatus = await allStatus.getStatusById(data.stat_id);
      if (!validStatus || validStatus.status_type !== 'OFFICIAL') {
        throw new Error('Invalid status. Only OFFICIAL status types are allowed.');
      }
    }

    // Update the role in the users table
    await conn.execute(
      `UPDATE users 
       SET role_id = 2 
       WHERE verified_id = ?`,
      [data.verified_id]
    );

    // Insert into brgy_officials table with checks for undefined
    await conn.execute(
      `INSERT INTO brgy_officials (verified_id, position_id, start_term, end_term, profile_image, stat_id, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.verified_id,
        data.position_id,
        data.start_term,
        data.end_term,
        data.profile_image || null,  // Handle undefined profile_image
        data.stat_id || null,        // Handle undefined stat_id
        data.remark
      ]
    );

    console.log('Barangay official created and user role updated.');
  } catch (err) {
    console.error('Error creating barangay official:', err.message);
  }
};


/**
 * Get all barangay officials with their positions.
 */
export const getAllBrgyOfficials = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      bo.brgy_official_no,
      bo.verified_id,
      bo.position_id,
      vc.first_name,
      vc.middle_name,
      vc.last_name,
      p.position_name,
      bo.start_term,
      bo.end_term,
      bo.profile_image,
      bo.stat_id,
      s.status_name,
      bo.remark
    FROM brgy_officials bo
    JOIN verified_constituent vc ON bo.verified_id = vc.verified_id
    JOIN positions p ON bo.position_id = p.position_id
    LEFT JOIN status s ON bo.stat_id = s.stat_id AND s.status_type = 'OFFICIAL'
  `);
  return rows;
};

/**
 * Get barangay official by primary key (brgy_official_no)
 */
export const getBrgyOfficialById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.verified_id,
      p.position_name,
      bo.start_term,
      bo.end_term,
      bo.profile_image,
      bo.stat_id,
      bo.remark
    FROM brgy_officials bo
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.brgy_official_no = ?
    `,
    [id]
  );
  return rows[0] || null;
};

/**
 * Get barangay official by resident ID (used for document approval)
 */
export const getBrgyOfficialByResidentId = async (verified_id) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.verified_id,
      bo.position_id,
      p.position_name
    FROM brgy_officials bo
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.verified_id = ?
    LIMIT 1
    `,
    [verified_id]
  );
  return rows[0] || null;
};

/**
 * Update barangay official record
 */
export const updateBrgyOfficial = async (id, data) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Validate stat_id if provided - must be OFFICIAL type
    if (data.stat_id !== undefined) {
      const validStatus = await allStatus.getStatusById(data.stat_id);
      if (!validStatus || validStatus.status_type !== 'OFFICIAL') {
        throw new Error("Invalid status. Only OFFICIAL status types are allowed.");
      }
    }

    // Build dynamic update for the brgy_officials table
    const fields = [];
    const values = [];

    const allowedFields = [
      "position_id",
      "start_term",
      "end_term",  // Updating end_term if required
      "profile_image",
      "stat_id",
      "remark",
    ];

    // Check if the fields are present in the data and add them to the update query
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        if (field === "end_term" && data.stat_id === 2) {
          // If stat_id is 2 (Term Ended), set the end_term to current date
          values.push(new Date());
        } else {
          values.push(data[field]);
        }
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE brgy_officials
      SET ${fields.join(", ")}
      WHERE brgy_official_no = ?
    `;
    values.push(id); // The official ID to match in the WHERE clause

    console.log("UPDATE query:", query);  // Debugging: show the query
    console.log("UPDATE values:", values);  // Debugging: show the values

    await conn.execute(query, values);

    // Fetch updated row to get the user_id for role modification
    const [[official]] = await conn.execute(
      `SELECT verified_id, stat_id, end_term
       FROM brgy_officials 
       WHERE brgy_official_no = ?`,
      [id]
    );

    const { verified_id, stat_id, end_term } = official;

    // Get status details from statusModel
    const statusDetails = await allStatus.getStatusById(stat_id);
    const status_name = statusDetails?.status || null;

    // Fetch user_id based on verified_id from users table
    const [[user]] = await conn.execute(
      `SELECT user_id FROM users WHERE verified_id = ?`,
      [verified_id]
    );

    if (!user) throw new Error("User not found");

    const { user_id } = user;

    // Fetch user role from the users table
    const [[userRole]] = await conn.execute(
      `SELECT role_id FROM users WHERE user_id = ?`,
      [user_id]  // Use the user_id to fetch role_id
    );

    if (!userRole) throw new Error("User role not found");

    // 🚫 Don't update role if superadmin
    if (userRole.role_id === 1) {
      await conn.commit();
      return { message: "Superadmin role protected. Official updated." };
    }

    // Check the term and status (using status_name from statusModel)
    const today = new Date();
    const end = new Date(end_term);
    const termEnded = end < today;

    let newRole = null;

    // Get all OFFICIAL statuses to determine active/inactive
    const officialStatuses = await allStatus.getStatusByType('OFFICIAL');
    const activeStatuses = officialStatuses
      .filter(s => ['Active', 'Serving'].includes(s.status))
      .map(s => s.status);
    const inactiveStatuses = officialStatuses
      .filter(s => ['Term Ended', 'Suspended', 'Resigned'].includes(s.status))
      .map(s => s.status);

    // If active status and term is not ended
    if (activeStatuses.includes(status_name) && !termEnded) {
      newRole = 2; // admin
    }
    // If term ended or inactive status
    else if (inactiveStatuses.includes(status_name) || termEnded) {
      newRole = 3; // resident
    }

    // If a new role is determined, update the user's role
    if (newRole !== null) {
      await conn.execute(
        `UPDATE users 
         SET role_id = ? 
         WHERE user_id = ?`,
        [newRole, user_id]  // Update role based on user_id
      );
    }

    await conn.commit();

    return { message: "Official updated successfully" };

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

/**
 * Delete barangay official by ID
 */
export const deleteBrgyOfficial = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM brgy_officials WHERE brgy_official_no = ?`,
    [id]
  );
  return result;
};


export const getFullBrgyOfficialById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.verified_id,
      vc.first_name,
      vc.middle_name,
      vc.last_name,
      p.position_name
    FROM brgy_officials bo
    JOIN verified_constituent vc ON bo.verified_id = vc.verified_id
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.brgy_official_no = ?
    `,
    [id]
  );

  return rows[0] || null;
};
