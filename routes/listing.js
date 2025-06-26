const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })


router.get("/category/:category", listingController.categorizeListing);

router.route("/")
    //INDEX
  .get(wrapAsync(listingController.index))
  //CREATE
  .post(isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))
    

// NEW ROUTE
router.get("/new", isLoggedIn , listingController.renderNewForm); 
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;