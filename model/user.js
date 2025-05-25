// Filename - model/User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 }
});

const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User)
