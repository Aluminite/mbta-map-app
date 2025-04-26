const express = require("express");
const router = express.Router();
const favoriteModel = require('../models/favoriteModel');
const {authenticateToken} = require("../utilities/authenticateToken");
const userModel = require("../models/userModel");

// DELETE /favorites/:favoriteID
// Body (in JSON format):
// accessToken: current user JWT
router.delete('/:favoriteId', async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(403).send({message: "Authentication failed"});
    }
    const ownerId = decodedToken.id;
    const {favoriteId} = req.params;

    const user = await userModel.findById(ownerId);
    if (!user) {
        return res.status(400).send({message: "User not found"});
    }

    try {
        const favorite = await favoriteModel.findOneAndDelete({ownerId: ownerId, _id: favoriteId});
        user.favorites = user.favorites.filter(e => !e.equals(favorite._id));
        user.markModified('favorites');
        await user.save();
        return res.json(favorite);
    } catch (error) {
        res.status(400).send({message: "Error trying to delete favorite"});
    }
});

module.exports = router;