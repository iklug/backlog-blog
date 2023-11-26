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

const secretObject = {};
require("dotenv").config({processEnv: secretObject});

mongoose.set("strictQuery", false);
mongoose.connect(secretObject.SECRET_ACCESS);



const app = express();


app.use(express.json());
//takes things from forms with a name attribute and puts it at req.body.name
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(flash());
app.use(session({secret: secretObject.SECRET, resave: false, saveUninitialized: false}));
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
    console.log(req.user);
    next();
});

function checkAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/log-in')
    }
}
function checkNotAuth(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/currentUser');
    } else {
        next();
    }
}

const PORT = process.env.PORT || 3000;

// app.get('/', (req,res)=>{
//     return res.send('Im in');
// });


app.get('/sign-up', checkNotAuth, (req,res)=>{
    res.send('please sign in to the app..')
});
 
app.post("/sign-up",checkNotAuth, async (req,res,next)=>{
    try {
        bcrypt.hash(req.body.password, 10, async(err,hash)=>{
            if(err){
                next(err);
            }
            const user = User.create({
                username: req.body.username,
                password: hash,
            });
        });

        res.redirect('/log-in');
    } catch (err) {
        return next(err);
    }
});


app.post("/log-in", checkNotAuth, passport.authenticate('local', {
    successRedirect: '/currentUser',
    failureRedirect: '/login',
}));

app.get("/log-in", checkNotAuth, (req,res)=>{
    res.send('Please log in to the app');
});
app.delete("/logout", (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/log-in');
    });
   
})

app.get("/currentUser", checkAuth, (req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user._id;
        res.send(`Welcome, user ID: ${id}`);
    } else {
        res.redirect('/failed');
    }
});
app.get("/failed", (req,res)=>{
    res.send("Failed yo");
})
app.get("/success", (req,res)=>{
    res.send("Signed up successfully");
})
app.use('/user', routes.user);
app.use('/posts', routes.post);
app.use('/session', routes.session);
app.use('/comment', routes.comment);

app.listen(PORT, '0.0.0.0', ()=>console.log(`listening on port ${PORT}..`))