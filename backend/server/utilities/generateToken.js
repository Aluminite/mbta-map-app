const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (userId, email, username) => {
    return jwt.sign({id: userId, email, username}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30d'
    });
};

module.exports.generateAccessToken = generateAccessToken;