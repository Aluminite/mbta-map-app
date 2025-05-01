const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        const response = await axios.get(`https://api-v3.mbta.com/routes?api_key=${process.env.MBTA_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch route data:", error.message);
        res.status(500).json({error: "Failed to fetch route data"});
    }
});

module.exports = router;