const mongoose = require('mongoose');
const User = require('../models/User');
//require('dotenv').config

const dbString = 'mongodb+srv://myAtlasDBUser:pineapple9@myatlasclusteredu.q8nzaxd.mongodb.net/blog?retryWrites=true&w=majority';
const connection = mongoose.createConnection(dbString);

