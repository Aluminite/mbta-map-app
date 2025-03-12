const express = require("express");
const router = express.Router();
const newFavoriteModel = require('../models/favoriteModel')

router.post('/deleteAllFavorite', async (req, res) => {
    const favorite = await newfavoriteModel.deleteMany();
    return res.json(favorite)
})

module.exports = router;