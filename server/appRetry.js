const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const crypto = require('crypto');
const MongoDBStore = require('connect-mongodb-session')(session);
const routes = require('./routes/index');

const genPassword = require('./lib/passwordUtils').genPassword;
const User = require('./models/User');

const checkAuth = require('./auth').checkAuth;
const checkNoAuth = require('./auth').checkNoAuth;

require("dotenv").config();

const app = express();

mongoose.connect( process.env.DB_CONNECT);

const connection = mongoose.connect(process.env.DB_CONNECT);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: function (origin, callback) {
      // Allow requests from any origin in a development environment
      if (process.env.NODE_ENV !== 'production' || !origin) {
        return callback(null, true);
      }
  
      // Check if the request's origin is allowed
      const allowedOrigins = ['http://localhost:5173']; // Add your allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

const sessionStore = new MongoDBStore({
    uri: process.env.DB_CONNECT,
    mongooseConnection: connection,
    collection: 'sessions',
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
});
sessionStore.on('error', (error)=>console.log(error));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true, //what does the session do if nothing is changed?
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds

    },
}));


require('./config/passport');

//these two middlewares are going to check that the passport session exists
//and they will grab the userId and turn it into req.user by using serialize and deserialize
//because of app.use this is happening on every route request
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    console.log('req.session ',req.session);
    console.log('req.user: ',req.user);
    next();
});

app.use('/posts', routes.post);
app.use('/comments', routes.comment);

app.post('/login', checkNoAuth, passport.authenticate('local'), (req,res,next)=>{
    // res.header('Access-Control-Allow-Methods', 'POST');
    console.log('but it is happening over here');
    res.json(req.user.admin);
});

app.post('/signup', async(req,res,next)=>{
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    try {
        const user = await User.create({
            username: req.body.username,
            hash: saltHash.hash,
            salt: saltHash.salt,
        });
        res.json(`${user.username} registered`);
    } catch (error) {
        console.error(error);
        res.status(500).send('error in the user creation');
    }
    
});



//put routes after middleware but before error handler
// app.get('/',(req,res,next)=>{
    
//     req.session.viewCount ? req.session.viewCount++ : req.session.viewCount = 1;

//     res.send(`You have visited this page ${req.session.viewCount} times.`);
// });

app.get('/session', checkAuth, (req,res,next)=>{
    console.log('🐸🐸🐸🐸🐸🐸🐸');
    const sessionInfo = {
        username: req.user.username,
        admin: req.user.admin
    }
    res.json(sessionInfo);
});

app.get('/logout', checkAuth, (req,res,next)=>{
    try {
        req.logout((err)=>{
            if(err){
                next(err);
            }
        });
        res.json('logged out');
    } catch (error) {
        console.log(error);
        console.error(error);
    }
});

app.get('/protected', checkAuth, (req,res,next)=>{
    const username = req.user.username;
    res.json(`${username} has access`);
});

function errorHandler(err,req,res,next){
    if(err){
        res.json('there was an error.');
    }

}


app.use(errorHandler);
app.listen(3000, ()=>console.log('Engines are go, listening on port 3000..'));

//what's the difference between a session and a cookie?
//session stored on the server side -- can store bigger data // we can store user credentials
// or like secret stuff

//cookie data is stored in browser -- it will be attached to every http request