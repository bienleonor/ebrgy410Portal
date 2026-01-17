import pool from "../config/pool.js";

//REGIONS
export const getRegions = async () => {
  const [rows] = await pool.execute(`SELECT * FROM regions ORDER BY name ASC`);
  return rows;
};

export const createRegion = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO regions (name, code) VALUES (?, ?)`,
    [data.name, data.code]
  );
  return result.insertId;
};

export const updateRegion = async (id, data) => {
  await pool.execute(`UPDATE regions SET name = ?, code = ? WHERE region_id = ?`, [
    data.name,
    data.code,
    id,
  ]);
};

export const deleteRegion = async (id) => {
  await pool.execute(`DELETE FROM regions WHERE region_id = ?`, [id]);
};

//PROVINCES
export const getProvinces = async () => {
  const [rows] = await pool.execute(
    `SELECT p.*, r.name AS region_name
     FROM provinces p
     JOIN regions r ON p.region_id = r.region_id 
     ORDER BY p.name ASC`
  );
  return rows;
};

export const createProvince = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO provinces (name, region_id) VALUES (?, ?)`,
    [data.name, data.region_id]
  );
  return result.insertId;
};

export const updateProvince = async (id, data) => {
  await pool.execute(
    `UPDATE provinces SET name = ?, region_id = ? WHERE prov_id = ?`,
    [data.name, data.region_id, id]
  );
};

export const deleteProvince = async (id) => {
  await pool.execute(`DELETE FROM provinces WHERE prov_id = ?`, [id]);
};

//CITIES
export const getCities = async () => {
  const [rows] = await pool.execute(
    `SELECT c.*, p.name AS province_name
     FROM cities c
     JOIN provinces p ON c.province_id = p.prov_id
     ORDER BY c.name ASC`
  );
  return rows;
};

export const createCity = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO cities (name, province_id) VALUES (?, ?)`,
    [data.name, data.province_id]
  );
  return result.insertId;
};

export const updateCity = async (id, data) => {
  await pool.execute(
    `UPDATE cities SET name = ?, province_id = ? WHERE city_id = ?`,
    [data.name, data.province_id, id]
  );
};

export const deleteCity = async (id) => {
  await pool.execute(`DELETE FROM cities WHERE city_id = ?`, [id]);
};

//ZONES
export const getZones = async () => {
  const [rows] = await pool.execute(`SELECT * FROM zones ORDER BY zone_number ASC`);
  return rows;
};

export const getZoneById = async (id) => {
  const [rows] = await pool.execute(`SELECT * FROM zones WHERE zone_id = ?`, [id]);
  return rows[0];
};

export const createZone = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO zones (zone_number) VALUES (?)`,
    [data.zone_number]
  );
  return result.insertId;
};

export const updateZone = async (id, data) => {
  await pool.execute(
    `UPDATE zones SET zone_number = ? WHERE zone_id = ?`,
    [data.zone_number, id]
  );
};

export const deleteZone = async (id) => {
  await pool.execute(`DELETE FROM zones WHERE zone_id = ?`, [id]);
};

//BARANGAYS
export const getBarangays = async () => {
  const [rows] = await pool.execute(
    `SELECT b.*, z.zone_number, c.name AS city_name
     FROM barangays b
     JOIN zones z ON b.zone_id = z.zone_id
     JOIN cities c ON b.city_id = c.city_id
     ORDER BY b.barangay_name ASC`
  );
  return rows;
};

export const createBarangay = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO barangays (barangay_name, zone_id, district, zipcode, city_id)
     VALUES (?, ?, ?, ?, ?)`,
    [data.barangay_name, data.zone_id, data.district, data.zipcode, data.city_id]
  );
  return result.insertId;
};

export const updateBarangay = async (id, data) => {
  await pool.execute(
    `UPDATE barangays 
     SET barangay_name = ?, zone_id = ?, district = ?, zipcode = ?, city_id = ?
     WHERE brgy_id = ?`,
    [data.barangay_name, data.zone_id, data.district, data.zipcode, data.city_id, id]
  );
};

export const deleteBarangay = async (id) => {
  await pool.execute(`DELETE FROM barangays WHERE brgy_id = ?`, [id]);
};

//PUROK - SITIO
export const getPuroks = async () => {
  const [rows] = await pool.execute(`SELECT * FROM purok_sitio ORDER BY purok_name ASC`);
  return rows;
};

export const getPurokById = async (id) => {
  const [rows] = await pool.execute(`SELECT * FROM purok_sitio WHERE purok_id = ?`, [id]);
  return rows[0];
};

export const createPurok = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO purok_sitio (purok_name, sitio_name) VALUES (?, ?)`,
    [data.purok_name, data.sitio_name]
  );
  return result.insertId;
};

export const updatePurok = async (id, data) => {
  await pool.execute(
    `UPDATE purok_sitio SET purok_name = ?, sitio_name = ? WHERE purok_id = ?`,
    [data.purok_name, data.sitio_name, id]
  );
};

export const deletePurok = async (id) => {
  await pool.execute(`DELETE FROM purok_sitio WHERE purok_id = ?`, [id]);
};

//STREETS
export const getStreets = async () => {
  const [rows] = await pool.execute(`SELECT * FROM streets ORDER BY street_name ASC`);
  return rows;
};

export const getStreetById = async (id) => {
  const [rows] = await pool.execute(`SELECT * FROM streets WHERE street_id = ?`, [id]);
  return rows[0];
};

export const createStreet = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO streets (street_name) VALUES (?)`,
    [data.street_name]
  );
  return result.insertId;
};

export const updateStreet = async (id, data) => {
  await pool.execute(
    `UPDATE streets SET street_name = ? WHERE street_id = ?`,
    [data.street_name, id]
  );
};

export const deleteStreet = async (id) => {
  await pool.execute(`DELETE FROM streets WHERE street_id = ?`, [id]);
};

//ADDRESSES
export const getAddresses = async () => {
  const [rows] = await pool.execute(`
    SELECT a.addr_id, a.house_number, a.street_id, s.street_name, a.subdivision, a.brgy_id, a.purok_id,
           b.barangay_name, z.zone_number, c.name AS city_name, p.name AS province_name, r.name AS region_name
    FROM addresses a
    LEFT JOIN streets s ON a.street_id = s.street_id
    JOIN barangays b ON a.brgy_id = b.brgy_id
    JOIN cities c ON b.city_id = c.city_id
    JOIN provinces p ON c.province_id = p.prov_id
    JOIN regions r ON p.region_id = r.region_id
    JOIN zones z ON b.zone_id = z.zone_id
    ORDER BY a.addr_id DESC
  `);
  return rows;
};

export const getAddressById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT a.addr_id, a.house_number, a.street_id, s.street_name, a.subdivision, a.brgy_id, a.purok_id,
           b.barangay_name, z.zone_number, c.name AS city_name, p.name AS province_name, r.name AS region_name
    FROM addresses a
    LEFT JOIN streets s ON a.street_id = s.street_id
    JOIN barangays b ON a.brgy_id = b.brgy_id
    JOIN cities c ON b.city_id = c.city_id
    JOIN provinces p ON c.province_id = p.prov_id
    JOIN regions r ON p.region_id = r.region_id
    JOIN zones z ON b.zone_id = z.zone_id
    WHERE a.addr_id = ?
    `,
    [id]
  );
  return rows[0];
};

export const createAddress = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO addresses (house_number, street_id, subdivision, brgy_id, purok_id)
     VALUES (?, ?, ?, ?, ?)`,
    [data.house_number, data.street_id, data.subdivision || null, data.brgy_id, data.purok_id || null]
  );
  return result.insertId;
};

export const updateAddress = async (id, data) => {
  await pool.execute(
    `UPDATE addresses
     SET house_number = ?, street_id = ?, subdivision = ?, brgy_id = ?, purok_id = ?
     WHERE addr_id = ?`,
    [data.house_number, data.street_id, data.subdivision || null, data.brgy_id, data.purok_id || null, id]
  );
};

export const deleteAddress = async (id) => {
  await pool.execute(`DELETE FROM addresses WHERE addr_id = ?`, [id]);
};

export const findOrCreateAddress = async (data) => {
  // Check if address exists
  const [rows] = await pool.execute(
    `SELECT addr_id FROM addresses 
     WHERE house_number = ? AND street_id = ? AND subdivision <=> ? 
       AND brgy_id = ? AND purok_id <=> ? 
     LIMIT 1`,
    [data.house_number, data.street_id, data.subdivision || null, data.brgy_id, data.purok_id || null]
  );

  if (rows.length > 0) {
    // Address exists, return existing ID
    return rows[0].addr_id;
  }

  // Otherwise, insert new address
  const [result] = await pool.execute(
    `INSERT INTO addresses (house_number, street_id, subdivision, brgy_id, purok_id)
     VALUES (?, ?, ?, ?, ?)`,
    [data.house_number, data.street_id, data.subdivision ?? null, data.brgy_id, data.purok_id ?? null]
  );

  return result.insertId;
};