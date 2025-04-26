const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/predictions/:stopId/:routeId', async (req, res) => {
    const {stopId, routeId} = req.params;

    try {
        const response = await axios.get(`https://api-v3.mbta.com/predictions?api_key=${process.env.MBTA_API_KEY}&sort=time&fields%5Bprediction%5D=arrival_time%2Cdeparture_time%2Cdirection_id&filter%5Bstop%5D=${stopId}&filter%5Broute%5D=${routeId}`);
        res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch prediction data:", error.message);
        res.status(500).json({error: "Failed to fetch prediction data"});
    }
});

module.exports = router;