import pool from '../config/pool.js';

export const createResident = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO residents (first_name, middle_name, last_name, suffix, gender, birth_date, civil_status, nationality, occupation, address_id, contact_number, email, created_at, is_voter)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
        [
            data.first_name,
            data.middle_name,
            data.last_name,
            data.suffix,
            data.gender,
            data.birth_date,
            data.civil_status,
            data.nationality,
            data.occupation,
            data.address_id,
            data.contact_number,
            data.email,
            data.is_voter,
            id
        ]
    );
    return result;
};

