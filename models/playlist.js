const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
    name: { type: String, unique: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }],
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts"
    }
});

module.exports = mongoose.model('playlists', playlistSchema);