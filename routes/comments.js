var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");


//========================
//	COMMENTS ROUTES
//========================


router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,function(err,campground){
		if(err) throw err;
		res.render("comments/new",{campground:campground});
		console.log(campground._id)
	});
	
});


router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,function(err,campground){
		if(err) {
			console.log(err);
		} 

		Comment.create(req.body.comment,(err,comment)=>{
			if (err) {
				req.flash("error","Something went wrong..")
			}
			else{
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				req.flash("success","Successfully added comment");
				res.redirect(`/campgrounds/${campground._id}`)
			}
		})
	});

});


//EDIT COMMENTS
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campgroundId : req.params.id , comment:foundComment});
		}
	});
	
});

//UPDATE COMMENET
router.put("/campgrounds/:id/comments/:comment_id" , middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+ req.params.id )
		}
	});
});

//DESTROY COMMENTS
router.delete("/campgrounds/:id/comments/:comment_id" , middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment deleted successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
}); 


module.exports = router;
