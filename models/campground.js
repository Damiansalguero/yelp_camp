////////////////////////////// NPM PACKAGE SETUP //////////////////////////////
var mongoose = require("mongoose");

//////////////////////////////SCHEMA SETUP/////////////////////////////////////
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            //Comment in ref refers to the mongoose.model in comment.js
            ref: "Comment"
        }
    ]
});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
