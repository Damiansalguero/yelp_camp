var middlewareObject = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//////////////////////// OWNERSHIP CAMPGROUNDS ////////////////////////////////////
middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log("ERROR!!!!!!!!!!!!!!!", err);
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //does user own/post campground
                //.equals() is a mtehod of mongo we can use to compare the mongo object with the id string
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "YOU NEED TO BE LOGGED IN TO DO THAT");
        //"back" sends the user bacl to the previous page
        res.redirect("back");
    }
};

///////////////////////// OWNERSHIP COMMENTS ////////////////////////////////////
middlewareObject.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log("ERROR!!!!!!!!!!!!!!!", err);
                res.redirect("back");
            } else {
                //does user own coment
                //.equals() is a mtehod of mongo we can use to compare the mongo object with the id string
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "YOU NEED TO BE LOGGED IN TO DO THAT");
        res.redirect("back");
    }
};

///////////////////////// LOGIN CHECK ////////////////////////////////////
middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObject;
