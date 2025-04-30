const express = require("express");
const router = express.Router();
const favoriteModel = require("../models/favoriteModel");
const {authenticateToken} = require("../utilities/authenticateToken");
const mongoose = require("mongoose");

// GET /favorites/*favoriteID
// Can specify multiple IDs separated by slash.
// JWT must be in the cookie "jwt".
router.get("/*favoriteIds", async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }
    const ownerId = new mongoose.Types.ObjectId(decodedToken.id);
    const {favoriteIds} = req.params;

    try {
        const favorites = await favoriteModel.find({'_id': {$in: favoriteIds}, ownerId: ownerId});
        if (favorites.length === 0) {
            return res.status(400).send({message: "favorite does not exist."});
        }
        return res.json(favorites);
    } catch (error) {
        return res.status(400).send({message: "Error trying to delete favorite"});
    }
});

module.exports = router;