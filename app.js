if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
  }
  
  // ye hamara bahut sari process ko print karta hai if humne hamar envb ka data chahiye toh decret likhna
  // means humne jo .env file banaya hai uska data hume access karna hai toh hum process.env se access kar sakte hai
  // console.log(process.env.SECRET);
  
  const express = require("express");
  const app=express();
  const mongoose = require("mongoose");
  const Listing = require("./models/listing");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  // expresserror ko require karenge tab hi hum use use kar payenge
  const ExpressError = require("./utils/ExpresError");
  const session = require("express-session");
  const MongoStore = require('connect-mongo');
  // host kafne ke liye mongodb atlas se connect karenge hum through connect mongo
  
  
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user");
  
  const listingsRouter = require("./routes/listing");
  const reviewsRouter = require("./routes/review");
  const userRouter = require("./routes/user") ;
  
  // const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
  // to host our website we direclty write this mongo db
  // const dbUrl = process.env.ATLASDB_URL;
  
  main().then(()=>{
      console.log("connected to db");
  }).catch((err)=>{
   console.log(err);
  });
  
  // async function main(){
  async function main() {
    // await mongoose.connect(MONGO_URL);
      // mongodb atlas-> database->browse collections
      // isase kya honga ki hume hamaara data mongoatlas pe dala hai but ye local host par chalra hai isliye hume ye listings page par nhi dikhengi usko hume upar jake dekhna padenga upar wali sytep follow karke vo mongodb atlas me save rahengi
      // await mongoose.connect(MONGO_URL);
      
    await mongoose.connect(dbUrl); 
  }
      
  
  
  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));
  app.engine('ejs',ejsMate);
  app.use(express.static(path.join(__dirname,"/public")));
  
  
  // ye mongodb se connect karne ke liye use kare hai hum ye use kare hai
  // isase hamara session bhi mongodb.atlas me save ho jajyenga
  
  const store = MongoStore.create({
    // mongoUrl : MONGO_URL,
    mongoUrl : dbUrl, 
    crypto:{
      secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
  });
  
  store.on("error",() =>{
    console.log("ERROR IN MONGO SESSION STORE",err);
  });
  
  const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly:true
    },
  };
  
  
  
  // app.get("/",(req,res)=>{
  //   res.send("hi,Iam root");
  // });
  
  
  
  // ye session aaya hai ya nhi ye kaise pata chalenga humne hum jb run karenge toh inpect->application->cookies->localhost->ssid dikhengi mtlb sesson work kari hai
  app.use(session(sessionOptions));
  app.use(flash());
  // iska help se flash honga hamara stament
  
  app.use(passport.initialize());
  app.use(passport.session());
  // authentic method se user login and password kar sakta hai
  passport.use(new LocalStrategy(User.authenticate()));
  
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    // ab hum directly req.user use nhi kar sakte navbar me isliye uska local bananre hai that is curruser
    res.locals.currUser = req.user;
    next();3
  });
  
  // demo user
  // app.get("/demouser",async(req,res)=>{
  //   let fakeUser = new User({
  //     email:"student@gmail.com",
  //     username:"delta-student"
  //   });
  //  let registeredUser = await User.register(fakeUser,"helloworld");
  //   // password=helloworld
  //   res.send(registeredUser);
  // })
  
  
  
  
  // express router
  // humne jo common path cut kiya tha routes wale file hai vo yaha likhte hai
  app.use("/listings", listingsRouter);
  app.use("/listings/:id/reviews",reviewsRouter);
  app.use("/",userRouter);
  
  //    app.get("/testListing", async(req,res)=>{
  //     let sampleListing = new Listing({
  //         title:"My new villa",
  //         description:"by the beach",
  //         price:120,
  //         location:"Delhi,Goa",
  //         country:"India",
  //     });
  //     await sampleListing.save();
  //     console.log("sample was saved");
  //     res.send("succesful testing");
  // });
  
  
  // an upar humne jitne bhi route use kiya hai usase expresserror check karenag ki hamari res send hui hai ya nhi aur nhi hui hai toh pure se karenga
  // if req upar kisi route ke pass gya honga toh res send ho gya honga aur req upar kisi ke pass nhi gyi hongi toh vo app.all route par aayenge and yajha res send karengi
  // aise humne express error ko thow kar diya
  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not found!"));
  })
  // yaha humne custom handler use kiya hai jisme something went wrong print kiye the
  // ab yaya expresserror use kiya hai
  app.use((err,req,res,next)=>{
    // by default value et ki hai means agar koi status code ya message nhi honga err ke liye tih by default ye print honga
    let {statusCode=500,message="something went wrong"}=err;
    // yaha humn status ko set kar diya haiS
    // res.status(statusCode).send(message);
    // error.ejs
    // ye res.status se hum agar lovcal host me koi path dalre hai joki ga;lat hai toh vo bhi show hjonga
    res.status(statusCode).render("error",{message});
  
    // res.send("something went wrong!");
  });
  
  app.listen(8080,()=>{
      console.log("sever is listening to 8080");
  });