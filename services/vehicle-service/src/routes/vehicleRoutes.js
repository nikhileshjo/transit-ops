const express = require('express');
const router = express.Router();

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  createMultipleVehicles,
} = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);

// New route for bulk vehicle creation
router.post('/bulk', createMultipleVehicles);

module.exports = router;