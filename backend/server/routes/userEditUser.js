const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const newUserModel = require('../models/userModel')
const {newUserValidation} = require('../models/userValidator');
const {generateAccessToken} = require('../utilities/generateToken');

router.post('/editUser', async (req, res) => {
    // validate new user information
    const {error} = newUserValidation(req.body);
    if (error) return res.status(400).send({message: error.errors[0].message});

    // store new user information
    const {userId, username, email, password} = req.body

    // check if username is available
    let user = await newUserModel.findOne({username: username})
    if (user) {
        let userIdReg = JSON.stringify(user._id).replace(/"+/g, '')
        if (userIdReg !== userId) return res.status(409).send({message: "Username is taken, pick another"})
    }

    // generates the hash
    const generateHash = await bcrypt.genSalt(Number(10))

    // parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash)

    // find and update user using stored information
    try {
        user = await newUserModel.findByIdAndUpdate(userId, {
            username: username,
            email: email,
            password: hashPassword
        });

        // create and send new access token to local storage
        const accessToken = generateAccessToken(user._id, email, username, hashPassword)
        res.header('Authorization', accessToken).send({accessToken: accessToken})
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

module.exports = router;