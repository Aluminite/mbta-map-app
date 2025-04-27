const express = require("express");
const router = express.Router();
const {userLoginValidation} = require('../models/userValidator');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {generateAccessToken} = require('../utilities/generateToken');

// POST /user/login
// Body (in JSON format):
// username: username to sign in with
// password: password to sign in with
router.post('/login', async (req, res) => {

    const {error} = userLoginValidation(req.body);
    if (error) return res.status(400).send({message: error.errors[0].message});

    const {username, password} = req.body;

    const user = await userModel.findOne({username: username});

    //checks if the user exists
    if (!user)
        return res
            .status(401)
            .send({message: "Username or password is incorrect."});

    //check if the password is correct or not
    const checkPasswordValidity = await bcrypt.compare(
        password,
        user.password
    );

    if (!checkPasswordValidity)
        return res
            .status(401)
            .send({message: "Username or password is incorrect."});

    const accessToken = generateAccessToken(user._id, user.email, user.username);

    return res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: 2592000000})
        .send({message: "Logged in successfully"});
});

module.exports = router;