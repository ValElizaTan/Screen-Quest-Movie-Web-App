const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: { type: String, unique: true },
    overview: String,
    release_date: String,
    vote_average: String
});

module.exports = mongoose.model('movies', movieSchema);