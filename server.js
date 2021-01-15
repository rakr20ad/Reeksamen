const express = require('express'); 

const server = express(); 

//Ruter
server.use('/', require('./controller/index'))
server.use('/users', require('./controller/users'))

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`)); 
