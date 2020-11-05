let express = require('express');
let router = express.Router();

let authMiddleware = require('../middlewares/index.js');

let User = require('../models/user.js');

router.get("/me", authMiddleware.isLoggedIn, async (req, res) => {
    console.log("authenticated user had permission!");

    let user = await User.findById(req.user._id);

    return res.json(user);
});

module.exports = router;