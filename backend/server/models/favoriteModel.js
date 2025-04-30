const mongoose = require("mongoose");

//user schema/model
const favoriteSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Types.ObjectId,
            required: true,
            label: "ownerId",
        },
        route: {
            type: String,
            required: true,
            label: "route",
        },
        routeName: {
            type: String,
            required: true,
            label: "routeName",
        },
        station: {
            type: String,
            label: "station",
        },
        stationName: {
            type: String,
            label: "stationName",
            required: () => {return this.station === undefined}
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {collection: "favorites"}
);

module.exports = mongoose.model('favorites', favoriteSchema);