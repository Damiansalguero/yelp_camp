var express = require("express");
//The object being passed takes care of the :id and that it can be accessed by router
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/");

///////////////////////// COMMENTS NEW////////////////////////////////////
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //Find campground by ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("ERROR!!!!", err);
        } else {
            res.render("newcomment", { campground: campground });
        }
    });
});

///////////////////////// COMMENTS CREATE////////////////////////////////////
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("ERROR!!!!", err);
            res.redirect("/campgrounds");
        } else {
            //create new comments
            //This line works, because of the name attributes + [] in the form
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "OOPS, Something went wrong!");
                    console.log("ERROR!!!!", err);
                } else {
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log("COMMENT!!!!!!!!!!!!!", comment);
                    req.flash("success", "Successfully added comment");
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
///////////////////////// COMMENTS EDIT////////////////////////////////////
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
    req,
    res
) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log("ERRORRRRRRRRRRRRRRR!!!!!!!!!!!!!", err);
            res.redirect("back");
        } else {
            res.render("editcomment", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});
///////////////////////// COMMENTS UPDATE////////////////////////////////////
router.put("/:comment_id", middleware.checkCommentOwnership, function(
    req,
    res
) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
        err,
        updatedComment
    ) {
        if (err) {
            console.log("ERRORRRRRRRRRRRRRRR!!!!!!!!!!!!!", err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
///////////////////////// COMMENTS DESTROY ////////////////////////////////////
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
    req,
    res
) {
    //req.params.comment_id refers to the id of the route
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log("ERRORRRRRRRRRRRRRRR!!!!!!!!!!!!!", err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
