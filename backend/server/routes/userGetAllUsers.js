const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');

// Will probably remove later?

router.get('/getAll', async (req, res) => {
    const user = await userModel.find();
    return res.json(user);
});

module.exports = router;