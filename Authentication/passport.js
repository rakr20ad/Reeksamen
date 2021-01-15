const localStrategy = require('passport-local').Strategy;
//her bruges mongoose til at tjekke om man kan logge ind
//er email den samme, er password det samme osv. 
const mongoose = require('mongoose');
//Her dkrytper vi faktisk koden, for at tjekke om password matcher
const bcrypt = require('bcryptjs');

//her loader vi vores user model fra User.js 
const User = require('../Model/User'); 

module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'username' }, (username, password, done) => {
            //match User 
            // I min app, så er username  
            // Derfor er ens username unikt ligesom ens email ville være
            User.findOne({ username: username })
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'Username is not registered' });
                }

                //Match the password 
                // Her sørger vi for at begge passwords (den fra databasen og den med plain tekst) er ens ved brug af compare metoden 
                // Dette er ikke et krav, men viser lidt flair
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err) throw err; 

                    if(isMatch){
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    // Kilde: http://www.passportjs.org/docs/authenticate/
    // Search: "Sessions" with cmd f
    // serialization og deserialization logik er baseret på appen 
    // Det tillader appen at vælge en tilpas objektmappe 
    // Så den er uforstyrret af authentication lageret 
    // En users ID er lagret og gendannet som req.user
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}