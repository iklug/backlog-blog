const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done)=>{
        const user = getUserByUsername(username);
        if(!user){
            return done(null, false, {message: 'No user with that username'});
        }
        try {
            if(await bcyprt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, {message: "Password incorrect"});
            }
        } catch (err) {
            return done(err);
        }
    };
    
    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));
    pass.serializeUser((user, done)=>done(null, user.id));
    pass.deserializeUser((id, done)=>done(null, getUserById(id)));

}

module.exports = initialize;