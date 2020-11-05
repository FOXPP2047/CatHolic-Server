let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local');

let User = require('./models/user.js');

let app = express();

let authRoutes = require('./routes/auth.js');
let userRoutes = require('./routes/users.js');

mongoose.connect('mongodb://localhost:27017/catholic', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: "Hello, I'm Walt Cho",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", authRoutes);
app.use("/", userRoutes);

app.listen(80, function() {
    console.log('Server initialized - production');
});