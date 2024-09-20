const express= require("express");
// yaha mergeparam =true set karne se hamari id review me use ho payegi
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController =  require("../controller/users");


// router.route
// toh /signup path same tha isliye compact karne ke liye router.route me likh diye
router.route("/signup")
.get(userController.rendersignupForm)
.post(wrapAsync(userController.signup));

// router.get("/signup",userController.rendersignupForm);

// ye asyncv honga because db ke ander chnages karne wale hai hum
// router.post("/signup",wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

// router.get("/login",userController.renderLoginForm);


// yaha failurerediect and failurfalsh ka mtln ye hai li usernme ans password corect nhi rahenga tph hum login par jaye ge and flash karenge
// passport automaticallu implement kar deta hai flash ko aur flash me ek msg
// yaha login page acces karne ke liye saveredirect url likh diye jiksa function himne middleware.js me llikhe hai
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

// logout route
router.get("/logout",userController.logout);
module.exports = router;