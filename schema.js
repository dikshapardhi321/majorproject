const Joi = require('joi');
//ye joi error ko identify karta hai

module.exports.listingSchema = Joi.object({
    // niche wali lin ka mtlb ye hai ki listing me listing nameka object honga hi becoz humne required use kiye hai
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        // min 0 means price negatve nhi hona chahiye
        price:Joi.string().required().min(0),
        image:Joi.string().allow("",null)
    }).required(),
});
// validatio of reviews for server side
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required(),
    }).required(),
});
    