require('dotenv').config();

const express = require('express');
const cors = require('cors');

const driverRoutes = require('./routes/driverRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/drivers', driverRoutes);
app.use('/drivers/availability', availabilityRoutes);

app.get('/', (req, res) => {
  res.send('Driver Service is running');
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Driver Service running on http://localhost:${PORT}`);
});