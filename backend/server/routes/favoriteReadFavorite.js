const express = require("express");
const router = express.Router();
const favoriteModel = require("../models/favoriteModel");
const {authenticateToken} = require("../utilities/authenticateToken");
const mongoose = require("mongoose");

// GET /favorites/:favoriteID
// JWT must be in the cookie "jwt".
router.get("/:favoriteId", async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }
    const ownerId = decodedToken.id;
    const {favoriteId} = req.params;

    try {
        const favorite = await favoriteModel.findById(favoriteId);
        if (favorite === null) {
            return res.status(400).send({message: "favorite does not exist."});
        }
        if (favorite.ownerId.equals(new mongoose.Types.ObjectId(ownerId))) {
            return res.json(favorite);
        } else {
            return res.status(403).send({message: "This is not your favorite."});
        }
    } catch (error) {
        return res.status(400).send({message: "Error trying to delete favorite"});
    }
});

module.exports = router;