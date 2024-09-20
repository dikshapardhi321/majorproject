const mongoose=require("mongoose");
const initData = require("./data");
// listings ko use karne ke liye listings ko define kare hai
const Listing=require("../models/listing");

const MONOGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(()=>{
    console.log("connected to Db");
  }).catch(err=>{
    console.log(err);
  });


async function main(){
    await mongoose.connect(MONOGO_URL);
}
// ye upar wale code se hamara connection stablize ho jayenga
const initDB = async () =>{
    // sabse pahale hum hamare data ko delte karenge
    await Listing.deleteMany({});
    // hum owner property usekare hai yahape
    // ... ka mtln obj ko convert karke owner se replace kar denge
   initData.data =  initData.data.map((obj)=>({...obj,owner:"66c9a244fe7430ae49fd6eda"}));
    // sab data delete karne ke bad hum hamra new data add karenge
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

// calling the initDB function
initDB();