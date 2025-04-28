const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const {userValidation} = require('../models/userValidator');
const {generateAccessToken} = require('../utilities/generateToken');
const {authenticateToken} = require("../utilities/authenticateToken");

// POST /user/editUser
// JWT must be in the cookie "jwt".
// Body (in JSON format):
// username: new username
// email: new email
// password: new password
router.post('/editUser', async (req, res) => {
    // authenticate the user
    let decodedToken = null;
    try {
        decodedToken = authenticateToken(req);
    } catch (error) {
        // The authenticate function will always throw an error if authentication doesn't succeed
        return res.status(401).send({message: "Authentication failed"});
    }

    // validate new user information
    const {error} = userValidation(req.body);
    if (error) return res.status(400).send({message: error.errors[0].message});

    // store new user information
    const userId = decodedToken.id;
    const {username, email, password} = req.body;

    // check if username is available
    let user = await userModel.findOne({username: username});
    if (user !== null) {
        let userIdReg = JSON.stringify(user._id).replace(/"+/g, '');
        if (userIdReg !== userId) return res.status(409).send("Username is taken, pick another");
    }

    // generates the hash
    const generateHash = await bcrypt.genSalt(Number(10));

    // parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash);

    // find and update user using stored information
    try {
        user = await userModel.findByIdAndUpdate(userId, {
            username: username,
            email: email,
            password: hashPassword
        });
        if (user === null) {
            return res.status(400).send({message: "User not found"});
        }

        // create and send new access token
        const accessToken = generateAccessToken(user._id, email, username);
        return res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: 2592000000, sameSite: "none"})
            .send({message: "User edited successfully"});
    } catch (err) {
        return res.status(400).send({message: "Error trying to update user"});
    }
});

module.exports = router;