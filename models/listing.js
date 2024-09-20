const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image: {
        url : String,
        filename: String,
    },
    price:Number,
    location:String,
    country:String,
    // isase hamari post par hum review ka option banayenge
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
   geometry:{
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates:{
        type:[Number],//store the latitude and longitude
        required:true,
      }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        // basically iska ye mtlb hai ki hamara reviews delete hone ke bad usko listing ke array se bhi remove karna hai isliye hum ye likhre hai isase listing ke array se bhi review delete ho jayenga
    await Review.deleteMany({_id:{$in:listing.reviews}});
    // iska mtlnb listing.review ke annder jitne bhi review hai uski list bana lenge and agar vo review _id ka part hongi toh usko delete kar denge
    }
    
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;


