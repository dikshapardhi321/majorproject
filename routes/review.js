const express= require("express");
// yaha mergeparam =true set karne se hamari id review me use ho payegi
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
// expresserror ko require karenge tab hi hum use use kar payenge
const ExpressError = require("../utils/ExpresError");

const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controller/reviews");



// ye o routes folder hai yh hmne pura hamar app.js ka contect likhe hai bas code essy home ke liye user and post ke commans alag isme dal diye hai and uswe hi hum express router bolte hai

// reviews 
// post route
// in this we pass review as middleware
// wrapasync error ko handle karne ke liye use kiye hai
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// ab express router me hamresha commen jo path hjai vo cut karna hota haiyaha /listing/:id/reviews  jo hai vo common path hai isliye usko  cut karenge and ab online / and /reviewId rahenga


// review
// delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;