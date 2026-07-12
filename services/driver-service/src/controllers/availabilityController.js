const pool = require('../config/db');

// GET /drivers/availability
const getAvailability = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, d.name
       FROM driver.driver_availability_roster r
       JOIN driver.drivers d ON r.driver_id = d.id
       WHERE r.is_deleted = FALSE
       ORDER BY r.available_from`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

// POST /drivers/availability
const createAvailability = async (req, res) => {
  try {
    const {
      driver_id,
      available_from,
      available_to,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO driver.driver_availability_roster
       (driver_id, available_from, available_to)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [driver_id, available_from, available_to]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.constraint === 'no_overlapping_driver_availability') {
      return res.status(400).json({
        message: 'Driver already has availability in this time range',
      });
    }

    res.status(500).json({ message: 'Error creating availability' });
  }
};

// PATCH /drivers/availability/:id/delete
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE driver.driver_availability_roster
       SET is_deleted = TRUE,
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = FALSE
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Availability not found or already deleted',
      });
    }

    res.status(200).json({
      message: 'Availability marked as expired/deleted',
      availability: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting availability',
    });
  }
};

module.exports = {
  getAvailability,
  createAvailability,
  deleteAvailability,
};