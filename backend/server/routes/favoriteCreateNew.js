const express = require("express");
const router = express.Router();
const newFavoriteModel = require('../models/favoriteModel')
const newUserModel = require('../models/userModel')

router.post('/newFavorite', async (req, res) => {
    const {ownerId, route, station} = req.body

    // check if owner exists
    const user = await newUserModel.findOne({userId: ownerId})
    if (!user) return res.status(409).send({message: "The owner ID does not exist."})

    // creates a new favorite
    const createFavorite = new newFavoriteModel({
        ownerId: ownerId,
        route: route,
        station: station,
    });

    try {
        const saveNewFavorite = await createFavorite.save();
        res.send(saveNewFavorite);
    } catch (error) {
        res.status(400).send({message: "Error trying to create new favorite"});
    }

})

module.exports = router;