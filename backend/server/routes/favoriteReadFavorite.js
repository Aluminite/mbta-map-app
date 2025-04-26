const express = require("express");
const router = express.Router();
const favoriteModel = require("../models/favoriteModel");

// GET /favorites/:favoriteID
// Body (in JSON format):
// accessToken: current user JWT
router.get("/:favoriteId", async (req, res) => {
    let {favoriteId} = req.params;

    try {
        const favorite = await favoriteModel.findById(favoriteId);
        if (favorite == null) {
            res.status(404).send({message: "favoriteId does not exist."});
        } else {
            return res.json(favorite);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;