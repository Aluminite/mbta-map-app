const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const {authenticateToken} = require("../utilities/authenticateToken");

// GET /user/userInfo
// Body (in JSON format):
// accessToken: current user JWT
router.get("/userInfo", async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(403).send({message: "Authentication failed"});
    }
    const userId = decodedToken.id;

    try {
        const user = await userModel.findById(userId);
        if (user == null) {
            res.status(404).send("userId does not exist.");
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
