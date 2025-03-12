const express = require("express");
const router = express.Router();
const z = require('zod')
const newFavoriteModel = require('../models/favoriteModel')
const newUserModel = require('../models/userModel')

router.post('/editFavorite', async (req, res) => {
    // store new user information
    const {favoriteId, ownerId, route, station} = req.body

    // check if owner exists
    const user = await newUserModel.findOne({userId: ownerId})
    if (!user) return res.status(409).send({message: "The owner ID does not exist."})

    // Validation for the route and station will need to be added later.

    // find and update user using stored information
    newFavoriteModel.findByIdAndUpdate(favoriteId, {
        ownerId: ownerId,
        route: route,
        station: station
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });

})

module.exports = router;