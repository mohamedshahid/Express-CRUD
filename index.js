const express = require('express')
const bodyParser = require('body-parser');
const port = 3001
const mongoose = require('mongoose');
const databaseConfig = require('./config/database.config')

// connect mongoose
mongoose.connect(databaseConfig.url)
.then(() => {
    console.log('MongoDB connected successfully')
})
.catch( (error) => {
    console.error('Error while connecting to MongoDB', error);
})

// mongoose models
require('./schema/filmSchema');

const filmsRouter = require('./routes/films');

const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Function to serve all static files
// inside public directory.
app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.send(req.get('host'))
})

app.use('/films', filmsRouter)

// handle invalid request
app.use(function(req, res, next) {
    res.status(404);
    res.json({
        error: {
          'status':404,
          'message':'Invalid Request',
          'statusCode':404,
        },
         message: 'Invalid Request'
      });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})