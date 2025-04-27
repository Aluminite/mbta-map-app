const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const {authenticateToken} = require("../utilities/authenticateToken");

// POST /user/darkTheme
// JWT must be in the cookie "jwt".
// Body (in JSON format):
// darkTheme: true or false
router.post('/darkTheme', async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }
    const userId = decodedToken.id;
    const {darkTheme} = req.body;
    if (darkTheme === undefined) {
        return res.status(400).send({message: "darkTheme must be specified"});
    }

    // find and update user
    try {
        const user = await userModel.findByIdAndUpdate(userId, {
            darkTheme: darkTheme
        });
        if (user === null) {
            return res.status(400).send({message: "User not found"});
        }

        return res.send({darkTheme: darkTheme});
    } catch (err) {
        return res.status(400).send({message: "Failed to set theme preference"});
    }
});

module.exports = router;