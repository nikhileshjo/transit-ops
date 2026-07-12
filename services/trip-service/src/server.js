require('dotenv').config();

const express = require('express');
const cors = require('cors');

const tripRoutes = require('./routes/tripRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/trips', tripRoutes);

app.get('/', (req, res) => {
  res.send('Trip Service is running');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Trip Service running on http://localhost:${PORT}`);
});