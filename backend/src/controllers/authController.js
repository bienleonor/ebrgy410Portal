import bcrypt from 'bcryptjs';
import { findRoleNameById } from '../models/RoleModel.js';
import { findUserByUsername } from '../models/User.js';
import { createUser } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';


import pool from '../config/pool.js';

const roleMap = {
  1: 'SuperAdmin',
  2: 'Chairman',
  3: 'Councilor',
  4: 'Secretary',
  5: 'Treasurer',
  6: 'Staff',
  7: 'Resident'
};


export const signup = async (req, res) => {
  try {
    let { username, password, email, role } = req.body;

    role = parseInt(role, 10);
    if (!role || isNaN(role) || !roleMap[role]) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const roleExists = await pool.execute('SELECT role_id FROM role WHERE role_id = ?', [role]);
    if (roleExists[0].length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      username,
      password: hashedPassword,
      email,
      role
    });

    res.status(201).json({ message: 'Account created successfully', userId });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.user_id);

    const roleName = await findRoleNameById(user.role_id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: roleName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
