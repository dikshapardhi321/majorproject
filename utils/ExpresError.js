// iska mtlb ye hai ki hum jab error aara tha toh somethink went wrong print kare the toh hum alag alag data bhi send kar sakte hai isliye hum expresserror use karte hai
class ExpressError extends Error{
    // so jaise hum localhost:8080/random dalengei jo route exit karta hi nhi toh page not fund print ho jayenga and if /listing/random dalenge toh vo upar wale route se compare karenag means listings/:id se and vp random ko as a id assume krenga us me page not fund print nhi honga
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message=message;
    }
}
module.exports = ExpressError;