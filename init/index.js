const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

// const initDB = async () => {
//     //deleting if some initial data is present
//     await Listing.deleteMany({});
//     //for aading owner in db
//     const listingsWithOwner = initData.data.map((obj) => 
//       ({...obj, 
//         owner: "6856ea566542441fb0df1f92" 
        
//       }));
//     await Listing.insertMany(listingsWithOwner);
//     console.log("New listings inserted");

//     await updateCategories();
// }
const updateCategories = async () => {
  const listings = await Listing.find({});

  for (let listing of listings) {
    const title = listing.title.toLowerCase();

    if (title.includes("mountain")) {
      listing.category = "Mountains";
    } else if (title.includes("castle")) {
      listing.category = "Castles";
    } else if (title.includes("room")) {
      listing.category = "Rooms";
    } else if (title.includes("beach")) {
      listing.category = "Beach";
    } else if (title.includes("villa")) {
      listing.category = "Modern";
    } else {
      listing.category = "Trending";
    }

    await listing.save();
  }

  console.log("🏷️ Categories updated based on titles");
};

updateCategories();

