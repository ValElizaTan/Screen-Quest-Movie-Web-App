const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({

    username: { type: String, unique: true },
    name: String,
    password: String,
    role: String,
    token: String

});

module.exports = mongoose.model('accounts', accountSchema);