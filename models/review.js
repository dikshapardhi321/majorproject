const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
       type:Date,
    //    iska mtlb ye hai ki date hum koi vbhi dale but by default hamari current date ki print hongi
       default:Date.now()
    },
    // ye author humne authorizaton of reviews ke liye liya hai
    author:{
        type:Schema.Types.ObjectId,
        // yaha user isliye liye iska mtlb ye hai ki koi n koi user homga jo review dera hai joki already platform par login hai
        ref:"User",
    }
});

module.exports = mongoose.model("Review",reviewSchema);