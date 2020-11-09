let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

//Set up user Schema
let userSchma = new mongoose.Schema({
    username : String,
    password : String,
    scores : Number,
    update : Number, 
    items : [String],
    locations : [Number],
    recentLogin : String,
    recentLogout : String
});

userSchma.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchma);