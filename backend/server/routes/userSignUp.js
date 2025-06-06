const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {userValidation} = require('../models/userValidator');
const userModel = require('../models/userModel');

router.post('/signup', async (req, res) => {
    const {error} = userValidation(req.body);
    console.log(error);
    if (error) return res.status(400).send({message: error.errors[0].message});

    const {username, email, password} = req.body;

    //check if email already exists
    const user = await userModel.findOne({username: username});
    if (user !== null)
        return res.status(409).send({message: "Username is taken, pick another"});

    //generates the hash
    const generateHash = await bcrypt.genSalt(Number(10));

    //parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash);

    //creates a new user
    const createUser = new userModel({
        username: username,
        email: email,
        password: hashPassword,
    });


    try {
        const saveNewUser = await createUser.save();
        return res.send(saveNewUser);
    } catch (error) {
        return res.status(400).send({message: "Error trying to create new user"});
    }

});

module.exports = router;