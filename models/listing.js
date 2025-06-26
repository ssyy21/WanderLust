const mongoose = require("mongoose");
const { title } = require("process");
//so that we don't have to write mongoose.Schema redudantly
const Schema = mongoose.Schema
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        url : String,
        filename : String,
    },
    price : Number,
    location: String,
    country: String,
    category: {
    type: String,
    enum: ['Mountains', 'Rooms', 'Castles', 'Trending', 'Iconic Cities', 'Beach', 'Modern', 'Amazing Pools' , 'Camping', 'Farms', 'Arctic', 'Domes', 'Boats'],
    required: true
},

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref : "User",
    },

});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
         await Review.deleteMany({_id: {$in: listing.reviews}});

    }
   
})
const Listing = mongoose.model("Listing" ,listingSchema);
module.exports = Listing;