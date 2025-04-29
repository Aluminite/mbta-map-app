const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/alerts/{:severity}', async (req, res) => {
    const {severity} = req.params;

    try {
        const response = await axios.get(`https://api-v3.mbta.com/alerts?sort=-updated_at&filter[severity]=${severity}&api_key=${process.env.MBTA_API_KEY}`, {timeout: 10000});
        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch alert data:', error.message);
        res.status(500).json({error: 'Failed to fetch alert data'});
    }
});

module.exports = router;