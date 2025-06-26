const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data"); // contains dummyListings array

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to DB");

    // Clear existing listings
    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    // Step 1: Add owner
    const listingsWithOwner = initData.data.map((listing) => ({
      ...listing,
      owner: "6856ea566542441fb0df1f92", // Replace with actual user ID if different
    }));

    // Step 2: Add category based on title
    for (let listing of listingsWithOwner) {
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
    }

    // Step 3: Insert new data
    await Listing.insertMany(listingsWithOwner);
    console.log("📦 Listings inserted with owner and categories");

    // Exit the process
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  }
}

main();
