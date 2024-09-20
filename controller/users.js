const User = require("../models/user");

module.exports.rendersignupForm = (req,res)=>{
    res.render("users/signup");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username , email , password }= req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        // iska mtlb jaise hum login kar liye vaise hi hum registerduser ban jayenge and hum easily registered krte hi website par automatically loggedin bhi ho jyenge
        req.login(registeredUser,(err)=>{
          if(err){
            next (err);
          }
          req.flash("success","Welcome to Wanderlust!");
          res.redirect("/listings");
          // req.login se res.redirect tak jo likhe hai usase hum directly signup karke login in ho jayenge hume signup karke login karne ki jarurt nhi padengi
        });
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
 
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login");
  };

  module.exports.login = async(req,res)=>{
    req.flash("success","welcome back  to Wanderlust! You logged in !");
  // agar locals.redirect karta hai toh thik otherwise listings par jayenge
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // post login page
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","logged you out");
      res.redirect("/listings");
    });
  };