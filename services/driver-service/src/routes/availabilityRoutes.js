const express = require('express');
const router = express.Router();

const {
  getAvailability,
  createAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');

router.get('/', getAvailability);
router.post('/', createAvailability);
router.patch('/:id/delete', deleteAvailability);

module.exports = router;