const express = require("express");
const router = express.Router();

// POST /user/logout
// Body (in JSON format):
router.post('/logout', async (req, res) => {
    return res.cookie('jwt', "", {httpOnly: true, secure: true, expires: new Date(0)})
        .send({message: "Logged out successfully"});
});

module.exports = router;