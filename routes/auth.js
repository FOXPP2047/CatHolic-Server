let express = require('express');
let router = express.Router();
let passport = require('passport');

let authMiddlewares = require('../middlewares/index.js');

const User = require('../models/user.js');

//Registration Logic
router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username, scores: 0, update: 1, items : [] });

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
    console.log("user logged in " + req.user.username);
    return res.json(userBasicInfo);
});

//Log out Logic
router.post("/logout", authMiddlewares.isLoggedIn, (req, res) => {
    req.logOut();
    console.log(req.body.username + " log out!");
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
router.post("/buy", authMiddlewares.isLoggedIn, (req, res) => {
    
    if(req.user.scores >= 10) {
        User.updateOne({_id: req.user._id}, {
            $push : { items : req.body.itemName },
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