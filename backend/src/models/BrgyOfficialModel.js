import pool from "../config/pool.js";

/**
 * Create a new Barangay Official record.
 */
export const createBrgyOfficial = async (data) => {
  const conn = await pool.getConnection();

  try {
    // Log data to check for undefined fields
    console.log('Creating Brgy Official with data:', data);

    // Check if any critical field is missing or undefined
    if (!data.resident_id || !data.position_id || !data.start_term || !data.end_term) {
      throw new Error('Missing required fields: resident_id, position_id, start_term, or end_term');
    }

    // Update the role in the users table
    await conn.execute(
      `UPDATE users 
       SET role_id = 2 
       WHERE user_id = (
         SELECT user_id 
         FROM residents 
         WHERE resident_id = ?
       )`,
      [data.resident_id]  // Use the resident_id from the request body
    );

    // Insert into brgy_officials table with checks for undefined
    await conn.execute(
      `INSERT INTO brgy_officials (resident_id, position_id, start_term, end_term, profile_image, stat_id, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.resident_id,
        data.position_id,
        data.start_term,
        data.end_term,
        data.profile_image || null,  // Handle undefined profile_image
        data.stat_id || null,        // Handle undefined stat_id
        data.remark || null          // Handle undefined remark
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
      bo.resident_id,
      bo.position_id,
      r.first_name,
      r.middle_name,
      r.last_name,
      p.position_name,
      bo.start_term,
      bo.end_term,
      bo.profile_image,
      bo.stat_id,
      s.status as status_name,
      bo.remark
    FROM brgy_officials bo
    JOIN residents r ON bo.resident_id = r.resident_id
    JOIN positions p ON bo.position_id = p.position_id
    LEFT JOIN status s ON bo.stat_id = s.stat_id
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
      bo.resident_id,
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
export const getBrgyOfficialByResidentId = async (residentId) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      bo.brgy_official_no,
      bo.resident_id,
      bo.position_id,
      p.position_name
    FROM brgy_officials bo
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.resident_id = ?
    LIMIT 1
    `,
    [residentId]
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
      `SELECT resident_id, stat_id, end_term 
       FROM brgy_officials 
       WHERE brgy_official_no = ?`,
      [id]
    );

    const { resident_id, stat_id, end_term } = official;

    // Fetch user_id based on resident_id
    const [[user]] = await conn.execute(
      `SELECT user_id FROM residents WHERE resident_id = ?`,
      [resident_id]  // Fetch the user_id using resident_id from the residents table
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

    // Check the term and status
    const today = new Date();
    const end = new Date(end_term);
    const termEnded = end < today;

    let newRole = null;

    // If active and term is not ended
    if (stat_id == 1 && !termEnded) {
      newRole = 2; // admin
    }
    // If term ended or other conditions (suspended/expired)
    if (stat_id == 2 || stat_id == 3 || termEnded) {
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
      bo.resident_id,
      r.first_name,
      r.middle_name,
      r.last_name,
      p.position_name
    FROM brgy_officials bo
    JOIN residents r ON bo.resident_id = r.resident_id
    JOIN positions p ON bo.position_id = p.position_id
    WHERE bo.brgy_official_no = ?
    `,
    [id]
  );

  return rows[0] || null;
};
