const jwt = require('jsonwebtoken');

function authenticateToken(req) {
    if (req.cookies.jwt) {
        return jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
    } else throw new Error("No authentication token found");
}

module.exports.authenticateToken = authenticateToken;