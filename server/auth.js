




const checkAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        console.log('user authenticated..')
        next();
    } else {
        console.log('not authenticated')
        res.status(401).json('user not authenticated');
    }
}

const checkNoAuth = (req,res,next) => {
    console.log('it is running in auth.js');
    if(req.isAuthenticated()){
        console.log('user is already logged in');
        res.status(401).json('you are already logged in tho??');
    } else {
        next();
    }
}

const checkAdmin = (req,res,next) => {
    if(req.isAuthenticated() && req.user.admin){
        console.log('user is admin..')
        next();
    } else {
        console.log('user is either not authenticated or not admin')
        res.status(401).json('user not authenticated and admin');
    }
}


module.exports.checkAuth = checkAuth;
module.exports.checkNoAuth = checkNoAuth;
module.exports.checkAdmin = checkAdmin;