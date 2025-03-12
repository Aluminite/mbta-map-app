const mongoose = require("mongoose");

//user schema/model
const favoriteSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
            required: true,
            label: "ownerId",
        },
        route: {
            type: String,
            label: "route",
        },
        station: {
            type: String,
            label: "station",
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {collection: "users"}
);

module.exports = mongoose.model('users', favoriteSchema)