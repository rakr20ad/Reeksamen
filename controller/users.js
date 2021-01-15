const express = require('express'); 
const router = express.Router(); 

//Her logger vi ind
router.get('/login', (req, res) => res.send('Login')); 

//Registeringsside 
router.get('/register', (req, res) => res.send('Register'));

module.exports = router; 