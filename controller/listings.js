const Listing = require("../models/listing");
// ye humne github se liya hai
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
// ye hum yaad rakhhne ki koi jarurat nhi hai ye hame documentation se hi dekhna padenga
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// ye controller me humne callback ko yaha likh liye routes se
// yaha humne index route ka callback export kiya hai


module.exports.index=async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("index",{ allListings });
};

module.exports.renderNewForm =(req,res)=>{
    // ky hora hai ki hum hamare website ko bin login kiye dekh pare hai but ab hum aisi functionality add karenge jisase hum bina login kiye website nhi dekh paye g
    // agar hum new listing add karenge toh hum directly add nhi kar paynge pahale hume logged in karna oadenga website par
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("new");
} ;

module.exports.showListig = async(req,res)=>{
    let { id } = req.params;
    // yaha mtlb hai ki revuew me hamare author ka name dikeh isliye humne author ke path ko bhi populate kiya hai
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},
    }).populate("owner");
    if(!listing){
        // iska mtlbye hai ki agar humne koi list ko delete kar diye and fir bhi humuski list ko search kare toh ye print hone aaya upar ki doesnt exist and hum diret hamari home page par aa jayenge
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("show",{ listing });
};

module.exports.createListing = async(req,res,next)=>{
    // ye geocoding ka basic code hai isko hum copy kiye hai
    let response = await geocodingClient.forwardGeocode({
        // iska mtlb humne listing ki jo location hai map me use point karenge
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        // console.log(response.body.features[0].geometry);
        // ye isliye karaya kyuki features ke ander hi hmare coordinates chuke huye hai
        // feature hamara ek array tha isliye [0] ki valur cahhiye isliye vo likhe
    //    console.log(response.body.features[0].geometry);
    //    res.send("done!");

    // save link in mongo
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    // jab new listing create karenge toh humne owner ka name bhi dalna padenga
    newListing.owner = req.user._id;
    // save link in mogo
    newListing.image = {url , filename};
    // geocoding
    newListing.geometry = response.body.features[0].geometry;
    // iske help se hamare cororidnated db me bhi store ho gye hai
   let saveListing =  await newListing.save();
   console.log(saveListing);
    
 
    // jaise new route create honga vaise hi upar new listing created print hoke aayenga
    req.flash("success","New listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        // iska mtlbye hai ki agar humne koi list ko delete kar diye and fir bhi humuski list ko search kare toh ye print hone aaya upar ki doesnt exist and hum diret hamari home page par aa jayenge
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
   let originalImageUrl = listing.image.url;
//    iska mtlb ye hai ki hum jo bhi image edit kare hai uski height and width 300 and 250 px rahenga
   originalImageUrl = originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("edit",{ listing ,  originalImageUrl});
};

module.exports.updateListing  = async(req,res)=>{
    let { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});


//    agar java me humne dekhne hai kisi bhi variable ki value undefined hai ya nhi toh hum typeof operatore use karte hai
// if req.file exist karta hai toh ye valuee return karenga otherwise undefined return karenga
if(typeof req.file !=="undefined"){
//    agar hum koi new image upload kare hai toh vo upload nhi hongi isliye hum logic likhre hai niche 2 line wala logic hai
let url = req.file.path;
// logic is pahale hum req.file.path se apna url nikal lenge
let filename = req.file.filename;
// uske bad req.file.filename se filename nikal lenge
// and jo listing haijisko humne already update kiya tha usne hum hamari imgae ko set kar denge
listing.image = {url , filename};
// and firse apni listing ko save kareneg
await listing.save();
   }

req.flash("success","listing update!");
res.redirect(`/listings/${id}`);
};

// deletelisting= destroylisting
module.exports.destroyListing = async(req,res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}