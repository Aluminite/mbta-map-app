const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/shapes/:shapeId', async (req, res) => {
  const { shapeId } = req.params;
  
  try {
    const response = await axios.get(`https://api-v3.mbta.com/shapes/${shapeId}?api_key=${process.env.MBTA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch shape data:", error.message);
    res.status(500).json({ error: "Failed to fetch shape data" });
  }
});

module.exports = router;