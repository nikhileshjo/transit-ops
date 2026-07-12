const express = require('express');
const router = express.Router();

const {
  getTrips,
  createTrip,
  patchTrip,
} = require('../controllers/tripController');

router.get('/', getTrips);
router.post('/', createTrip);
router.patch('/:id', patchTrip);

module.exports = router;