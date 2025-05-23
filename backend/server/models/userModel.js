const mongoose = require("mongoose");

//user schema/model
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            label: "username",
        },
        email: {
            type: String,
            required: true,
            label: "email",
        },
        password: {
            required: true,
            type: String,
            min: 8
        },
        date: {
            type: Date,
            default: Date.now,
        },
        darkTheme: {
            type: Boolean,
            default: false,
        },
        favorites: {
            type: [mongoose.Types.ObjectId],
            default: [],
        }
    },
    {
        collection: "users",
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
            }
        }
    }
);

module.exports = mongoose.model('users', userSchema);