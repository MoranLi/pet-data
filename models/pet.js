var mongoose = require('mongoose');

var pets = new mongoose.Schema({
    id: Number,
    name: String,
    type: String,
    breed: String,
    location: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model("Pet",pets);