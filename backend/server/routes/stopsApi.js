const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/stops?routeId=Red&date=2024-04-11
router.get('/stops', async (req, res) => {
  const { routeId, date } = req.query;

  if (!routeId) {
    return res.status(400).json({ error: "Missing required routeId" });
  }

  let url = `https://api-v3.mbta.com/stops?filter[route]=${routeId}`;
  if (date) {
    url += `&filter[date]=${date}`;
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch stop data:", error.message);
    res.status(500).json({ error: "Failed to fetch stop data" });
  }
});

module.exports = router;
