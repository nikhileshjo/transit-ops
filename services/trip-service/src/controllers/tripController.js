const pool = require('../config/db');
const { validateDispatch } = require('../services/dispatchOrchestrator');

const getTrips = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, v.vehicle_name, d.name AS driver_name
       FROM trip.trips t
       JOIN vehicle.vehicles v ON t.vehicle_id = v.id
       JOIN driver.drivers d ON t.driver_id = d.id
       ORDER BY t.created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

const createTrip = async (req, res) => {
  try {
    const tripData = req.body;

    await validateDispatch(tripData);

    const {
      vehicle_id,
      driver_id,
      source,
      destination,
      cargo_weight,
      planned_start,
      planned_end,
      status,
    } = tripData;

    const result = await pool.query(
      `INSERT INTO trip.trips
       (
         vehicle_id,
         driver_id,
         source,
         destination,
         cargo_weight,
         planned_start,
         planned_end,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        vehicle_id,
        driver_id,
        source,
        destination,
        cargo_weight,
        planned_start,
        planned_end,
        status || 'Planned',
      ]
    );

    res.status(201).json({
      message: 'Trip created successfully',
      trip: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message || 'Error creating trip',
    });
  }
};

const patchTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No fields provided for update',
      });
    }

    // Get existing trip
    const existingResult = await pool.query(
      'SELECT * FROM trip.trips WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }

    const existingTrip = existingResult.rows[0];

    // Merge existing values with updates
    const mergedTrip = {
      vehicle_id: updates.vehicle_id || existingTrip.vehicle_id,
      driver_id: updates.driver_id || existingTrip.driver_id,
      planned_start:
        updates.planned_start || existingTrip.planned_start,
      planned_end:
        updates.planned_end || existingTrip.planned_end,
    };

    // Validate planned dates
    if (
      new Date(mergedTrip.planned_start) >=
      new Date(mergedTrip.planned_end)
    ) {
      return res.status(400).json({
        message: 'Planned start must be before planned end',
      });
    }

    // Validate dispatch rules if key fields changed
    const dispatchFields = [
      'vehicle_id',
      'driver_id',
      'planned_start',
      'planned_end',
    ];

    const shouldValidateDispatch = dispatchFields.some(
      (field) => updates[field] !== undefined
    );

    if (shouldValidateDispatch) {
      // Check vehicle exists
      const vehicleResult = await pool.query(
        'SELECT id FROM vehicle.vehicles WHERE id = $1',
        [mergedTrip.vehicle_id]
      );

      if (vehicleResult.rows.length === 0) {
        return res.status(400).json({
          message: 'Vehicle not found',
        });
      }

      // Check driver exists
      const driverResult = await pool.query(
        'SELECT * FROM driver.drivers WHERE id = $1',
        [mergedTrip.driver_id]
      );

      if (driverResult.rows.length === 0) {
        return res.status(400).json({
          message: 'Driver not found',
        });
      }

      const driver = driverResult.rows[0];

      // Check driver license expiry
      if (
        new Date(driver.license_expiry_date) <
        new Date(mergedTrip.planned_start)
      ) {
        return res.status(400).json({
          message: 'Driver license has expired',
        });
      }

      // Check vehicle overlap excluding current trip
      const vehicleOverlap = await pool.query(
        `SELECT 1
         FROM trip.trips
         WHERE vehicle_id = $1
           AND id <> $2
           AND status IN ('Planned','Dispatched','In Progress')
           AND planned_start < $4
           AND planned_end > $3`,
        [
          mergedTrip.vehicle_id,
          id,
          mergedTrip.planned_start,
          mergedTrip.planned_end,
        ]
      );

      if (vehicleOverlap.rows.length > 0) {
        return res.status(400).json({
          message:
            'Vehicle is already assigned for this time range',
        });
      }

      // Check driver overlap excluding current trip
      const driverOverlap = await pool.query(
        `SELECT 1
         FROM trip.trips
         WHERE driver_id = $1
           AND id <> $2
           AND status IN ('Planned','Dispatched','In Progress')
           AND planned_start < $4
           AND planned_end > $3`,
        [
          mergedTrip.driver_id,
          id,
          mergedTrip.planned_start,
          mergedTrip.planned_end,
        ]
      );

      if (driverOverlap.rows.length > 0) {
        return res.status(400).json({
          message:
            'Driver is already assigned for this time range',
        });
      }

      // Check driver availability roster
      const availabilityResult = await pool.query(
        `SELECT 1
         FROM driver.driver_availability_roster
         WHERE driver_id = $1
           AND available_from <= $2
           AND available_to >= $3
           AND is_deleted = FALSE`,
        [
          mergedTrip.driver_id,
          mergedTrip.planned_start,
          mergedTrip.planned_end,
        ]
      );

      if (availabilityResult.rows.length === 0) {
        return res.status(400).json({
          message:
            'Driver is not available in the roster for this time range',
        });
      }
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    values.push(id);

    const query = `
      UPDATE trip.trips
      SET ${setClause},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      message: 'Trip updated successfully',
      trip: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating trip',
    });
  }
};

module.exports = {
  getTrips,
  createTrip,
  patchTrip,
};