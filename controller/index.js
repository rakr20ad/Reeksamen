const express = require('express'); 
const router = express.Router(); 
const { ensureAuthenticated } = require('../Authentication/authMiddleware')

//Min velkommenside 
router.get('/', function(req, res){ 
    res.render('Welcome')
    });

//"Homepage" 
router.get('/homepage', ensureAuthenticated, function(req, res){ 
    res.render('homepage', {
        name: req.user.name
    })
    });

//Routes fra dashboard til de andre subsider + beskyttelse
//Kunne have benyttet mig af JWT-tokens, men dette er nemmere
// Her bruger jeg "function" og ikke => for at vise at 
// det kan gøre på begge måder
router.get('/likeDislike', ensureAuthenticated, function(req, res){  
    res.render('likeDislike', {
        name: req.user.name
})}); 
router.get('/matches', ensureAuthenticated, function(req, res){  
    res.render('matches', {
        name: req.user.name
})}); 
router.get('/profile', ensureAuthenticated, function(req, res){  
    res.render('profile', {
        name: req.user.name
    })});
router.get('/Home', ensureAuthenticated, function(req, res){
    res.send('homepage', {
        name: req.user.name
    })});


module.exports = router; 