const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req,res)=>{
    // jab hum review likhenge toh vo submit hote time error denga mtlb ki vo review ko read nhi kar para aisa toh hamare path me:id hai toh vo id app.js me hi rukh jati hai review me nhi aa pati isliye prblm ho jati hai isliyue :id ko review folderme use karne ke liye hum merge concept use karte hai
        let listing=await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
    
    
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","new review Created!");
        // console.log("response was saved")
        // res.send("new review saved");
        // isase hum submit par jab click karenge toh same page par aa jayenge and review me hamari id prrint ho jayengi
        res.redirect(`/listings/${ listing._id }`);
    };

    module.exports.destroyReview = async(req,res)=>{
        // iska mtlb hum listing and review ki id nikal lenge
        let {id , reviewId }=req.params;
        // iska mtlb review me jo bhi id reviewid se match hoti hai usko pull karte delete kar denge
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success"," Review deleted!");
        // iska mtlb hum hamare show page par aa jayenge
        res.redirect(`/listings/${id}`);
      }