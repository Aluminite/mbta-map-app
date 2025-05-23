const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const {authenticateToken} = require("../utilities/authenticateToken");

// GET /user/userInfo
// JWT must be in the cookie "jwt".
router.get("/userInfo", async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }
    const userId = decodedToken.id;

    try {
        const user = await userModel.findById(userId);
        if (user === null) {
            return res.status(400).send({message: "User not found"});
        }
        return res.json(user);
    } catch (err) {
        return res.status(400).send({message: "Error trying to get user info"});
    }
});

module.exports = router;
