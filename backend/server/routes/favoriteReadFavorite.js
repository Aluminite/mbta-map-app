const express = require("express");
const router = express.Router();

const newFavoriteModel = require("../models/favoriteModel");

router.get("/getFavoriteById/:favoriteId", async (req, res) => {
    let {favoriteId} = req.params;

    try {
        const favorite = await newFavoriteModel.findById(favoriteId)
        if (favorite == null) {
            res.status(404).send("favoriteId does not exist.");
        } else {
            return res.json(favorite);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;