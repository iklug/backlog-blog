const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const {v4} = require('uuid');
const cors = require('cors');
const mongoose = require('mongoose');
const uuidv4 = v4;
const routes = require('./routes/index');
const User = require('./models/User');
const Post = require('./models/Post');
const flash = require('express-flash');
const jwt = require('jsonwebtoken');

const secretObject = {};
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose.connect( process.env.DB_CONNECT);

const app = express();


app.use(express.json());
//takes things from forms with a name attribute and puts it at req.body.name
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(flash());
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false}));
//resave -- we dont resave if nothing has changed
//saveUninitialized -- do you want to save an empty value if there is no value?

//within local stategy, there is an optional object argument that takes 
//{usernameField: 'email'} in case the log in is not a username
passport.use(
    new LocalStrategy(async (username, password, done) =>{
        try {
            //in this try/catch block we'll make sure the username and password match
            const user = await User.findOne({username});
            if(!user){
                return done(null, false, {message: "Incorrect username"});
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        } catch(err){
            return done(err);
        };
    })
);

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id,done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch(err){
        done(err);
    }
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

function checkAuth(req,res,next){
    console.log('we are in checkAuth');
    console.log(req.user);
    if(req.isAuthenticated()){
        return next();
    } else {
        res.json({message: 'Please log in'});
    }
}
function checkNotAuth(req,res,next){
    if(req.isAuthenticated()){
        res.json({message: 'Already logged in'});
    } else {
        next();
    }
}


const PORT = process.env.PORT || 3000;


app.post('/api', verifyToken, (req,res)=>{
    res.json({message: 'howdy', ...req.user});
});


app.post("/sign-up",checkNotAuth, async (req,res,next)=>{
    try {
        bcrypt.hash(req.body.password, 10, async(err,hash)=>{
            if(err){
                next(err);
            }
            const user = await User.create({
                username: req.body.username,
                password: hash,
            });
        });

        res.status(200).json({success: true, data: req.user});
    } catch (err) {
        return next(err);
    }
});

app.post('/token', async(req,res)=>{

    const refreshToken = req.body.token;
    if(refreshToken == null) return res.status(401).json({message: 'refresh token not real'});

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, user)=>{
      if (err) return res.status(403).json({message: 'invalid refresh token'});
    //   const user2 = {...user._doc, password: 'redacted'};
    const userData = await User.findById(user._id);
    if(userData.refreshToken !== refreshToken) return res.status(403).json({message: 'does not match user refreshToken'});
    const actualUser = {_id: user._id, username: user.username};
      const accessToken = generateAccessToken(actualUser);
       res.json({accessToken}); 

    });
});


app.post("/log-in", checkNotAuth, passport.authenticate('local'),async(req,res)=>{
    const user = {_id: req.user._doc._id, username: req.user.username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h'});
    const userData = await User.findById(req.user._doc._id);
    userData.refreshToken = refreshToken;
    userData.save();
    res.json({accessToken, refreshToken});
});

//options object removed from passport.authenticate()
// {
//     successRedirect: '/currentUser',
//     failureRedirect: '/log-in',
// }
//the redirects are causing problems when integrating with my front end
//because all the re routing should now be client side


app.delete("/logout", verifyToken, async(req,res)=>{

    // const userData = await User.findById(req.user._id);
    // userData.refreshToken = 'null';
    // userData.save();

    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.json({message: `User has been logged out`});
    });
   
})

app.get("/currentUser", checkAuth, (req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user._id;
        res.json({message: `Current user is ${req.user.username}`});
    } else {
        res.json({message: 'Already logged in'});
    }
});

app.use('/posts', routes.post);
app.use('/comments', routes.comment);

//FORMAT of TOKEN
//Authorization: Bearer <access_token>
//we need to pull the token out


function verifyToken(req,res,next) {
    //get auth header value
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401).json({message: "aww booty"}); //== allows coercion
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData)=>{
        if(err) return res.status(401).json({message:'incorrect access token'});
        req.user = authData;
        next();
    })
}

function generateAccessToken(user){
    console.log('generate user: ///',user);
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}


app.listen(PORT, '0.0.0.0', ()=>console.log(`listening on port ${PORT}..`));


//jwt tutorial

//right now when we create a token they have access forever
//so we need to do something about that

//we put an expiration date on an access token, and then we use refresh tokens

