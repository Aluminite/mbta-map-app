const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/stops/:date/:routeId', async (req, res) => {
    const {routeId, date} = req.params;

    try {
        const response = await axios.get(`https://api-v3.mbta.com/stops?api_key=${process.env.MBTA_API_KEY}&include=child_stops&filter%5Bdate%5D=${date}&filter%5Broute%5D=${routeId}`);
        res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch stop data:", error.message);
        res.status(500).json({error: "Failed to fetch stop data"});
    }
});

module.exports = router;