import pool from "../config/pool.js";

/**
 * Get all households with members and address info
 */
export const getAllHouseholds = async () => {
  const query = `
    SELECT 
      h.id,
      h.address_id,
      h.created_by,
      h.date_created,
      CONCAT(a.house_number, ' ', a.street, 
             COALESCE(CONCAT(', ', a.subdivision), ''), 
             ', ', b.barangay_name) AS full_address,
      COUNT(hm.id) AS member_count,
      MAX(CASE WHEN hm.role_in_household = 'Head' 
          THEN CONCAT(r.first_name, ' ', r.last_name) 
          END) AS household_head
    FROM households h
    LEFT JOIN addresses a ON h.address_id = a.addr_id
    LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
    LEFT JOIN household_members hm ON h.id = hm.household_id AND hm.date_left IS NULL
    LEFT JOIN residents r ON hm.resident_id = r.resident_id
    GROUP BY h.id
    ORDER BY h.date_created DESC
  `;

  const [households] = await pool.execute(query);

  // Get members for each household
  for (let household of households) {
    const [members] = await pool.execute(
      `SELECT 
        hm.id,
        hm.household_id,
        hm.resident_id,
        hm.role_in_household,
        hm.date_joined,
        hm.date_left,
        r.first_name,
        r.middle_name,
        r.last_name,
        r.gender,
        r.birth_date
      FROM household_members hm
      JOIN residents r ON hm.resident_id = r.resident_id
      WHERE hm.household_id = ? AND hm.date_left IS NULL
      ORDER BY 
        CASE hm.role_in_household
          WHEN 'Head' THEN 1
          WHEN 'Spouse' THEN 2
          WHEN 'Child' THEN 3
          WHEN 'Relative' THEN 4
          WHEN 'Boarder' THEN 5
          ELSE 6
        END,
        r.birth_date`,
      [household.id]
    );
    household.members = members;
  }

  return households;
};

/**
 * Get household by ID with members
 */
export const getHouseholdById = async (householdId) => {
  const query = `
    SELECT 
      h.id,
      h.address_id,
      h.created_by,
      h.date_created,
      CONCAT(a.house_number, ' ', a.street, 
             COALESCE(CONCAT(', ', a.subdivision), ''), 
             ', ', b.barangay_name) AS full_address,
      a.house_number,
      a.street,
      a.subdivision,
      b.barangay_name,
      COUNT(hm.id) AS member_count
    FROM households h
    LEFT JOIN addresses a ON h.address_id = a.addr_id
    LEFT JOIN barangays b ON a.brgy_id = b.brgy_id
    LEFT JOIN household_members hm ON h.id = hm.household_id AND hm.date_left IS NULL
    WHERE h.id = ?
    GROUP BY h.id
  `;

  const [rows] = await pool.execute(query, [householdId]);
  
  if (rows.length === 0) {
    return null;
  }

  const household = rows[0];

  // Get members
  const [members] = await pool.execute(
    `SELECT 
      hm.id,
      hm.household_id,
      hm.resident_id,
      hm.role_in_household,
      hm.date_joined,
      hm.date_left,
      r.first_name,
      r.middle_name,
      r.last_name,
      r.gender,
      r.birth_date
    FROM household_members hm
    JOIN residents r ON hm.resident_id = r.resident_id
    WHERE hm.household_id = ? AND hm.date_left IS NULL
    ORDER BY 
      CASE hm.role_in_household
        WHEN 'Head' THEN 1
        WHEN 'Spouse' THEN 2
        WHEN 'Child' THEN 3
        WHEN 'Relative' THEN 4
        WHEN 'Boarder' THEN 5
        ELSE 6
      END`,
    [householdId]
  );

  household.members = members;
  return household;
};

/**
 * Create new household
 */
export const createHousehold = async (addressId, createdBy = null) => {
  const [result] = await pool.execute(
    `INSERT INTO households (address_id, created_by, date_created)
     VALUES (?, ?, NOW())`,
    [addressId, createdBy]
  );
  return result.insertId;
};

/**
 * Update household
 */
export const updateHousehold = async (householdId, addressId) => {
  const [result] = await pool.execute(
    `UPDATE households SET address_id = ? WHERE id = ?`,
    [addressId, householdId]
  );
  return result.affectedRows > 0;
};

/**
 * Delete household
 */
export const deleteHousehold = async (householdId) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Delete all members first
    await connection.execute(
      `DELETE FROM household_members WHERE household_id = ?`,
      [householdId]
    );

    // Delete household
    const [result] = await connection.execute(
      `DELETE FROM households WHERE id = ?`,
      [householdId]
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
 * Get household statistics
 */
export const getHouseholdStatistics = async () => {
  const query = `
    SELECT 
      COUNT(DISTINCT h.id) as total_households,
      COUNT(hm.id) as total_members,
      AVG(member_counts.count) as avg_household_size
    FROM households h
    LEFT JOIN household_members hm ON h.id = hm.household_id AND hm.date_left IS NULL
    LEFT JOIN (
      SELECT household_id, COUNT(*) as count
      FROM household_members
      WHERE date_left IS NULL
      GROUP BY household_id
    ) member_counts ON h.id = member_counts.household_id
  `;

  const [rows] = await pool.execute(query);
  return rows[0];
};