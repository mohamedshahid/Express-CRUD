const mongoose = require('mongoose');
const {Schema} = mongoose;

const filmSchema = new Schema({
    name: String,
    img: String,
    summary: String,
});

mongoose.model('Film', filmSchema)