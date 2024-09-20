const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// ye username automaticall add kar deta hai
const  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        rquired:true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);