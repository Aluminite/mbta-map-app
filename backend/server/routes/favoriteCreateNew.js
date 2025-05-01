const express = require("express");
const router = express.Router();
const favoriteModel = require('../models/favoriteModel');
const userModel = require('../models/userModel');
const {authenticateToken} = require("../utilities/authenticateToken");

// POST /favorites/new
// JWT must be in the cookie "jwt".
// Body (in JSON format):
// route: favorite route
// station: favorite station
router.post('/new', async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }
    const ownerId = decodedToken.id;

    const user = await userModel.findById(ownerId);
    if (user === null) {
        return res.status(400).send({message: "User not found"});
    }

    const {route, routeName, station, stationLatLng, stationName} = req.body;

    // creates a new favorite
    const createFavorite = new favoriteModel({
        ownerId: ownerId,
        route: route,
        routeName: routeName,
        station: station,
        stationLatLng: stationLatLng,
        stationName: stationName
    });

    try {
        const saveNewFavorite = await createFavorite.save();
        user.favorites.push(saveNewFavorite);
        user.markModified('favorites');
        await user.save();
        return res.json(saveNewFavorite);
    } catch (error) {
        return res.status(400).send({message: "Error trying to create new favorite"});
    }

});

module.exports = router;