const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpresError");
// listing schema ko require karenge
// step 2 for validatio of revuew for server
const {listingSchema , reviewSchema} = require("./schema");

module.exports.isLoggedIn = (req,res,next)=>{
    // isase hume path patat chalta hai and ye pata chalta hai ki kaha redirect kara hai url
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        // if user is not logged in then redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    // agar user authenticate hota hai toh next ko add kardo otherwise hum redirect karenge login par
    next();
};

// ab hum redirectUrl ko directly access nhi kar sakte passport prblm denga toh hum local use kareneg jise hum har jagah use kar sakte hai
// isase hum login karne ke baad directly add new listing wale page par redirect karenge
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        // so upar jise hi user login nhi hai toh redirectutrl par jayenge and usko locals me save karenge
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// authorizatoh of listings
module.exports.isOwner = async(req,res,next)=>{
    let { id }=req.params;
let listing = await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this listings");
    // agar hum return nhi kartr toh edit hoke humko value milengi and return likhe toh hum access nhi kar sakte vo display hoke aayenga agar hum dusre user se website ko aaccess kare ai toh
    return res.redirect(`/listings/${id}`);
}
// if ye next nhi likhte toh humara owner bhi edit nhi kar payenga listing ko
next();
};

module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

// step 3 for validation of review for server 
module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,result.error);
    }else{
      next();
    }
  };


  // authorizatoh of delete review
//   similar to authorization for listings
// so isase author hi apne revuew ko delte kar sakta hai koi aur author kisi dusre ka review delete nhi karenga
module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id , reviewId }=req.params;
let review = await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this review");
    // agar hum return nhi kartr toh edit hoke humko value milengi and return likhe toh hum access nhi kar sakte vo display hoke aayenga agar hum dusre user se website ko aaccess kare ai toh
    return res.redirect(`/listings/${id}`);
}
// if ye next nhi likhte toh humara owner bhi edit nhi kar payenga listing ko
next();
};
