const pool = require('../config/db');

// GET /drivers
const getDrivers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM driver.drivers ORDER BY created_at DESC'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};

// POST /drivers
const createDriver = async (req, res) => {
  try {
    const {
      name,
      license_number,
      license_category,
      license_expiry_date,
      contact_number,
      safety_score,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO driver.drivers
       (
         name,
         license_number,
         license_category,
         license_expiry_date,
         contact_number,
         safety_score,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        license_number,
        license_category,
        license_expiry_date,
        contact_number,
        safety_score,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'License number already exists',
      });
    }

    res.status(500).json({ message: 'Error creating driver' });
  }
};

// POST /drivers/bulk
const createMultipleDrivers = async (req, res) => {
  try {
    const drivers = req.body;

    if (!Array.isArray(drivers) || drivers.length === 0) {
      return res.status(400).json({
        message: 'Request body must be a non-empty array of drivers',
      });
    }

    const values = [];
    const placeholders = [];

    drivers.forEach((driver, index) => {
      const {
        name,
        license_number,
        license_category,
        license_expiry_date,
        contact_number,
        safety_score,
        status,
      } = driver;

      const base = index * 7;

      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
      );

      values.push(
        name,
        license_number,
        license_category,
        license_expiry_date,
        contact_number,
        safety_score,
        status
      );
    });

    const query = `
      INSERT INTO driver.drivers
      (
        name,
        license_number,
        license_category,
        license_expiry_date,
        contact_number,
        safety_score,
        status
      )
      VALUES ${placeholders.join(', ')}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.status(201).json({
      message: `${result.rows.length} drivers created successfully`,
      drivers: result.rows,
    });
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'One or more license numbers already exist',
      });
    }

    res.status(500).json({
      message: 'Error creating multiple drivers',
    });
  }
};

// PATCH /drivers/:id
const patchDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No fields provided for update',
      });
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    values.push(id);

    const query = `
      UPDATE driver.drivers
      SET ${setClause},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      message: 'Driver updated successfully',
      driver: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'License number already exists',
      });
    }

    res.status(500).json({
      message: 'Error updating driver',
    });
  }
};

module.exports = {
  getDrivers,
  createDriver,
  createMultipleDrivers,
  patchDriver,
};