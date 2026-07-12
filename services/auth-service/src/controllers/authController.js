const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, roles = [] } = req.body;

    console.log("Request body:", req.body);
    console.log("Roles received:", roles);

    const existingUser = await pool.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO auth.users
       (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, password_hash]
    );

    const user = userResult.rows[0];

    if (roles.length > 0) {
    for (const roleName of roles) {
    console.log("Processing role:", roleName);

    const roleResult = await pool.query(
        "SELECT id FROM auth.roles WHERE role_name = $1",
        [roleName]
    );

    console.log("Role lookup:", roleResult.rows);

    if (roleResult.rows.length === 0) {
        console.log("Role not found:", roleName);
        continue;
    }

    const insertResult = await pool.query(
        `INSERT INTO auth.user_roles(user_id, role_id)
         VALUES($1, $2)
         RETURNING *`,
        [user.id, roleResult.rows[0].id]
    );

    console.log("Inserted:", insertResult.rows);
}
}

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error registering user',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash,
              array_agg(r.role_name) AS roles
       FROM auth.users u
       LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
       LEFT JOIN auth.roles r ON ur.role_id = r.id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        roles: user.roles.filter(Boolean),
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.filter(Boolean),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error logging in',
    });
  }
};

module.exports = {
  signup,
  login,
};