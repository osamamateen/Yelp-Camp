var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - List of all campgrounds

router.get("/campgrounds", (req, res) => {
  //get all campfrounds from db
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE -  Add a new campground to DB (POST)
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
  //get data from form add it to campground array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
    price: price,
  };

  //create a new campground and save to db

  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created Successfully");
      console.log(newlyCreated);
    }
  });

  res.redirect("/campgrounds");
});

//NEW - Display Form to make a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW -  Shows info about one campground
router.get("/campgrounds/:id", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/show", {
              campground: foundCampground,
              currentUser: req.user,
              camp: allCampgrounds,
            });
          }
        });
    }
  });
});

// EDIT

router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err);
      }

      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

//UPDATE
router.put(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          redirect("/campgrounds");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

//DESTROY ROUTE
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
      req.flash("success", "Campground deleted successfully");
      res.redirect("/campgrounds");
    });
  }
);

module.exports = router;
