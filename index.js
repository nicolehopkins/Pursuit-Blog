const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 4000;


// ROUTES
const userRouter = require('./routes/users');

app.use('/users', userRouter);


// MIDDLEWARE









app.listen(port, () => {
    console.log('Blog API is running on Port: '+ port);
});