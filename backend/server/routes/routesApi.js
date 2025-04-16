const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/routes OR /api/routes?type=1
router.get('/routes', async (req, res) => {
  const { type } = req.query;
  const url = type
    ? `https://api-v3.mbta.com/routes?filter[type]=${type}`
    : `https://api-v3.mbta.com/routes`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch route data:", error.message);
    res.status(500).json({ error: "Failed to fetch route data" });
  }
});

module.exports = router;
