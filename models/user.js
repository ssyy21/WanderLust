const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//We are only defining email in userschema as passport 
//autmoatically defines a usename and password along with salt and hashing
const userSchema = new Schema({
    email :{
        type : String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);