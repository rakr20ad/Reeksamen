const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const server = express(); 

//Henter vi "nøglen til databasen"
const db = require('./Authentication/databaseMongo').MongoURI;

// Forbinder til to mongoDB og heraf benyttes mongoose 
// Her skal man huske at tilføje "useUnifiedTopology: true"
// Indeni tuborgklammerne, ellers brokker den sig
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB is working...'))
    .catch(err => console.log(err));

//EJS middleware
server.use(expressLayouts); 
server.set('view engine', 'ejs');

//Bodyparser
server.use(express.urlencoded({ extended: false }))

//Ruter
server.use('/', require('./controller/index'))
server.use('/users', require('./controller/users'))

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`)); 
