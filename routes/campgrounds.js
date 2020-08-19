var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/");

////////////////////////INDEX ROUTE///////////////////////////
router.get("/", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                campgrounds: allCampgrounds
            });
        }
    });
    //////////////////////HARD CODED VERSION/////////////////////////////////
    //First argument in Function is the Name, second one is the data to pass in
    // res.render("campgrounds", { campgrounds: campgrounds });
});

/////////////////////CREATE ROUTE////////////////////////////
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to the array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };

    //Create ne campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log("NEWLY CREATED Campground", newlyCreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//////////////////////////TEST CREATE /////////////////////////////////////
// Campground.create(
//     {
//         name: "Granite Hill",
//         image:
//             "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.hipcamp.com%2Fimage%2Fupload%2Fc_limit%2Cf_auto%2Ch_1200%2Cq_60%2Cw_1920%2Fv1464839724%2Fcampground-photos%2Feffpcqdummha95in3lrx.jpg&f=1&nofb=1",
//         description: "This is a huge granite hill. No bathrooms, no water!"
//     },
//     function(err, campground) {
//         if (err) {
//             console.log("ERROR!!!");
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// );

//////////////////////////NEW ROUTE/////////////////////////////////////
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("new");
});

/////////////////////////SHOW ROUTE////////////////////////////////////
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function(err, foundCampground) {
            if (err) {
                console.log("ERROR!!!!", err);
            } else {
                res.render("show", { campground: foundCampground });
            }
        });
});

///////////////////////// EDIT ROUTE ////////////////////////////////////
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(
    req,
    res
) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campedit", { campground: foundCampground });
    });
});

///////////////////////// UPDATE ROUTE ////////////////////////////////////
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find & update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updatedCampground
    ) {
        if (err) {
            console.log("ERROR!!!!!!!!!!!!!!!", err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect
});
///////////////////////// DESTROY ROUTE ////////////////////////////////////
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
