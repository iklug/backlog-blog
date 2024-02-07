const { rawListeners } = require("../models/Post");

module.exports.isAuth = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('you are not authoriized to view this resource');
    }
}

module.exports.isAdmin = (req,res,next) => {
    if(req.isAuthenticated() && req.user.admin){
        next();
    } else {
        res.status(401).send('you are not admin');
    }
}