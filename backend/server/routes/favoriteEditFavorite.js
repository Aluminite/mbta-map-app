const express = require("express");
const router = express.Router();
const newFavoriteModel = require('../models/favoriteModel')
const newUserModel = require('../models/userModel')

router.post('/editFavorite', async (req, res) => {
    // store new favorite information
    const {favoriteId, ownerId, route, station} = req.body

    // check if owner exists
    const user = await newUserModel.findOne({userId: ownerId})
    if (!user) return res.status(409).send({message: "The owner ID does not exist."})

    // Validation for the route and station will need to be added later.

    // find and update favorite using stored information
    try {
        const favorite = await newFavoriteModel.findByIdAndUpdate(favoriteId, {
            ownerId: ownerId,
            route: route,
            station: station
        });
        return res.json(favorite);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

module.exports = router;