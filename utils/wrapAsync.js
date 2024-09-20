// same function return like this with export
module.exports=(fn)=>{
    return (req,res,next)=>{
                fn(req,res,next).catch(next);
            };
        };





// function wrapAsync(fn){
    // ye function ek functon return karta hai and iska same kam hota hai ki function ko work kare with same argument and error hai toh uska next catch karta hai
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }