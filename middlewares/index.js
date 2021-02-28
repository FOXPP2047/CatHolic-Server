let authMiddleware = {};

authMiddleware.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        console.log("user tried to access without being logged in");
        res.send("user tried to access without being logged in");
    }
}

module.exports = authMiddleware;