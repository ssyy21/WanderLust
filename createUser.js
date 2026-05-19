require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/user");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
}

main()
.then(async () => {

    let fakeUser = new User({
        email: "demo@gmail.com",
        username: "demoUser"
    });

    const registeredUser = await User.register(fakeUser, "helloworld");

    console.log("USER CREATED:");
    console.log(registeredUser);

    mongoose.connection.close();
})
.catch((err) => {
    console.log(err);
});