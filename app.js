////////////////////////////// NPM PACKAGE SETUP //////////////////////////////
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
//////////////////////////// MODELS IMPORT //////////////////////////////
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
//////////////////////// ROUTER IMPORT //////////////////////////////
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");
//////////////////////////// MONGOOSE CONFIG //////////////////////////////
mongoose.set("useUnifiedTopology", true);

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, { 
    useNewUrlParser: true
});
/////////////////////////// USE WHEN WORKING LOCAL SINGLE CODE ///////////////////////
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", {
//     useNewUrlParser: true
// });

/////////////////////////// USE WHEN DEPLOYING SINGLE CODE ///////////////////////////
// mongoose.connect(
//     "mongodb+srv://Dimiaun:wJsKuo3QJHJuSRit49bDUP@cluster0-erem8.mongodb.net/test?retryWrites=true&w=majority",
//     {
//         useNewUrlParser: true
//     }
// );
/////////////////////// BP + EJS + PUBLIC CONFIG //////////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//////////////////// FLASH ///////////////////////////
app.use(flash());
//////////////////////////// PASPORT CONFIG //////////////////////////////
app.use(
    require("express-session")({
        secret: "Was geht du aale na",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//////////////////// MIDDLEWARE USER ///////////////////////////
// Gets called on all the routes and checks  for user and can be used in ejs logic to hide buttons
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    //Defines the Pop Up messages and where they display
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//////////////////// Runs the code and clears the DB ///////////////////////////
// seedDB();
/////////////////////// ROUTER SETUP + USE //////////////////////////////
//First argument here "/campgrounds" is what is going to be appended to all the routes and therefore must not be part anymore of the route in the corresponding file. In this case the campground.js
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("Server Has Started!");
});
