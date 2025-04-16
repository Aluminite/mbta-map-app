const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/trips/:routeId', async (req, res) => {
  const { routeId } = req.params;
  try {
    const response = await axios.get(`https://api-v3.mbta.com/trips?filter[route]=${routeId}`, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch trip data:', error.message);
    res.status(500).json({ error: 'Failed to fetch vehicle data' });
  }
});

module.exports = router;