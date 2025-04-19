const express = require("express");
const router = express.Router();

const newUserModel = require("../models/userModel");

router.get("/getUserById", async (req, res) => {
    let {userId} = req.body;

    try {
        const user = await newUserModel.findById(userId);
        if (user == null) {
            res.status(404).send("userId does not exist.");
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
