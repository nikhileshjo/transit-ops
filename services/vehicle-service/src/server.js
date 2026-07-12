require('dotenv').config();

const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Vehicle routes
app.use('/vehicles', vehicleRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Vehicle Service is running');
});

const PORT = process.env.PORT || 3001;

// Keep the server running
app.listen(PORT, () => {
  console.log(`Vehicle Service running on http://localhost:${PORT}`);
});