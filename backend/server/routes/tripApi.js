const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/trips/:tripId', async (req, res) => {
  const { tripId } = req.params;
  
  try {
    const response = await axios.get(`https://api-v3.mbta.com/trips/${tripId}?api_key=${process.env.MBTA_API_KEY}`, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch trip data:', error.message);
    res.status(500).json({ error: 'Failed to fetch trip data' });
  }
});

module.exports = router;