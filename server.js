require('dotenv').config();
const express = require('express');
const cors = require('cors');
const instagramRouter = require('./src/api/instagram');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api', instagramRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
