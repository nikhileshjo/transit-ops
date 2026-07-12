const pool = require('../config/db');

const validateDispatch = async ({
  vehicle_id,
  driver_id,
  planned_start,
  planned_end,
}) => {
  // Check vehicle exists
  const vehicleResult = await pool.query(
    'SELECT * FROM vehicle.vehicles WHERE id = $1',
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  // Check driver exists and license is valid
  const driverResult = await pool.query(
    'SELECT * FROM driver.drivers WHERE id = $1',
    [driver_id]
  );

  if (driverResult.rows.length === 0) {
    throw new Error('Driver not found');
  }

  const driver = driverResult.rows[0];

  if (new Date(driver.license_expiry_date) < new Date(planned_start)) {
    throw new Error('Driver license has expired');
  }

  // Check vehicle trip overlap
  const vehicleTripResult = await pool.query(
    `SELECT 1
     FROM trip.trips
     WHERE vehicle_id = $1
       AND status IN ('Planned','Dispatched','In Progress')
       AND planned_start < $3
       AND planned_end > $2`,
    [vehicle_id, planned_start, planned_end]
  );

  if (vehicleTripResult.rows.length > 0) {
    throw new Error('Vehicle is already assigned for this time range');
  }

  // Check driver trip overlap
  const driverTripResult = await pool.query(
    `SELECT 1
     FROM trip.trips
     WHERE driver_id = $1
       AND status IN ('Planned','Dispatched','In Progress')
       AND planned_start < $3
       AND planned_end > $2`,
    [driver_id, planned_start, planned_end]
  );

  if (driverTripResult.rows.length > 0) {
    throw new Error('Driver is already assigned for this time range');
  }

  // Check driver availability roster
  const availabilityResult = await pool.query(
    `SELECT 1
     FROM driver.driver_availability_roster
     WHERE driver_id = $1
       AND available_from <= $2
       AND available_to >= $3
       AND is_deleted = FALSE`,
    [driver_id, planned_start, planned_end]
  );

  if (availabilityResult.rows.length === 0) {
    throw new Error('Driver is not available in the roster for this time range');
  }

  return true;
};

module.exports = {
  validateDispatch,
};