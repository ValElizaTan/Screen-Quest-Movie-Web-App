const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    name: String,
    type: { type: String, unique: true },
    price: String
});

module.exports = mongoose.model('tickets', ticketSchema);