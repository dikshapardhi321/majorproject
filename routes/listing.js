const express= require("express");
const router = express.Router();

// yaha 2 dots isliye liye  kyuki rotes ke ander humne apni js file banai hai
const wrapAsync = require("../utils/wrapAsync");
// expresserror ko require karenge tab hi hum use use kar payenge
const Listing = require("../models/listing");
// isloggedin ye ek function hai isliye humne use { bracket ke ander likhe hai}
const {isLoggedIn, isOwner , validateListing} = require("../middleware");
const listingController = require("../controller/listings");
// image ko uploadd karne ke liye hum multer use karte hai
const multer  = require('multer')
const { storage }= require("../cloudconfig");
// initilaization of multer jisme hamari files or images uploads nam ki file me save ho jayengi
// multer forms ke data ko filkes se nikalenga and create karenga upload nam ka folder and usme data store karenga
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage });


// Router.router
// ye ek compact version hai code ko likhne ka jiska bhi path same hai usko  hum router.route ke ander join klar denge
router
// indescx and create route ka route same tha isliye humne isko  router.router ke ander likhe
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
  // upload wala jo hai vo middleware hai jise humne npmjs se liye hai and ye image upload karne ke liye use honga
  // iske vajahse automatically uploads nam ka folder create ho gya use humne create nhi kiye hai
  // .post(upload.single('listing[image]'),(req,res)=>{res.send(req.file)});

  
//New route
// ye new route ko /:id wale se upar rakhe hai kyuki agar aisa nhi kiye toh /new ko code as a id ki tarah search karenga and hume error mil sakte hai
router.get("/new",isLoggedIn,listingController.renderNewForm);


//   same update and show route ka path same hai isliye usko  bhi huk router.route ke ander likh sakte hai
router.route("/:id")
.get(wrapAsync(listingController.showListig))
// ye yaha image ko bakened handle kare isliye humne yaha upload.single wala middleware dala hai
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//index rroute
// humne wrapsync ke ander ka controller me callback likh diye hai
// ab yaha humne bas index likhe yahaha ab apna code kam ho gya aur
// router.get("/",wrapAsync(listingController.index));



//show route
// router.get("/:id",wrapAsync(listingController.showListig));
//create route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing)
// );


//delete route
// anfd humne ye sab me isowner middlewareuse kiye hai
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
// );

module.exports = router;


// beacuse of thes router we reduced the 300 line code into 50 line code in app.js