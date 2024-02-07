const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const { user } = require('../routes');
const validatePassword = require('../lib/passwordUtils').validatePassword;

//the passport documentation on the official website is sort of garbage



passport.use(
    new LocalStrategy(async (username, password, done) =>{
        console.log('in Local Strategy')
        try {
            //in this try/catch block we'll make sure the username and password match
            const user = await User.findOne({username});
            if(!user){
                console.log('error: no user with username');
                return done(null, false, {message: "Incorrect username"});
            }
            const isValid = validatePassword(password, user.hash, user.salt);
            if(!isValid){
                console.log('error: password incorrect');
                return done(null, false, {message: "Incorrect password"});
            }
            console.log('made it through the hoops, returning user');
                return done(null, user);
        } catch(err){
            console.log('an error happened here');
            return done(err);
        };
    })
);

passport.serializeUser((user,done)=>{
    console.log('serializeUser is running: ', user);
    done(null, user.id);
})
//put the user.id into the session

//deserialize will take the userId and then populate that to the req.user object -- so you have all the user info
passport.deserializeUser(async(id, done)=>{
    console.log('deserializeUser is happening: ');
    try {
        console.log('find user..', id);
        const user = await User.findById(id);
        if(user){
            return done(null, user);
        }
            return done(null, false);
    } catch (err) {
        console.log('straight to the error huh?')
               done(err);
    }
})
//