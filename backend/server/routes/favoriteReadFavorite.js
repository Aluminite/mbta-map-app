const express = require("express");
const router = express.Router();
const z = require("zod");

const newFavoriteModel = require("../models/favoriteModel");

router.get("/getFavoriteById/:favoriteId", async (req, res) => {

    newFavoriteModel.findById({favoriteId: req.params.favoriteId}, function (err, favorite) {
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