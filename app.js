if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const dbUrl = process.env.ATLASDB_URL;

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { required } = require("joi");
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main().then(() =>{
    console.log("connected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto :{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});
store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE" , err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60* 1000,//millisecs
        maxAge: 7*24*60*60* 1000,
        httpOnly: true,

    }
};


app.use(session(sessionOptions));
app.use(flash());


//Authentication and Authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//for flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    //defining variable to access user in navbar.ejs
    res.locals.currUser = req.user;
    next();
});

//Demo user to check working of passport
// app.get("/demouser" , async(req,res) =>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username: "delta-student"
//     });
//     //(user, password) is stored
//     //it will save this user with this password in DB
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });
app.get("/", (req, res) => {
    res.render("home");
});


//To use our listing route as we are using express.Routes
app.use("/listings", listingRouter);
//To use our review route as we are using express.Routes
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);



app.use((err, req, res, next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    // res.render("error.ejs", {message});
     res.status(statusCode).send(message);
    
});

// app.listen(8080, () =>{
//     console.log("server is listening to port 8080")
// });
app.listen(3000, (err) => {
    if (err) {
        console.log("Error in starting server:", err);
    } else {
        console.log("server is listening to port 3000");
    }
});
