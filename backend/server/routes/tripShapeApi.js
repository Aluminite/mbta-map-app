const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/shapes/:routeId', async (req, res) => {
  const { routeId } = req.params;
  try {
    const response = await axios.get(`https://api-v3.mbta.com/shapes?filter[route]=${routeId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch shape data:", error.message);
    res.status(500).json({ error: "Failed to fetch shape data" });
  }
});

module.exports = router;