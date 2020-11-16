let express = require('express');
let router = express.Router();
let passport = require('passport');

let authMiddlewares = require('../middlewares/index.js');

const User = require('../models/user.js');

//Registration Logic
router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username, scores: 0, update: 1, 
                            items : [], locations : [], recentLogin : "", recentLogout : "" });
    User.register(newUser, req.body.password, (err, createdUser) => {
        if(err) {
            res.status(500).send({ error: "Error, registering the user!" });
            console.log(err);
        }
        passport.authenticate("local")(req, res, () => {
            res.send("Created new User! " + createdUser.username);
            console.log("Created User! " + createdUser.username);
        });
    });
});

//Login Logic
router.post("/login", passport.authenticate("local"), (req, res) => {
    let userBasicInfo = { username: req.user.username };
    User.updateOne({_id: req.user._id}, {
        recentLogin : req.body.time
    }, function(err, res) {
        if (err) console.log(err);
        else {
            console.log("user logged in " + req.user.username + " at " + req.body.time);
        }
    });
    return res.json(userBasicInfo);
});

//Log out Logic
router.post("/logout", authMiddlewares.isLoggedIn, (req, res) => {
    //console.log(req.body.time);
    User.updateOne({_id: req.user._id}, {
        recentLogout : req.body.time
    }, function(err, res) {
        if (err) console.log(err);
        else {
            console.log(req.body.username + " log out!");
            req.logOut();
        }
    });
    
    return res.sendStatus(200);
});

router.post("/update", authMiddlewares.isLoggedIn, (req, res) => {
    User.updateOne({_id: req.user._id}, {
        scores: (Number)(req.body.number),
    }, function(err, res) {
        if(err) console.log(err);
    });

    return res.sendStatus(200);
});

//scores logic
router.post("/scores", authMiddlewares.isLoggedIn, (req, res) => {
    User.updateOne({_id: req.user._id}, {
        scores: req.user.scores + req.user.update,  
    }, function(err, res) {
        if (err) console.log(err);
    });

    return res.sendStatus(200);
});

//scores logic
router.post("/recentLogin", authMiddlewares.isLoggedIn, (req, res) => {
    console.log(req.body.recentTime);
    User.updateOne({_id: req.user._id}, {
        scores: req.user.scores + (Number)(req.body.recentTime),  
    }, function(err, res) {
        if (err) console.log(err);
    });

    return res.sendStatus(200);
});

//scores logic
router.post("/buy", authMiddlewares.isLoggedIn, (req, res) => {
    if(req.user.scores >= 10) {
        User.updateOne({_id: req.user._id}, {
            $push : { items : req.body.itemName, locations : req.body.itemLocation },
            scores: req.user.scores - 10
        }, function(err, res) {
            if (err) console.log(err);
        });
    } else {
        console.log("You don't have many scores to buy an item")
    }

    return res.sendStatus(200);
});

router.post("/updatebutton", authMiddlewares.isLoggedIn, (req, res) => {

    if(req.user.scores >= 15) {
        User.updateOne({_id: req.user._id}, {
            update : req.user.update + 10,
            scores : req.user.scores - 15
        }, function(err, res) {
            if (err) console.log(err);
        });
    } else {
        console.log("You don't have many scores to buy an item")
    }

    return res.sendStatus(200);
});


// router.get('/logout', (req, res) => { 
//     req.logout(); 
//     req.session.destroy(); 
//     res.redirect('/'); 
// });

module.exports = router;