const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
// For at flash og express-session virker 
// Så skal man lave en middleware for det
const flash = require('connect-flash');
const session = require('express-session');

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

// Express-session middleware
// Hvad der står i secret er ligegyldigt, derfor har jeg skrevet 'hehe'
server.use(session({
    secret: 'Hehe',
    resave: true,
    saveUninitialized: true
  }));

// Middleware for connect flash: 
// Efter vi har lavet middleware'n for express-session og connect flash 
// Så skulle det være muligt at få adgang til request.flash
server.use(flash());

// Disse variabler kaldes for globale variabler 
// Da jeg benytter dem i dele af programmet 
// Og de er ikke, men KAN benyttes overalt 
server.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
});

//Ruter
server.use('/', require('./controller/index'))
server.use('/users', require('./controller/users'))

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`)); 
