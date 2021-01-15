const express = require('express'); 
const router = express.Router(); 
const bcrypt = require('bcryptjs')

const User = require('../Model/User')

//Her logger vi ind
router.get('/login', (req, res) => res.render('Login')); 

//Registeringsside 
router.get('/register', (req, res) => res.render('Register'));

//Register handle
//handling a post request
//Det gør vi sådan her, da vi har connected users til app.js
// via. app.use('/users', require('./routes/users'))
//Laver en const variabel, som trækker info fra req.body (fra objektet inde i variablen)
router.post('/register', (req, res) => {
    const { name, username, age, Gender, prefGender, password, password2 } = req.body; 
    let errors = []
    console.log(req.body)

    //tjek om kravsfelterne er opfyldt. 
    // Her kunne man lave if statements til enhver af kravene
    // Men man kan sagtens have alle statements i en klamme
    // som er en hurtigere og mere effektiv måde
    if( !name || !username || !age || !Gender || !prefGender || !password || !password2){
        errors.push({ msg: 'Plz fill in all fields' })
    }

    //Tjek om passwords matcher 
    //Ikke et krav, men viser flair!
    if(password !== password2){
        errors.push({ msg: "Passwords are not identical" })
    }

    // Check password length
    if(password.length < 8){
        errors.push({ msg: 'Password needs more than 8 characters' })
    }
    
     //Vi gør dette, da hvis der er noget galt med 
    // nogle af info, så skal info ikke bare forsvinde
    //men vise hvor fejlen er (som jeg forstår det, eller se video omkring 34:29)
    // pga koden inde i register
    if(errors.length > 0) {
        res.render('register', {
            errors, 
            name, 
            username, 
            Gender, 
            prefGender,
            password, 
            password2
        })
    } else {
        User.findOne({ username: username })
        .then(user => {
            if(user) {
                //Tjekker om brugeren eksisterer
                errors.push({ msg: 'Username is already registered'})
                res.render('register', {
                    errors, 
                    name, 
                    username,
                    age,
                    Gender,
                    prefGender, 
                    password, 
                    password2
                })
            } else {
                 //Gør det kortere: behøver ikke sige fx name: name
                //da vi allerede har gjort det
                //Vi kan lave users og få det i vores terminal,
                //men dette får det ikke i databasen endnu
                const newUser = new User({ 
                    name, 
                    username,
                    age,
                    Gender, 
                    prefGender, 
                    password
                 });
                //Den krypterer det basically ens kodeord 
                //Som er en væsentlig del, så dem der er admin 
                //Eller styrer serveren kan logge ind og se 
                //Folks personlige oplysnigner, som er et brud på GDPR
                //Ikke et krav, men viser viden uden for pensum 
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err; 
                    //her hasher vi vores password, krypterer det. 
                    newUser.password = hash; 
                    //Gemmer brugeren
                    newUser.save()
                    .then(user =>{
                        //Her bruges en af de globale variabler 
                        req.flash('success_msg', 'You are now succesfully registered!')
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err))


                }))
            }
        })
    }
}); 

module.exports = router; 