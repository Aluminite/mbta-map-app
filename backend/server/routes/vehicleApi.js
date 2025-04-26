const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/vehicles/:routeId', async (req, res) => {
    const {routeId} = req.params;

    try {
        const response = await axios.get(`https://api-v3.mbta.com/vehicles?api_key=${process.env.MBTA_API_KEY}&filter%5Broute%5D=${routeId}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch vehicle data:', error.message);
        res.status(500).json({error: 'Failed to fetch vehicle data'});
    }
});

module.exports = router;