const express = require("express");
const router = express.Router();
const z = require("zod");

const newFavoriteModel = require("../models/favoriteModel");

router.get("/getFavoriteById", async (req, res) => {
    var {favoriteId} = req.body;

    newFavoriteModel.findById(favoriteId, function (err, favorite) {
        if (err) {
            console.log(err);
        }
        if (favorite == null) {
            res.status(404).send("favoriteId does not exist.");
        } else {
            return res.json(favorite);
        }
    });
});

module.exports = router;