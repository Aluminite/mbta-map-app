const jwt = require('jsonwebtoken');

function authenticateToken(req) {
    const {accessToken} = req.body;
    if (accessToken == null) throw new Error("No authentication token found");

    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

module.exports.authenticateToken = authenticateToken;