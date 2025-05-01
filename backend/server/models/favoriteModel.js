const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        route: {
            type: String,
            required: true
        },
        routeName: {
            type: String,
            required: true
        },
        station: {
            type: String
        },
        stationLatLng: {
            type: [Number],
            required: function () {
                return this.station !== undefined;
            }
        },
        stationName: {
            type: String,
            required: function () {
                return this.station !== undefined;
            }
        },
        date: {
            type: Date,
            default: Date.now
        },
    },
    {collection: "favorites"}
);

module.exports = mongoose.model('favorites', favoriteSchema);