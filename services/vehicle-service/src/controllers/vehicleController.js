const pool = require('../config/db');

// GET /vehicles
const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vehicle.vehicles ORDER BY created_at DESC'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

// GET /vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM vehicle.vehicles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};

// POST /vehicles
const createVehicle = async (req, res) => {
  try {
    const {
      registration_number,
      vehicle_name,
      vehicle_type,
      max_load_capacity,
      odometer,
      acquisition_cost,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO vehicle.vehicles
       (
         registration_number,
         vehicle_name,
         vehicle_type,
         max_load_capacity,
         odometer,
         acquisition_cost,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'Registration number already exists',
      });
    }

    res.status(500).json({ message: 'Error creating vehicle' });
  }
};

// POST /vehicles/bulk
const createMultipleVehicles = async (req, res) => {
  try {
    const vehicles = req.body;

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({
        message: 'Request body must be a non-empty array of vehicles',
      });
    }

    const values = [];
    const placeholders = [];

    vehicles.forEach((vehicle, index) => {
      const {
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status,
      } = vehicle;

      const base = index * 7;

      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
      );

      values.push(
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status
      );
    });

    const query = `
      INSERT INTO vehicle.vehicles
      (
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status
      )
      VALUES ${placeholders.join(', ')}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.status(201).json({
      message: `${result.rows.length} vehicles created successfully`,
      vehicles: result.rows,
    });
  } catch (error) {
    console.error('Error creating multiple vehicles:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'One or more registration numbers already exist',
      });
    }

    res.status(500).json({
      message: 'Error creating multiple vehicles',
    });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  createMultipleVehicles,
};