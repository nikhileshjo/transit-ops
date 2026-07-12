const express = require('express');
const router = express.Router();

const {
  getDrivers,
  createDriver,
  createMultipleDrivers,
  patchDriver,
} = require('../controllers/driverController');

router.get('/', getDrivers);
router.post('/', createDriver);
router.post('/bulk', createMultipleDrivers);
router.patch('/:id', patchDriver);

module.exports = router;