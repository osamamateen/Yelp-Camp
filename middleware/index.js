var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req,res,next) {


	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err,foundCampground)=>{
			if(err){ 
				req.flash("error","Campground not found");
				res.redirect("back"); 
			}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You do not have permission to do that");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You Need To Login First");
		res.redirect("back");
	}
}



middlewareObj.checkCommentOwnership = function(req,res,next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err,foundComment)=>{
			if(err) {
				res.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("You do not have permission to do that");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","You need to login first");
		res.redirect("back");
	}
}


middlewareObj.isLoggedIn = function (req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You Need To Login First");
	res.redirect("/login");
}


module.exports = middlewareObj;