var express    			  = require('express');
var app        			  = express();
var passport 		  	  = require("passport"); 
var bodyParser 			  = require("body-parser");
var mongoose   			  = require("mongoose");
var flash 				  = require("connect-flash");
var LocalStrategy	  	  = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User 				  = require("./models/user");
var expressSession 		  = require("express-session");
var Campground 			  = require("./models/campgrounds");
var methodOverride		  = require("method-override");
var seedDB	   			  = require("./seeds");
var Comment    			  = require("./models/comments");

//Requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	authRoutes 			= require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser());
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});




app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes);

app.listen(3000,()=>{
	console.log("YelpCamp server started.")
});
